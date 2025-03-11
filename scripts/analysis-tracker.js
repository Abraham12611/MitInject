const path = require('path');
const fs = require('fs');

const TRACKER_FILE = path.join(__dirname, '../data/analysis/walrus-transactions.json');

function readTracker() {
  try {
    if (!fs.existsSync(TRACKER_FILE)) return [];
    return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading tracker:', error.message);
    return [];
  }
}

function writeTracker(entries) {
  try {
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(entries, null, 2));
  } catch (error) {
    console.error('Error writing tracker:', error.message);
  }
}

function addTransaction(blobId, txDigest, analysisDate) {
  const entries = readTracker();
  entries.push({
    date: analysisDate,
    blobId,
    txDigest,
    timestamp: new Date().toISOString()
  });
  writeTracker(entries);
}

module.exports = { readTracker, addTransaction };
