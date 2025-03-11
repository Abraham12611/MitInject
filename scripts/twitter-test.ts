import { Scraper, SearchMode, Tweet as TwitterTweet } from 'agent-twitter-client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { TweetRepository } from './save-tweets';
import { Cookie } from 'tough-cookie';

dotenv.config();

// Cache directory for cookies
const CACHE_DIR = path.join(__dirname, '../.cache');
const COOKIE_FILE = path.join(CACHE_DIR, 'twitter-cookies.json');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Custom error class for Twitter-specific errors
class TwitterError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'TwitterError';
  }
}

// Environment validation schema with stricter rules
const configSchema = z.object({
  TWITTER_USERNAME: z.string()
    .min(1, "Twitter username is required")
    .max(15)
    .regex(/^[A-Za-z][A-Za-z0-9_]*[A-Za-z0-9]$|^[A-Za-z]$/, 'Invalid Twitter username format'),
  TWITTER_PASSWORD: z.string().min(1, "Twitter password is required"),
  TWITTER_EMAIL: z.string().email("Valid Twitter email is required"),
  TWITTER_RETRY_LIMIT: z.number().int().min(1).max(5).default(3),
  TWITTER_2FA_SECRET: z.string().optional(),
}).strict();

class RequestQueue {
  private queue: (() => Promise<any>)[] = [];
  private processing: boolean = false;
  private lastRequestTime: number = 0;
  private failedRequests = 0;
  private successfulRequests = 0;
  private MIN_REQUEST_INTERVAL = 2000 + Math.floor(Math.random() * 1000); // 2-3 seconds

  private async enforceRateLimit(retryCount: number = 0): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const baseDelay = this.MIN_REQUEST_INTERVAL;
    const backoffDelay = retryCount > 0 ? Math.min(baseDelay * Math.pow(2, retryCount), 30000) : 0;
    const totalDelay = Math.max(baseDelay - timeSinceLastRequest, 0) + backoffDelay;
    
    if (totalDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, totalDelay));
    }
    this.lastRequestTime = now;
  }

  async add<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        for (let retry = 0; retry < maxRetries; retry++) {
          try {
            await this.enforceRateLimit(retry);
            const result = await fn();
            this.successfulRequests++;
            
            // Reset failed requests counter on success
            if (this.failedRequests > 0) this.failedRequests--;
            
            resolve(result);
            return;
          } catch (error) {
            this.failedRequests++;
            console.error(`Request failed (attempt ${retry + 1}/${maxRetries}):`, error);
            
            // If we've had too many failures, add extra delay
            if (this.failedRequests > this.successfulRequests * 0.2) { // >20% failure rate
              console.log('High failure rate detected, adding cooldown period...');
              await new Promise(resolve => setTimeout(resolve, 15 * 60 * 1000)); // 15min cooldown
              this.failedRequests = 0;
              this.successfulRequests = 0;
            }
            
            if (retry === maxRetries - 1) {
              reject(error);
            }
          }
        }
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Error processing queued request:', error);
        }
      }
    }
    
    this.processing = false;
  }
}

async function setCookiesFromArray(scraper: Scraper, cookies: Cookie[]): Promise<void> {
  if (!cookies || !cookies.length) return;
  
  try {
    // Set cookies in batches to handle any failures
    const batchSize = 10;
    for (let i = 0; i < cookies.length; i += batchSize) {
      try {
        const batch = cookies.slice(i, i + batchSize);
        await scraper.setCookies(batch);
      } catch (error) {
        console.warn(`Failed to set cookie batch ${i}-${i + batchSize}:`, error);
      }
    }
    console.log('Cookies restored successfully');
  } catch (error) {
    console.error('Error setting cookies:', error);
    throw error;
  }
}

