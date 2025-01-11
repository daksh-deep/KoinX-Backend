const fetch = require('node-fetch');
const coin_stats = require('../models/crypto_data.model');
const logger = require('../utils/logger');

// Constants
const RELATIVE_CURRENCY = 'usd';
const VALID_COINS = ['bitcoin', 'matic-network', 'ethereum'];

// Controller to handle stats request
const handleStats = async (req, res) => {
    const { coin } = req.body;

    if (!coin) {
        logger('Missing coin parameter in stats request', 'ERROR'); // Log missing coin parameter
        return res.status(400).json({ message: 'Coin is required' });
    }

    logger(`Stats request received for coin: ${coin}`, 'INFO'); // Log received request

    try {
        // Fetch data from CoinGecko API
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
        
        if (!response.ok) {
            logger(`Error fetching data from CoinGecko API for coin: ${coin}`, 'ERROR'); // Log API fetch error
            return res.status(500).json({ error: 'Error fetching data from CoinGecko API' });
        }

        const data = await response.json();

        // Extract the relevant data
        const high24h = data.market_data.high_24h[RELATIVE_CURRENCY];
        const low24h = data.market_data.low_24h[RELATIVE_CURRENCY];
        const change24h = high24h - low24h;

        const result = {
            price: data.market_data.current_price[RELATIVE_CURRENCY],
            market_cap: data.market_data.market_cap[RELATIVE_CURRENCY],
            '24hChange': change24h,
        };

        logger(`Stats request processed successfully for coin: ${coin}`, 'INFO'); // Log successful processing
        return res.status(200).json(result); // Return the data

    } catch (err) {
        logger(`Error processing stats request for coin: ${coin} - ${err.message}`, 'ERROR'); // Log exception
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to handle deviation request
const handleDeviation = async (req, res) => {
    const { coin } = req.body;

    if (!coin || !VALID_COINS.includes(coin)) {
        logger('Invalid or missing coin parameter in deviation request', 'ERROR'); // Log invalid or missing parameter
        return res.status(400).json({ error: 'Invalid or missing coin parameter.' });
    }

    logger(`Deviation request received for coin: ${coin}`, 'INFO'); // Log received request

    try {
        // Fetch the last 100 records for the requested coin
        const records = await coin_stats.find({ coin_id: coin })
            .sort({ createdAt: -1 })
            .limit(100)
            .select('price');
        
        if (records.length === 0) {
            logger(`No records found for coin: ${coin}`, 'WARN'); // Log no records found
            return res.status(404).json({ error: 'No records found for the requested coin.' });
        }

        logger(`Fetched ${records.length} records for coin: ${coin}`, 'INFO'); // Log number of records fetched

        // Extract prices and calculate the standard deviation
        const prices = records.map(item => item.price);
        const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
        const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / squaredDiffs.length;
        const deviation = Math.sqrt(avgSquaredDiff).toFixed(2);

        logger(`Deviation calculated successfully for coin: ${coin}`, 'INFO'); // Log successful calculation
        return res.json({ deviation });

    } catch (err) {
        logger(`Error processing deviation request for coin: ${coin} - ${err.message}`, 'ERROR'); // Log exception
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
};

module.exports = {
    handleStats,
    handleDeviation,
};
