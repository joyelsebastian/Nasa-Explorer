import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

function APODPage() {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const navigate = useNavigate();

  /**
   * Fetch APOD data for a given date.
   * If today's APOD is unavailable, fallback to yesterday's.
   */
  const fetchAPOD = async (date) => {
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const formattedDate = formatDateToLocalISO(date);
      const res = await axios.get(`http://localhost:5000/api/nasa/apod?date=${formattedDate}`);
      setData(res.data);
    } catch (err) {
      // Graceful fallback if today's APOD is unavailable (e.g., due to publishing delays)
      const todayStr = formatDateToLocalISO(new Date());
      const requestedStr = formatDateToLocalISO(date);

      if (requestedStr === todayStr) {
        try {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = formatDateToLocalISO(yesterday);

          const res = await axios.get(`http://localhost:5000/api/nasa/apod?date=${yesterdayStr}`);
          setData(res.data);
          setInfoMessage("Today's APOD is not available yet. Showing yesterday's APOD instead.");
        } catch {
          setError('Failed to fetch APOD data');
          setData(null);
        }
      } else {
        setError('Failed to fetch APOD data. Please try another date.');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load APOD for today on component mount
  useEffect(() => {
    fetchAPOD(new Date());
  }, []);

  // Trigger a search for the selected date
  const handleSearch = () => {
    fetchAPOD(selectedDate);
  };

  return (
    <div className="container mt-4">
      {/* Navigation back to home page */}
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/')}>
        ⬅ Back to Home
      </button>

      <h2 className="mb-3">Astronomy Picture of the Day</h2>

      {/* Date picker and search button */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-4 mb-2">
          <label htmlFor="datepicker">Select a date</label>
          <DatePicker
            id="datepicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            maxDate={new Date()} // Prevent selecting future dates
            className="form-control"
          />
        </div>
        <div className="col-md-2 mb-2">
          <button
            className="btn btn-primary w-100"
            onClick={handleSearch}
            style={{ height: '38px' }}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Display loading, error, or fallback messages */}
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {infoMessage && <div className="alert alert-info">{infoMessage}</div>}

      {/* Display APOD content if available */}
      {data && (
        <div className="card shadow mb-4">
          {data.media_type === 'image' ? (
            // Display image with link to HD version
            <a href={data.hdurl} target="_blank" rel="noopener noreferrer">
              <img src={data.url} alt={data.title} className="card-img-top img-fluid" />
            </a>
          ) : data.media_type === 'video' ? (
            // Display video using iframe
            <div className="ratio ratio-16x9">
              <iframe
                src={data.url}
                title={data.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <p>Unsupported media type</p>
          )}

          {/* Metadata and description */}
          <div className="card-body">
            <h5 className="card-title">{data.title}</h5>
            <p className="card-text">{data.explanation}</p>
            <p className="text-muted">📅 {data.date}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format a Date object to YYYY-MM-DD (ISO) format,
 * which matches NASA API expectations.
 */
function formatDateToLocalISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default APODPage;
