// scripts/run-full-cycle.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const NODE_MODULES = path.join(PROJECT_ROOT, 'node_modules');
const SCRIPTS_TSCONFIG = path.join(__dirname, 'tsconfig.json');

function clearTweetsFile() {
  const tweetsPath = path.join(__dirname, '../public/data/tweets.json');
  fs.writeFileSync(tweetsPath, JSON.stringify([], null, 2));
  console.log('Cleared tweets.json');
}

function runSearches() {
  console.log('=== Running Twitter searches ===');
  // Run the KOL tweet search which will insert into existing DB
  execSync(`${NODE_MODULES}/.bin/ts-node --project ${SCRIPTS_TSCONFIG} scripts/search-kol-tweets.ts`, { 
    stdio: 'inherit',
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      NODE_PATH: NODE_MODULES
    }
  });
}

function exportTweets() {
  console.log('Exporting tweets to JSON...');
  execSync('node scripts/export-tweets.js', { 
    stdio: 'inherit',
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      NODE_PATH: NODE_MODULES
    }
  });
}

function analyzeAndPush() {
  console.log('Generating analysis...');
  execSync('node scripts/analyze-tweets.js', { 
    stdio: 'inherit',
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      NODE_PATH: NODE_MODULES
    }
  });
  
  console.log('Pushing to Walrus...');
  execSync('node scripts/push-to-walrus.js', { 
    stdio: 'inherit',
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      NODE_PATH: NODE_MODULES
    }
  });
}

// Main execution flow
try {
  console.log('=== Starting 12-hour cycle ===');
  console.log('Current directory:', process.cwd());
  
  clearTweetsFile();
  runSearches();
  exportTweets();
  analyzeAndPush();
  console.log('=== Cycle completed successfully ===');
} catch (error) {
  console.error('Cycle failed:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}