const mongoose = require('mongoose');

// Define the schema for CryptoData
const cryptoDataSchema = new mongoose.Schema({
    coin_id: {
        type: String,
        required: true,
        enum: ['bitcoin', 'matic-network', 'ethereum'], // Only allow specific coin IDs
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Ensures price cannot be negative
    },
    market_cap: {
        type: Number,
        required: true,
        min: 0, // Ensures market cap cannot be negative
    },
    change24h: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
module.exports = mongoose.model('CryptoData', cryptoDataSchema, 'coin_stats');
