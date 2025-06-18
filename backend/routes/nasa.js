// Import required modules
const express = require('express');
const router = express.Router();

// Import NASA API controller functions
const { getAPOD, getNeoData, getEonetEvents } = require('../controllers/nasaController');

/**
 * @route   GET /api/nasa/neo
 * @desc    Fetch Near Earth Object (NEO) data from NASA's NeoWs API
 * @access  Public
 */
router.get('/neo', getNeoData);

/**
 * @route   GET /api/nasa/apod
 * @desc    Fetch Astronomy Picture of the Day (APOD) from NASA's APOD API
 * @access  Public
 */
router.get('/apod', getAPOD);

/**
 * @route   GET /api/nasa/eonet
 * @desc    Fetch recent Earth events from NASA's EONET API
 * @access  Public
 */
router.get('/eonet', getEonetEvents);

// Export the router to be used in the main application
module.exports = router;
