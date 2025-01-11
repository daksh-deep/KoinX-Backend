const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config();

// Database connection function
const connectToDatabase = async () => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL);
        logger('Connected to MongoDB', 'INFO'); // Log successful connection
        console.log('Connected to MongoDB');
    } catch (err) {
        logger(`MongoDB connection error: ${err.message}`, 'ERROR'); // Log error
        process.exit(1); // Exit the process with failure if connection fails
    }
};

module.exports = connectToDatabase;
