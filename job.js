const fetch = require('node-fetch');
const CryptoData = require('./models/crypto_data.model');
const connectToDatabase = require('./configs/database.config');
const logger = require('./utils/logger'); // Import logger

// Constants
const COIN_IDS = ['bitcoin', 'matic-network', 'ethereum'];
const RELATIVE_CURRENCY = 'usd';

// Get the job-specific log file path from environment variables
const JOB_LOG_FILE = process.env.JOB_LOG_FILE || './logs/job_logs.log';

// Connect to the database
connectToDatabase();

// Function to fetch and save data for a single coin
const fetchCoinData = async (coinId) => {
  try {
    logger(`Starting to fetch data for ${coinId}`, 'INFO', JOB_LOG_FILE); // Log job start
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);

    // Error handling for failed API request
    if (!response.ok) {
      const errorMessage = `Failed to fetch data for ${coinId}: ${response.statusText}`;
      logger(errorMessage, 'ERROR', JOB_LOG_FILE); // Log failure
      console.error(errorMessage);
      return;
    }

    const data = await response.json();

    // Extract relevant data
    const high24h = data.market_data.high_24h[RELATIVE_CURRENCY];
    const low24h = data.market_data.low_24h[RELATIVE_CURRENCY];
    const change24h = high24h - low24h;

    const coinData = {
      coin_id: coinId,
      price: data.market_data.current_price[RELATIVE_CURRENCY],
      market_cap: data.market_data.market_cap[RELATIVE_CURRENCY],
      change24h
    };

    // Save the data to the database
    const cryptoData = new CryptoData(coinData);
    await cryptoData.save();
    
    const successMessage = `Data for ${coinId} saved successfully.`;
    logger(successMessage, 'INFO', JOB_LOG_FILE); // Log success
    console.log(successMessage);
  } catch (err) {
    const errorMessage = `Error processing ${coinId}: ${err.message}`;
    logger(errorMessage, 'ERROR', JOB_LOG_FILE); // Log exception
    console.error(errorMessage);
  }
};

// Function to fetch and save data for all coins sequentially
const fetchDataForAllCoins = async () => {
  logger('Job started: Fetching data for all coins.', 'INFO', JOB_LOG_FILE); // Log job start
  for (const coinId of COIN_IDS) {
    await fetchCoinData(coinId); // Ensure sequential fetching and saving
  }
  logger('Job completed: All coin data fetched and saved.', 'INFO', JOB_LOG_FILE); // Log job end
};

/** 
 * Schedule a CRON JOB on services like Render, to run the script after avery 2 hours
 * Script entry point
 */
fetchDataForAllCoins();
