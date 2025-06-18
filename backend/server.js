// Import required modules
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Import NASA-related API routes
const nasaRoutes = require('./routes/nasa');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all requests
app.use(cors());

// Use NASA API routes with a base path
app.use('/api/nasa', nasaRoutes);

// Define the port from environment variables or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
