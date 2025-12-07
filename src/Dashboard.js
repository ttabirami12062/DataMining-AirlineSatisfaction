// Dashboard.js
import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/dashboard-summary');
        if (!res.ok) {
          throw new Error('Network error');
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data. Please make sure the Flask backend is running.');
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <div className="section-wide">
        <div className="dashboard-card">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="section-wide">
        <div className="dashboard-card">
          <p>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const totalPassengers = summary.total_passengers ?? 0;

  const satDist = summary.distributions?.satisfaction || {};
  const pctSatisfied = satDist['Satisfied'] ?? 0;
  const pctNotSatisfied = satDist['Not satisfied'] ?? 0;

  const custDist = summary.distributions?.customer_type || {};
  const pctLoyal = custDist['Loyal Customer'] ?? 0;

  const buildCrossData = (categoryKey) => {
    const cat = summary.by_category?.[categoryKey] || {};
    const labels = Object.keys(cat);
    const notSat = labels.map((label) => cat[label]['Not satisfied'] || 0);
    const sat = labels.map((label) => cat[label]['Satisfied'] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Not satisfied',
          data: notSat,
          backgroundColor: 'rgba(239, 68, 68, 0.85)',
        },
        {
          label: 'Satisfied',
          data: sat,
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
        },
      ],
    };
  };

  const crossOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count' },
      },
    },
    plugins: {
      legend: { position: 'top' },
    },
  };

  const satisfactionPieData = {
    labels: ['Not satisfied', 'Satisfied'],
    datasets: [
      {
        data: [pctNotSatisfied, pctSatisfied],
        backgroundColor: ['rgba(239, 68, 68, 0.85)', 'rgba(16, 185, 129, 0.85)'],
        borderWidth: 1,
      },
    ],
  };

  const satisfactionPieOptions = {
    plugins: {
      legend: { position: 'right' },
    },
  };

  return (
    <div className="section-wide">
      <div className="dashboard-card">
        <h1 className="h1-lg" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Airline Passenger Satisfaction – Dashboard
        </h1>

        <div className="dashboard-metrics">
          <div className="metric-card">
            <p className="metric-label">Total Passengers</p>
            <p className="metric-value">
              {totalPassengers.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-label">% Satisfied</p>
            <p className="metric-value">
              {pctSatisfied.toFixed(1)}%
            </p>
          </div>
          <div className="metric-card">
            <p className="metric-label">% Loyal Customers</p>
            <p className="metric-value">
              {pctLoyal.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="chart-box">
            <h3 className="chart-title">Satisfaction Distribution</h3>
            <div className="chart-inner">
              <Pie data={satisfactionPieData} options={satisfactionPieOptions} />
            </div>
          </div>

          <p className="chart-note">
            The satisfaction variable is fairly balanced, with a slightly higher share of
            passengers marked as <strong>Not satisfied</strong> compared to{' '}
            <strong>Satisfied</strong>.
          </p>
        </div>

        <h2 className="h2-md" style={{ marginTop: '2rem' }}>Passenger Profile</h2>

        <div className="profile-grid">
          <div className="chart-box">
            <h3 className="chart-title">Gender vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar data={buildCrossData('gender')} options={crossOptions} />
            </div>
            <p className="chart-caption">
              Gender is almost evenly split between male and female passengers.
            </p>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Customer Type vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar data={buildCrossData('customer_type')} options={crossOptions} />
            </div>
            <p className="chart-caption">
              Most passengers in the dataset are labelled as loyal customers.
            </p>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Type of Travel vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar data={buildCrossData('travel')} options={crossOptions} />
            </div>
            <p className="chart-caption">
              Business travel makes up the majority of trips in this dataset.
            </p>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Class vs Satisfaction</h3>
            <div className="chart-inner">
              <Bar data={buildCrossData('class')} options={crossOptions} />
            </div>
            <p className="chart-caption">
              Most passengers fly in Business or Eco class, with a smaller share in Eco Plus.
            </p>
          </div>
        </div>

        <p className="chart-footnote">
          This dashboard provides a quick overview of the cleaned training dataset
          used for the airline passenger satisfaction project.
        </p>
      </div>
    </div>
  );
}