function loadCachedCookies(): Cookie[] {
  try {
    if (fs.existsSync(COOKIE_FILE)) {
      const data = fs.readFileSync(COOKIE_FILE, 'utf8');
      const cookiesData = JSON.parse(data);
      
      // Convert to tough-cookie format
      const now = Date.now();
      const validCookies = cookiesData
        .filter((cookieData: any) => {
          const isValid = (
            (!cookieData.expires || new Date(cookieData.expires).getTime() > now) &&
            (cookieData.domain?.includes('twitter.com') || cookieData.domain?.includes('.twitter.com'))
          );
          if (!isValid) {
            console.log(`Cookie ${cookieData.name} invalid:`, 
              cookieData.expires ? `expires: ${new Date(cookieData.expires).toISOString()}` : 'no expiry',
              `domain: ${cookieData.domain}`
            );
          }
          return isValid;
        })
        .map((cookieData: any) => Cookie.fromJSON(cookieData))
        .filter((cookie: Cookie | null): cookie is Cookie => cookie !== null);
      
      if (validCookies.length > 0) {
        console.log(`Found ${validCookies.length} valid cached cookies`);
        return validCookies;
      }
      
      console.log('No valid cookies found in cache');
      return [];
    }
  } catch (error) {
    console.warn('Failed to load cached cookies:', error);
  }
  return [];
}

function saveCookies(cookies: Cookie[]): void {
  try {
    // Set expiration for cookies that don't have it
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    
    const validCookies = cookies
      .filter(cookie => {
        return cookie.domain?.includes('twitter.com') || cookie.domain?.includes('.twitter.com');
      })
      .map(cookie => {
        if (!cookie.expires) {
          cookie.expires = fourHoursFromNow;
        }
        return cookie;
      });
    
    if (validCookies.length > 0) {
      // Convert to JSON-serializable format
      const cookiesJson = validCookies.map(cookie => cookie.toJSON());
      fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookiesJson, null, 2));
      console.log(`Saved ${validCookies.length} valid cookies to cache`);
    }
  } catch (error) {
    console.warn('Failed to save cookies:', error);
  }
}

export class TwitterClient {
  private static _instances: { [username: string]: Scraper } = {};
  private static sessionStartTimes: { [username: string]: number } = {};
  private static readonly SESSION_MAX_AGE = 4 * 60 * 60 * 1000; // 4 hours
  static requestQueue = new RequestQueue();

  static async getInstance(config: z.infer<typeof configSchema>): Promise<Scraper> {
    const { TWITTER_USERNAME: username } = config;
    const now = Date.now();
    
    // Check if session is too old
    if (this._instances[username] && 
        this.sessionStartTimes[username] && 
        now - this.sessionStartTimes[username] > this.SESSION_MAX_AGE) {
      console.log('Session age exceeded, creating new session');
      await this.cleanup(username);
      delete this._instances[username];
      delete this.sessionStartTimes[username];
    }

    // Check for existing valid instance
    if (this._instances[username]) {
      try {
        if (await this.validateSession(this._instances[username])) {
          console.log('Using existing valid session');
          return this._instances[username];
        }
      } catch (error) {
        console.log('Existing session invalid:', error);
        delete this._instances[username];
      }
    }

    const scraper = new Scraper();
    
    // Try to restore from cookies first
    const cachedCookies = loadCachedCookies();
    if (cachedCookies.length > 0) {
      try {
        await setCookiesFromArray(scraper, cachedCookies);
        // Add small delay and retry validation a few times
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (await this.validateSession(scraper)) {
            console.log('Successfully restored session from cookies');
            this._instances[username] = scraper;
            this.sessionStartTimes[username] = now;
            return scraper;
          }
          console.log(`Cookie validation attempt ${i + 1} failed, retrying...`);
        }
        console.log('Failed to restore from cookies after retries');
      } catch (error) {
        console.log('Failed to restore from cookies:', error);
      }
    }

    // Only attempt login if we couldn't restore from cookies
    console.log('Attempting fresh login...');
    try {
      await scraper.login(
        config.TWITTER_USERNAME,
        config.TWITTER_PASSWORD,
        config.TWITTER_EMAIL,
        config.TWITTER_2FA_SECRET
      );
      
      // Add retry logic for session validation after login
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (await this.validateSession(scraper)) {
          // Save the new cookies
          const cookies = await scraper.getCookies();
          saveCookies(cookies);
          this._instances[username] = scraper;
          this.sessionStartTimes[username] = now;
          return scraper;
        }
        console.log(`Login validation attempt ${i + 1} failed, retrying...`);
      }
      
