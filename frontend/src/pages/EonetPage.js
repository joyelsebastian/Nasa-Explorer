import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Predefined dropdown options for filtering events
const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'wildfires', label: 'Wildfires' },
  { value: 'severeStorms', label: 'Severe Storms' },
  { value: 'volcanoes', label: 'Volcanoes' },
  { value: 'floods', label: 'Floods' },
  { value: 'landslides', label: 'Landslides' },
  { value: 'earthquakes', label: 'Earthquakes' },
  // Extendable: more categories can be added here
];

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

const daysOptions = [
  { value: 1, label: 'Last 1 day' },
  { value: 3, label: 'Last 3 days' },
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
];

function EonetPage() {
  // Component state for fetched data and filters
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [days, setDays] = useState(7);
  const [status, setStatus] = useState('open');
  const [category, setCategory] = useState('');

  const navigate = useNavigate();

  /**
   * Fetch EONET events from backend API based on selected filters
   */
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { days, status };
      if (category) params.category = category;

      const res = await axios.get('${process.env.REACT_APP_API_BASE_URL}/eonet', { params });
      setEvents(res.data.events || []);
    } catch (err) {
      setError('Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on initial page load
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mt-4">
      {/* Navigation back to homepage */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate('/')}
      >
        ⬅ Back to Home
      </button>

      <h2 className="mb-3">EONET: Natural Event Tracker</h2>

      {/* Filter controls */}
      <div className="row mb-3 align-items-end">
        {/* Days filter */}
        <div className="col-md-2">
          <label>Past days</label>
          <select
            className="form-control"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            {daysOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="col-md-2">
          <label>Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div className="col-md-3">
          <label>Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={fetchEvents}>
            🔍 Search
          </button>
        </div>
      </div>

      {/* Loading, error, or empty state messages */}
      {loading && <p>Loading events...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && events.length === 0 && (
        <div className="alert alert-warning">No events found.</div>
      )}

      {/* Render events in cards */}
      <div className="row">
        {events.map((evt) => (
          <div key={evt.id} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{evt.title}</h5>
                <p className="card-text">
                  Categories: {evt.categories.map((c) => c.title).join(', ')}<br />
                  Started: {new Date(evt.geometry[0].date).toLocaleDateString()}<br />
                  {evt.closed && <>Closed: {new Date(evt.closed).toLocaleDateString()}</>}
                </p>
                {/* Link removed by request; re-add if needed */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EonetPage;
