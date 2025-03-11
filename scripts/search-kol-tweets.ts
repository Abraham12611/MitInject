import { Scraper, SearchMode, Tweet as TwitterTweet } from 'agent-twitter-client';
import dotenv from 'dotenv';
import { TweetRepository } from './save-tweets';
import { TwitterClient } from './twitter-test';

dotenv.config();

interface TwitterUser {
  profile_image_url?: string;
}

interface ExtendedTweet extends TwitterTweet {
  user?: TwitterUser;
}

interface TweetData {
  id: string;
  text: string;
  username: string;
  likes: number;
  retweets: number;
  timestamp: number;
  profile_image_url: string;
}

async function searchWithRetry(
  account: string,
  scraper: Scraper,
  maxRetries = 3
): Promise<ExtendedTweet[]> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to fetch tweets for ${account} (attempt ${attempt}/${maxRetries})`);
      
      const response = await TwitterClient.requestQueue.add(async () => {
        const result = await Promise.race([
          scraper.fetchSearchTweets(`from:${account}`, 50, SearchMode.Latest),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Search timeout')), 10000)
          )
        ]) as { tweets: ExtendedTweet[] };
        return result;
      });

      if (!response || !Array.isArray(response.tweets)) {
        throw new Error('Invalid response format');
      }

      return response.tweets;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return [];
}

async function getDefaultProfileImage(username: string): Promise<string> {
  // Return a default profile image URL based on the username
  // This ensures each user has a consistent profile image even if we can't fetch the real one
  return `https://unavatar.io/twitter/${username}`;
}

async function processBatch(
  accounts: string[],
  scraper: Scraper,
  tweetRepo: TweetRepository,
  category?: string,
  batchSize = 3
) {
  const twelveHoursAgo = Math.floor((Date.now() - 12 * 60 * 60 * 1000) / 1000);
  
  // Process accounts in batches
  for (let i = 0; i < accounts.length; i += batchSize) {
    const batch = accounts.slice(i, i + batchSize);
    const promises = batch.map(async (account) => {
      try {
        const tweets = await searchWithRetry(account, scraper);
        
        // Get default profile image URL for the account
        const profileImageUrl = await getDefaultProfileImage(account);
        console.log(`Using profile image for ${account}: ${profileImageUrl}`);
        
        // Process each tweet
        for (const tweet of tweets) {
          if (!tweet.id || !tweet.text || !tweet.username) {
            console.log('Skipping tweet with missing required fields');
            continue;
          }

          const currentTimestamp = Math.floor(Date.now() / 1000);
          const tweetData: TweetData = {
            id: tweet.id,
            text: tweet.text,
            username: tweet.username,
            likes: tweet.likes || 0,
            retweets: tweet.retweets || 0,
            timestamp: tweet.timestamp || currentTimestamp,
            profile_image_url: profileImageUrl
          };

          // Save tweet if it's recent enough
          if (tweetData.timestamp > twelveHoursAgo) {
            try {
              const exists = await tweetRepo.tweetExists(tweetData.id);
              if (!exists) {
                await tweetRepo.saveTweet(tweetData, category);
                console.log(`Saved tweet from ${tweetData.username}`);
              } else {
                console.log(`Tweet ${tweetData.id} already exists, skipping`);
              }
            } catch (error) {
              console.error(`Error saving tweet:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing account ${account}:`, error);
      }
    });

    await Promise.all(promises);
    
    if (i + batchSize < accounts.length) {
      // Wait between batches to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function searchKOLTweets(scraper: Scraper, tweetRepo: TweetRepository): Promise<void> {
  console.log('Starting KOL tweets search...');
  const category = process.env.TWITTER_PROJECT_CATEGORY_KOL || 'KOLs';
  console.log(`Using category: ${category}`);

  const accounts = [
    'MrBreadSmith',
    'mikecantmiss',
    'CleanwaterSui'
  ];

  await processBatch(accounts, scraper, tweetRepo, category);
}

async function searchProjectTweets(scraper: Scraper, tweetRepo: TweetRepository): Promise<void> {
  const accounts = [
    'Atoma_Network',
    'suilendprotocol',
    'rootlets_nft',
    'steammfi',
    'WalrusProtocol',
    'SuiNetwork'
  ];

  console.log('\nSearching tweets from projects:', accounts);

  for (const account of accounts) {
    console.log(`\nSearching tweets from ${account}...`);
    try {
      // Get default profile image URL for the account
      const profileImageUrl = await getDefaultProfileImage(account);
      console.log(`Using profile image for ${account}: ${profileImageUrl}`);
      
      const tweets = await searchWithRetry(account, scraper);
      for (const tweet of tweets) {
        if (!tweet.id || !tweet.text || !tweet.username) continue;

        const tweetData: TweetData = {
          id: tweet.id,
          text: tweet.text,
          username: tweet.username,
          likes: tweet.likes || 0,
          retweets: tweet.retweets || 0,
          timestamp: tweet.timestamp || Math.floor(Date.now() / 1000),
          profile_image_url: profileImageUrl
        };

        try {
          const exists = await tweetRepo.tweetExists(tweetData.id);
          if (!exists) {
            await tweetRepo.saveTweet(tweetData, process.env.TWITTER_PROJECT_CATEGORY || 'Projects');
            console.log(`Saved tweet from ${account}`);
          }
        } catch (error) {
          console.error(`Error saving tweet from ${account}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error fetching tweets from ${account}:`, error);
    }
  }
}

if (require.main === module) {
  // Initialize shared Twitter client and repo
  let scraper: Scraper | null = null;
  const tweetRepo = new TweetRepository();
  
  async function main() {
    try {
      // Add validation for required environment variables
      if (!process.env.TWITTER_USERNAME || !process.env.TWITTER_PASSWORD || !process.env.TWITTER_EMAIL) {
        throw new Error('Missing required Twitter credentials');
      }

      console.log('Initializing Twitter client...');
      scraper = await TwitterClient.getInstance({
        TWITTER_USERNAME: process.env.TWITTER_USERNAME,
        TWITTER_PASSWORD: process.env.TWITTER_PASSWORD,
        TWITTER_EMAIL: process.env.TWITTER_EMAIL,
        TWITTER_RETRY_LIMIT: 3,
        TWITTER_2FA_SECRET: process.env.TWITTER_2FA_SECRET
      });
      
      if (scraper) {
        await searchKOLTweets(scraper, tweetRepo);
        await searchProjectTweets(scraper, tweetRepo);
      }
      
    } catch (error) {
      console.error('Error in main:', error);
    } finally {
      await tweetRepo.close();
    }
  }

  main();
}