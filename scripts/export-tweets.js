const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../data/tweets.db');
const OUTPUT_PATH = path.join(__dirname, '../public/data/tweets.json');

// Ensure the output directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Clear the tweets.json file if it exists
if (fs.existsSync(OUTPUT_PATH)) {
  fs.unlinkSync(OUTPUT_PATH);
  console.log(`Cleared existing ${OUTPUT_PATH}`);
}

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }

  // Calculate timestamp for 12 hours ago
  const twelveHoursAgo = Math.floor((Date.now() - 12 * 60 * 60 * 1000) / 1000);

  const query = `
    SELECT 
      tweet_id as id,
      text,
      username,
      likes,
      retweets,
      datetime(tweet_timestamp, 'unixepoch') as created_at,
      query as category,
      profile_image_url
    FROM tweets 
    WHERE tweet_timestamp > ?
    ORDER BY tweet_timestamp DESC
  `;

  db.all(query, [twelveHoursAgo], (err, rows) => {
    if (err) {
      console.error('Query error:', err);
      process.exit(1);
    }

    // Format the timestamps nicely
    const formattedTweets = rows.map(tweet => ({
      ...tweet,
      created_at: tweet.created_at.replace('T', ' ')
    }));

    // Write to tweets.json
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(formattedTweets, null, 2));
    console.log(`Exported ${rows.length} tweets to ${OUTPUT_PATH}`);

    // Close the database connection
    db.close();
  });
});