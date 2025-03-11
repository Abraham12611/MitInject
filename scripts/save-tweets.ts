import sqlite3 from 'sqlite3';
import path from 'path';
import { Tweet as TwitterTweet } from 'agent-twitter-client';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../data/tweets.db');

interface Tweet {
  id: string;
  text: string;
  username: string;
  likes: number;
  retweets: number;
  profile_image_url?: string;
  timestamp?: number;
}

class TweetRepository {
  private db: sqlite3.Database;

  constructor() {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    fs.mkdirSync(dataDir, { recursive: true });
    
    this.db = new sqlite3.Database(DB_PATH);
    
    // Initialize database schema
    this.initializeDatabase();
  }

  private initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        try {
          // Create tweets table with all required columns
          this.db.run(`
            CREATE TABLE IF NOT EXISTS tweets (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              tweet_id TEXT UNIQUE,
              text TEXT NOT NULL,
              username TEXT NOT NULL,
              likes INTEGER DEFAULT 0,
              retweets INTEGER DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              tweet_timestamp INTEGER,
              query TEXT,
              hashtags TEXT,
              profile_image_url TEXT
            )
          `);

          // Create indexes
          this.db.run('CREATE INDEX IF NOT EXISTS idx_tweet_id ON tweets(tweet_id)');
          this.db.run('CREATE INDEX IF NOT EXISTS idx_username ON tweets(username)');
          this.db.run('CREATE INDEX IF NOT EXISTS idx_created_at ON tweets(created_at)');
          this.db.run('CREATE INDEX IF NOT EXISTS idx_tweet_timestamp ON tweets(tweet_timestamp)');
          
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async tweetExists(tweetId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT 1 FROM tweets WHERE tweet_id = ?',
        [tweetId],
        (err: Error | null, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(!!row);
        }
      );
    });
  }

  async saveTweet(tweet: Tweet, query?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const hashtags: string[] = []; // Explicitly type the array as string[]
      
      this.db.run(
        `INSERT OR IGNORE INTO tweets (
          tweet_id, 
          text, 
          username, 
          likes, 
          retweets, 
          query, 
          hashtags, 
          tweet_timestamp,
          profile_image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tweet.id,
          tweet.text,
          tweet.username,
          tweet.likes,
          tweet.retweets,
          query,
          hashtags.join(','),
          tweet.timestamp || Math.floor(Date.now() / 1000),
          tweet.profile_image_url
        ],
        (err: Error | null) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

export { TweetRepository };
export type { Tweet };