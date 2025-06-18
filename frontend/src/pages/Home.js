import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate(); // React Router hook for navigation

  return (
    <div className="container text-center mt-5">
      {/* Page heading and introductory text */}
      <h1 className="mb-4">Welcome to NASA Explorer</h1>
      <p>Select a feature to explore</p>

      {/* Feature navigation buttons */}
      <div className="row mt-4">
        {/* APOD button */}
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-primary btn-lg w-100"
            onClick={() => navigate('/apod')}
          >
            Astronomy Picture of the Day
          </button>
        </div>

        {/* EONET button */}
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-danger btn-lg w-100"
            onClick={() => navigate('/eonet')}
          >
            Earth Events (EONET)
          </button>
        </div>

        {/* NEO button */}
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-warning btn-lg w-100"
            onClick={() => navigate('/neo')}
          >
            Asteroid Chart (NEO)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
