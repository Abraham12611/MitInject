const path = require('path');
const { execSync } = require('child_process');

async function runCycle() {
    while (true) {
        try {
            console.log('Starting tweet cycle at:', new Date().toISOString());
            execSync('node scripts/run-full-cycle.js', {
                stdio: 'inherit',
                cwd: path.join(__dirname, '..')
            });
        } catch (error) {
            console.error('Error in tweet cycle:', error);
        }

        console.log('Sleeping for 12 hours...');
        await new Promise(resolve => setTimeout(resolve, 12 * 60 * 60 * 1000));
    }
}

runCycle().catch(console.error);
