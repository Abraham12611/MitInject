import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../data/tweets.db');

// Ensure the data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
function initializeDb() {
  try {
    const db = new Database(DB_PATH);
    console.log('Connected to SQLite database');

    // Create tweets table
    db.exec(`
      CREATE TABLE IF NOT EXISTS tweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tweet_id TEXT UNIQUE,
        text TEXT NOT NULL,
        username TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        retweets INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        tweet_timestamp INTEGER,  -- Unix timestamp of when tweet was created
        query TEXT,
        hashtags TEXT,
        profile_image_url TEXT
      )
    `);
    console.log('Tweets table created or already exists');

    // Create hashtags table for better querying
    db.exec(`
      CREATE TABLE IF NOT EXISTS hashtags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tweet_id INTEGER,
        hashtag TEXT NOT NULL,
        FOREIGN KEY(tweet_id) REFERENCES tweets(id)
      )
    `);
    console.log('Hashtags table created or already exists');

    // Create indexes for better query performance
    db.exec('CREATE INDEX IF NOT EXISTS idx_tweet_id ON tweets(tweet_id)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_username ON tweets(username)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_created_at ON tweets(created_at)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_tweet_timestamp ON tweets(tweet_timestamp)');

    // Close the database connection
    db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run initialization
initializeDb();