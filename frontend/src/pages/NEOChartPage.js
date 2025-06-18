import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register necessary Chart.js components
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function NEOChartPage() {
    // Initialize default date range (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // State management
    const [startDate, setStartDate] = useState(sevenDaysAgo);
    const [endDate, setEndDate] = useState(today);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /**
     * Fetch NEO data from the backend and prepare it for chart display
     */
    const fetchNEOData = async () => {
        setSubmitted(true);
        setChartData(null);
        setError('');

        // Validate date range (NASA API allows max 7 days)
        const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        if (diffDays > 7 || diffDays < 0) {
            setError('Please select a date range of 7 days or fewer.');
            return;
        }

        setLoading(true);
        try {
            const formattedStart = startDate.toISOString().split('T')[0];
            const formattedEnd = endDate.toISOString().split('T')[0];

            const res = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/neo?start_date=${formattedStart}&end_date=${formattedEnd}`
            );

            const neoData = res.data.near_earth_objects;
            const labels = [];
            const sizes = [];

            // Process data: group by date and sum estimated sizes
            for (const date in neoData) {
                const asteroids = neoData[date];
                let totalSize = 0;

                asteroids.forEach((asteroid) => {
                    const size = asteroid.estimated_diameter.meters.estimated_diameter_max;
                    totalSize += size;
                });

                labels.push(date);
                sizes.push(totalSize.toFixed(2));
            }

            // Prepare data for Chart.js
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Total Estimated Diameter (m)',
                        data: sizes,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderRadius: 5,
                    },
                ],
            });
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div className="container mt-4">
            {/* Navigation back to homepage */}
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/')}>
                ⬅ Back to Home
            </button>

            <h2 className="mb-4">Near Earth Objects (NEO) Chart</h2>

            {/* Date range selection */}
            <div className="row mb-3">
                <div className="col-md-3 mb-2">
                    <label>Start Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="form-control"
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <label>End Date</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="form-control"
                    />
                </div>
                <div className="col-md-3 mb-2 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={fetchNEOData}>
                        Submit
                    </button>
                </div>
            </div>

            {/* Display messages or chart based on state */}
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <p>Loading chart...</p>}
            {!loading && chartData && (
                <div className="card p-3 shadow">
                    <Bar data={chartData} options={{ responsive: true }} />
                </div>
            )}
        </div>
    );
}

export default NEOChartPage;
