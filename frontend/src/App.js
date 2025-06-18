import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import Home from './pages/Home';
import APODPage from './pages/APODPage';
import EonetPage from './pages/EonetPage';
import NEOChartPage from './pages/NEOChartPage';

function App() {
  return (
    // Set up client-side routing using React Router
    <Router>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<Home />} />

        {/* Astronomy Picture of the Day page */}
        <Route path="/apod" element={<APODPage />} />

        {/* EONET (natural events) tracking page */}
        <Route path="/eonet" element={<EonetPage />} />

        {/* Near Earth Objects chart visualization page */}
        <Route path="/neo" element={<NEOChartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
