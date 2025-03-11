// Create src/lib/walrus.js
async function fetchBlobContent(blobId) {
    try {
      const response = await fetch(`https://publisher.walrus-testnet.walrus.space/v1/blobs/${blobId}`);
      if (!response.ok) throw new Error('Failed to fetch blob');
      return await response.text();
    } catch (error) {
      console.error('Error fetching blob content:', error);
      return null;
    }
  }