      throw new Error('Login succeeded but session validation failed after retries');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  private static async validateSession(scraper: Scraper): Promise<boolean> {
    try {
      // First check if logged in
      const isLoggedIn = await scraper.isLoggedIn();
      if (!isLoggedIn) return false;

      // Then try a simple API call to verify session is working
      await scraper.fetchSearchTweets('from:twitter', 1, SearchMode.Latest);
      return true;
    } catch (error) {
      console.warn('Session validation failed:', error);
      return false;
    }
  }

  static async cleanup(username: string): Promise<void> {
    const scraper = this._instances[username];
    if (scraper) {
      try {
        const scraper_any = scraper as any;
        if (typeof scraper_any.destroy === 'function') {
          await scraper_any.destroy();
        } else if (typeof scraper_any.disconnect === 'function') {
          await scraper_any.disconnect();
        } else if (typeof scraper_any.close === 'function') {
          await scraper_any.close();
        }
        delete this._instances[username];
        console.log('Scraper cleanup completed successfully.');
      } catch (error) {
        console.error('Error cleaning up scraper:', error);
      }
    }
  }
}

async function searchTweets(query: string): Promise<void> {
  let scraper: Scraper | null = null;
  let tweetRepo: TweetRepository | null = null;
  
  try {
    const config = configSchema.parse({
      TWITTER_USERNAME: process.env.TWITTER_USERNAME,
      TWITTER_PASSWORD: process.env.TWITTER_PASSWORD,
      TWITTER_EMAIL: process.env.TWITTER_EMAIL || '',
      TWITTER_RETRY_LIMIT: parseInt(process.env.TWITTER_RETRY_LIMIT || '3'),
      TWITTER_2FA_SECRET: process.env.TWITTER_2FA_SECRET
    });

    scraper = await TwitterClient.getInstance(config);
    tweetRepo = new TweetRepository();

    // Add delay before search to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await TwitterClient.requestQueue.add(async () => {
      const result = await Promise.race([
        scraper!.fetchSearchTweets(query, 20, SearchMode.Latest),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new TwitterError('Search timeout', 'TIMEOUT')), 10000)
        )
      ]) as { tweets: TwitterTweet[] };
      return result;
    });

    if (!response || !Array.isArray(response.tweets)) {
      throw new TwitterError('No tweets returned from search', 'NO_RESULTS');
    }

    console.log(`Found ${response.tweets.length} tweets for query: ${query}`);

    // Save tweets to database
    for (const tweet of response.tweets) {
      // Ensure tweet has required fields before saving
      if (tweet.id && tweet.text && tweet.username) {
        await tweetRepo.saveTweet({
          id: tweet.id,
          text: tweet.text,
          username: tweet.username,
          likes: tweet.likes || 0,
          retweets: tweet.retweets || 0
        }, query);
        
        // Print out the tweets
        console.log(`\nTweet ${response.tweets.indexOf(tweet) + 1}:`);
        console.log(`Text: ${tweet.text}`);
        console.log(`Author: ${tweet.username}`);
        console.log(`Likes: ${tweet.likes || 0}`);
        console.log(`Retweets: ${tweet.retweets || 0}`);
        console.log('-------------------');
      } else {
        console.warn('Skipping tweet with missing required fields:', tweet);
      }
    }

  } catch (error) {
    if (error instanceof TwitterError) {
      console.error(`Twitter operation failed: ${error.message} (${error.code})`);
    } else if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:', error.errors);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  } finally {
    if (scraper && process.env.TWITTER_USERNAME) {
      await TwitterClient.cleanup(process.env.TWITTER_USERNAME);
    }
    if (tweetRepo) {
      await tweetRepo.close();
    }
  }
}

// Run the script with a test query
// const testQuery = process.argv[2] || '#crypto';
// searchTweets(testQuery)
//   .then(() => console.log('Script completed'))
//   .catch(error => {
//     if (error instanceof TwitterError) {
//       console.error(`Twitter operation failed: ${error.message} (${error.code})`);
//     } else {
//       console.error('Script failed:', error);
//     }
//     process.exit(1);
//   }); 
