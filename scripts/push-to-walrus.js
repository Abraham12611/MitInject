// scripts/push-to-walrus.js
const fs = require('fs');
const path = require('path');
const { Blob } = require('buffer');
const { addTransaction } = require('./analysis-tracker');

// Configuration
const PUBLISHER_ENDPOINT = process.env.WALRUS_PUBLISHER || 'https://publisher.walrus-testnet.walrus.space';
const ANALYSIS_DIR = path.join(__dirname, '../data/analysis');

// Get local date in YYYY-MM-DD format
function getLocalDate() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }


async function pushAnalysisToWalrus() {
  try {
    // 1. Load latest analysis
    const today = getLocalDate();
    const analysisFile = path.join(ANALYSIS_DIR, `market-analysis-${today}.json`);
    
    // Check if analysis file exists
    if (!fs.existsSync(analysisFile)) {
      throw new Error(`Analysis file not found: ${analysisFile}`);
    }

    const { final_analysis } = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));

    // 2. Prepare the payload using native Blob
    const payload = new Blob([final_analysis], { type: 'text/plain' });
    const contentLength = Buffer.byteLength(final_analysis);

    // 3. Configure storage parameters
    const params = new URLSearchParams({
      epochs: 1,
      deletable: false,
      encodingType: 'utf-8'
    });

    // 4. Create the request using native fetch
    const url = `${PUBLISHER_ENDPOINT}/v1/blobs?${params}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': contentLength.toString()
      },
      body: payload
    });

    // 5. Handle response
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(`Walrus API Error: ${JSON.stringify(responseData)}`);
    }

    // 6. Save transaction details
    const resultFile = path.join(ANALYSIS_DIR, `walrus-transaction-${today}.json`);
    fs.writeFileSync(resultFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      ...(responseData.newlyCreated || responseData.alreadyCertified)
    }, null, 2));

    addTransaction(
      responseData.newlyCreated?.blobObject.blobId,
      responseData.newlyCreated?.blobObject.id,
      today
    );

    console.log('Successfully pushed analysis to Walrus!');
    console.log('Blob ID:', responseData.newlyCreated?.blobObject.blobId);
    console.log('Transaction Digest:', responseData.newlyCreated?.blobObject.id);

  } catch (error) {
    console.error('Error pushing to Walrus:', error.message);
    process.exit(1);
  }
}

// Execute
pushAnalysisToWalrus();