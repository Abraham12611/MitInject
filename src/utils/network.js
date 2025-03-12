// Mock network utilities

export const getInjectiveTPS = async () => {
  // Return a random TPS between 3000 and 5000
  return Math.floor(Math.random() * 2000) + 3000;
};

export const getInjectiveMetrics = async () => {
  return {
    gasPrice: (Math.random() * 0.0000001).toFixed(9),
    blockHeight: (Math.floor(Math.random() * 1000) + 18445000).toString()
  };
};

// Keep the old functions for backward compatibility
export const getSuiTPS = getInjectiveTPS;
export const getSuiMetrics = getInjectiveMetrics;