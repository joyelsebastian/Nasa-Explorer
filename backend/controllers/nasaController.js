const axios = require('axios');

// Load NASA API key from environment variables
const NASA_API_KEY = process.env.NASA_API_KEY;

/**
 * Controller to fetch Astronomy Picture of the Day (APOD) from NASA API
 * Optional query parameter: date (YYYY-MM-DD)
 */
exports.getAPOD = async (req, res) => {
  try {
    const date = req.query.date; // Optional date filter
    let url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
    if (date) {
      url += `&date=${date}`;
    }

    // Fetch APOD data from NASA
    const response = await axios.get(url);

    // Return the JSON response
    res.json(response.data);
  } catch (err) {
    // Handle any request or network errors
    res.status(500).json({ error: 'Failed to fetch APOD data' });
  }
};

/**
 * Controller to fetch recent natural events from NASA's EONET API
 * Supported query parameters:
 * - days (default: 7)
 * - status (default: 'open')
 * - category (optional)
 */
exports.getEonetEvents = async (req, res) => {
  try {
    // Extract filters from query parameters
    const {
      days = '7',      // Number of past days to include
      status = 'open', // Event status filter: 'open' or 'closed'
      category = '',   // Optional event category filter
    } = req.query;

    // Build query string for EONET API
    const params = new URLSearchParams();
    params.append('days', days);
    params.append('status', status);
    if (category) {
      params.append('category', category);
    }

    const url = `https://eonet.gsfc.nasa.gov/api/v3/events?${params.toString()}`;

    // Fetch data from EONET API
    const response = await axios.get(url);

    // Return the list of events
    return res.json(response.data);
  } catch (err) {
    console.error('Error fetching EONET events:', err.message);
    res.status(500).json({ error: 'Failed to fetch EONET events' });
  }
};

/**
 * Controller to fetch Near Earth Object (NEO) data from NASA's NeoWs API
 * Required query parameters:
 * - start_date (YYYY-MM-DD)
 * - end_date (YYYY-MM-DD)
 */
exports.getNeoData = async (req, res) => {
  try {
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    // Build NEO API URL with query params and API key
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;

    // Fetch NEO data
    const response = await axios.get(url);

    // Return NEO data
    res.json(response.data);
  } catch (err) {
    // Handle errors during data fetching
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  }
};
