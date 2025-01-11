const express = require('express');
const apiRoutes = require('./routes/api.routes');
const dotenv = require('dotenv');
const connectToDatabase = require('./configs/database.config');

// Initialize app
const app = express();

// Load environment variables
dotenv.config();

// Connect to the database
connectToDatabase();

// Middleware
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend is up and running!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.error(`Server startup error: ${err.message}`);
    }
});
