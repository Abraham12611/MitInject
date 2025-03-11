// Load environment variables from .env.local
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { readTracker } = require('./analysis-tracker');

// Load from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const TWEETS_FILE = path.join(__dirname, '../public/data/tweets.json');
const ANALYSIS_DIR = path.join(__dirname, '../data/analysis');
const ANALYSIS_FILE = path.join(ANALYSIS_DIR, `market-analysis-${getLocalDate()}.json`);
const AGGREGATOR_ENDPOINT = process.env.WALRUS_AGGREGATOR || 'https://aggregator.walrus-testnet.walrus.space';

// Ensure analysis directory exists
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

const ANALYSIS_PROMPT = `As a highly experienced financial advisor and crypto market analyst, analyze the following collection of recent tweets from key opinion leaders and project teams. Based on these tweets, provide a comprehensive market analysis covering:

1. Overall Market Sentiment:
   - Aggregate sentiment across all tweets (bullish/bearish/neutral)
   - Key themes and narratives emerging from multiple sources
   - Consensus on market direction, if any

2. Project-Specific Insights:
   - Major project updates or announcements
   - Team activities and development progress
   - Community sentiment towards specific projects

3. Technical Analysis Summary:
   - Commonly mentioned support/resistance levels
   - Recurring technical patterns across tweets
   - Volume and price action insights
   - Potential breakout or breakdown points

4. Risk Assessment:
   - Identified market risks or concerns
   - Conflicting opinions or narratives
   - Potential market catalysts
   - Areas of uncertainty

5. Trading Opportunities:
   - High-conviction trade setups
   - Timeframes for potential moves
   - Risk/reward scenarios
   - Entry and exit levels mentioned

6. Key Recommendations:
   - Strategic market positioning
   - Risk management considerations
   - Projects to watch
   - Timeline expectations

Here are the recent tweets to analyze (grouped by source):

{tweets}

Please provide a structured analysis following the above format, synthesizing insights from all available tweets to form a coherent market perspective.`;

function getLocalDate() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-');
}

async function fetchPreviousAnalysis(blobId) {
  try {
    const response = await fetch(`${AGGREGATOR_ENDPOINT}/v1/blobs/${encodeURIComponent(blobId)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch analysis:', error.message);
    return null;
  }
}

async function analyzeText(text) {
  try {
    const response = await fetch('https://api.atoma.network/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ATOMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream: false,
        model: "deepseek-ai/DeepSeek-R1",
        messages: [{
          role: "user",
          content: ANALYSIS_PROMPT.replace('{tweets}', text)
        }],
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Split into thinking and analysis parts
    let thinking = '';
    let analysis = content;
    
    if (content.includes('<think>') && content.includes('</think>')) {
      const parts = content.split('</think>');
      thinking = parts[0].replace('<think>', '').trim();
      analysis = parts[1].trim();
    }
    
    return { thinking, analysis };
  } catch (error) {
    console.error('Error analyzing text:', error);
    return null;
  }
}

async function analyzeTweets() {
  try {
    // Read tweets
    const tweetsData = JSON.parse(fs.readFileSync(TWEETS_FILE, 'utf8'));
    console.log(`Found ${tweetsData.length} tweets to analyze`);

    // Group tweets by category and username
    const groupedTweets = tweetsData.reduce((acc, tweet) => {
      const key = `${tweet.category} - ${tweet.username}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(tweet);
      return acc;
    }, {});

    // Format tweets for analysis
    let formattedTweets = '';
    for (const [source, tweets] of Object.entries(groupedTweets)) {
      formattedTweets += `\n=== ${source} ===\n`;
      tweets.forEach(tweet => {
        formattedTweets += `[${new Date(tweet.created_at).toLocaleString()}] ${tweet.text}\n`;
      });
      formattedTweets += '\n';
    }

    console.log('Analyzing all tweets...');
    const analysisResult = await analyzeText(formattedTweets);

    if (analysisResult) {
      const result = {
        timestamp: new Date().toISOString(),
        tweet_count: tweetsData.length,
        time_range: {
          start: new Date(Math.min(...tweetsData.map(t => new Date(t.created_at)))).toISOString(),
          end: new Date(Math.max(...tweetsData.map(t => new Date(t.created_at)))).toISOString()
        },
        sources: Object.keys(groupedTweets),
        thinking_process: analysisResult.thinking,
        final_analysis: analysisResult.analysis
      };

      // Save analysis
      fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(result, null, 2));
      console.log(`Saved market analysis to ${ANALYSIS_FILE}`);
    }

  } catch (error) {
    console.error('Error in analyzeTweets:', error);
    process.exit(1); // Exit with error code for cron job monitoring
  }
}

// Run the analysis
analyzeTweets();
