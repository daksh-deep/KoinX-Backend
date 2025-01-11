const express = require('express');
const router = express.Router();

// Controller functions
const { handleStats, handleDeviation } = require('../controllers/api.controller');

// Define routes
router.get('/stats', handleStats);
router.get('/deviation', handleDeviation);

// Export the router
module.exports = router;
