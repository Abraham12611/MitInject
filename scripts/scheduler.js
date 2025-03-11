// scripts/scheduler.js
const cron = require('node-cron');
const { exec } = require('child_process');

// Run every 12 hours at 00:00 and 12:00
cron.schedule('0 0,12 * * *', () => {
  const now = new Date().toLocaleString();
  console.log(`\n=== Starting scheduled cycle at ${now} ===`);
  
  exec('npm run full-cycle', { stdio: 'inherit' }, (error) => {
    if (error) {
      console.error('Cycle failed:', error.message);
      return;
    }
    console.log('=== Cycle completed successfully ===');
  });
});

console.log('Scheduler started. Will run full cycle every 12 hours...');

