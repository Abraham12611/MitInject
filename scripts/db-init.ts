import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../data/tweets.db');

// Initialize database
function initializeDb() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      return;
    }
    console.log('Connected to SQLite database');
  });

  // Create tweets table
  db.run(`
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
  `, (err) => {
    if (err) {
      console.error('Error creating tweets table:', err);
      return;
    }
    console.log('Tweets table created or already exists');
  });

  // Create hashtags table for better querying
  db.run(`
    CREATE TABLE IF NOT EXISTS hashtags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tweet_id INTEGER,
      hashtag TEXT NOT NULL,
      FOREIGN KEY(tweet_id) REFERENCES tweets(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating hashtags table:', err);
      return;
    }
    console.log('Hashtags table created or already exists');
  });

  // Create indexes for better query performance
  db.serialize(() => {
    db.run('CREATE INDEX IF NOT EXISTS idx_tweet_id ON tweets(tweet_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_username ON tweets(username)');
    db.run('CREATE INDEX IF NOT EXISTS idx_created_at ON tweets(created_at)');
    db.run('CREATE INDEX IF NOT EXISTS idx_tweet_timestamp ON tweets(tweet_timestamp)');
  });

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      return;
    }
    console.log('Database connection closed');
  });
}

// Run initialization
initializeDb();