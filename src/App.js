// App.js
import React, { useState } from 'react';
import { Home } from 'lucide-react';
import './App.css';

/* -------------------- Pages (outside parent to avoid remounts) -------------------- */

function Navigation({ currentPage, setCurrentPage }) {
  return (
    <div className="nav">
      {currentPage === 'home' && <Home className="home-icon" />}
      <button className="btn btn-amber" onClick={() => setCurrentPage('home')}>Home</button>
      <button className="btn btn-amber" onClick={() => setCurrentPage('about')}>About Us</button>
      <button className="btn btn-amber" onClick={() => setCurrentPage('predict')}>Predict</button>
      <button className="btn btn-amber" onClick={() => setCurrentPage('reports')}>Reports</button>
      <button className="btn btn-amber" onClick={() => setCurrentPage('Dashboard')}>Dashboard</button>
    </div>
  );
}

function HomePage() {
  return (
    <div className="center">
      <h1 className="h1-xl">WELCOME TO AIRLINE PASSENGER SATISFACTION SYSTEM</h1>
      <div className="card centered">
        <img
        className="hero-img"
        alt="Airline service"
        src="/images/airline.jpeg"
      />
        <p className="lead" style={{ fontWeight: 600 }}>
          Predict passenger satisfaction with data-driven insights
        </p>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="section-narrow">
      <h1 className="h1-lg">About Us</h1>
      <div className="card">
        <div style={{ color: 'var(--gray-700)', fontSize: '1.125rem', lineHeight: 1.75 }}>
          <p>
            Welcome to the Airline Passenger Satisfaction System - a cutting-edge data mining solution
            designed to revolutionize how airlines understand and improve their customer experience.
          </p>
          <p>
            Our system leverages advanced data mining algorithms to analyze various factors that
            contribute to passenger satisfaction, including seat comfort, in-flight services, baggage
            handling, and more.
          </p>

          <div className="card" style={{ background: 'var(--blue-50)', marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-800)', marginBottom: '1rem' }}>
              Key Features:
            </h3>
            <ul style={{ display: 'grid', rowGap: '0.75rem' }}>
              <li>User-friendly interface for easy data input and visualization</li>
              <li>Real-time prediction results to support decision-making</li>
              <li>Detailed reporting and analytics for tracking trends</li>
            </ul>
          </div>

          <p style={{ marginTop: '1.5rem' }}>
            Our mission is to help airlines deliver exceptional service by understanding what matters most
            to their passengers. Through data-driven insights, we empower aviation companies to make
            informed decisions that enhance customer satisfaction and loyalty.
          </p>
        </div>

            <div className="card" style={{ marginTop: '2rem', background: 'var(--gray-50)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '1rem' }}>
              Collaborators
            </h3>
            <ul style={{ display: 'grid', rowGap: '0.5rem' }}>
              <li>Nethra Janardhanan</li>
              <li>Abirami Thiyagarajan</li>
              <li>Sai Krishna Bharadwaj Burra</li>
            </ul>
          </div>
      </div>
    </div>
  );
}

function PredictPage({ formData, handleInputChange, handlePredict, predictionResult }) {
  return (
    <div className="section-narrow">
      <h1 className="h1-lg">Predict Passenger Satisfaction</h1>

      <div className="card">
        <p className="lead">Please enter the values to predict the satisfaction</p>
        <p className="muted">On scale of 0-5 for service ratings</p>

        <div className="form-grid">
          {/* Left column */}
          <div className="form-col">
            <div className="form-row">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={e => handleInputChange('gender', e.target.value)}
              >
                <option>Female</option><option>Male</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Customer Type</label>
              <select
                className="form-select"
                value={formData.customerType}
                onChange={e => handleInputChange('customerType', e.target.value)}
              >
                <option>Loyal</option><option>Disloyal</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Type of travel</label>
              <select
                className="form-select"
                value={formData.travelType}
                onChange={e => handleInputChange('travelType', e.target.value)}
              >
                <option>Business</option><option>Personal</option>
              </select>
            </div>

            {/* AGE — stable textbox (string while typing) */}
            <div className="form-row">
              <label className="form-label">Age</label>
              <input
                className="form-input"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 30"
                value={formData.age}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  handleInputChange('age', digits.slice(0, 3)); // allow up to 3 digits
                }}
                maxLength={3}
                autoComplete="off"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Flight distance (miles)</label>
              <input
                className="form-input"
                type="number"
                value={formData.flightDistance}
                onChange={e => handleInputChange('flightDistance', e.target.value
                )}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Departure Delay (mins)</label>
              <input
                className="form-input"
                type="number"
                value={formData.departureDelay}
                onChange={e => handleInputChange('departureDelay', e.target.value)}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="form-col">
            {[
              ['Seat Comfort','seatComfort'],
              ['Inflight Wifi','inflightWifi'],
              ['Online Boarding','onlineBoarding'],
              ['Cleanliness','cleanliness'],
              ['Baggage Handling','baggageHandling'],
              ['Gate Location','gateLocation'],
              ['Inflight entertainment','inflightEntertainment']
            ].map(([label, key]) => (
              <div className="form-row" key={key}>
                <label className="form-label">{label}</label>
                <select
                  className="form-select"
                  value={formData[key]}
                  onChange={e => handleInputChange(key, e.target.value)}
                >
                  <option>0</option><option>1</option><option>2</option>
                  <option>3</option><option>4</option><option>5</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="center mt-8">
          <button className="btn-primary" onClick={handlePredict}>Predict</button>
        </div>

        {predictionResult && (
          <div className="center mt-8">
            <div className={`badge ${predictionResult === 'Satisfied' ? 'badge--ok' : 'badge--bad'}`}>
              {predictionResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportsPage({ predictions }) {
  return (
    <div className="section-wide">
      <h1 className="h1-lg">Prediction Reports</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {predictions.length === 0 ? (
          <div className="center" style={{ padding: '4rem', color: 'var(--gray-500)', fontSize: '1.25rem' }}>
            No predictions yet. Go to the Predict page to create your first prediction.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Timestamp</th><th>Gender</th><th>Customer Type</th><th>Travel Type</th>
                  <th>Age</th><th>Distance</th><th>Seat Comfort</th><th>Wifi</th><th>Boarding</th>
                  <th>Cleanliness</th><th>Baggage</th><th>Gate</th><th>Entertainment</th>
                  <th className="font-bold">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td style={{ fontSize: '0.875rem' }}>{pred.timestamp}</td>
                    <td>{pred.gender}</td>
                    <td>{pred.customerType}</td>
                    <td>{pred.travelType}</td>
                    <td>{pred.age}</td>
                    <td>{pred.flightDistance}</td>
                    <td>{pred.seatComfort}</td>
                    <td>{pred.inflightWifi}</td>
                    <td>{pred.onlineBoarding}</td>
                    <td>{pred.cleanliness}</td>
                    <td>{pred.baggageHandling}</td>
                    <td>{pred.gateLocation}</td>
                    <td>{pred.inflightEntertainment}</td>
                    <td style={{ fontWeight: 800, color: pred.prediction === 'Satisfied' ? 'var(--green-500)' : 'var(--red-800)' }}>
                      {pred.prediction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- App ---------------------------------- */

export default function AirlineSatisfactionSystem() {
  const [currentPage, setCurrentPage] = useState('home');
  const [predictions, setPredictions] = useState([]);
  const [predictionResult, setPredictionResult] = useState('');

  const [formData, setFormData] = useState({
    gender: 'Female',
    customerType: 'Loyal',
    travelType: 'Business',
    age: '30',
    flightDistance: 1000,
    departureDelay: 0,
    seatComfort: '1',
    inflightWifi: '3',
    onlineBoarding: '3',
    cleanliness: '0',
    baggageHandling: '1',
    gateLocation: '2',
    inflightEntertainment: '1'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const predictSatisfaction = () => {
    const ratings = [
      parseInt(formData.seatComfort),
      parseInt(formData.inflightWifi),
      parseInt(formData.onlineBoarding),
      parseInt(formData.cleanliness),
      parseInt(formData.baggageHandling),
      parseInt(formData.gateLocation),
      parseInt(formData.inflightEntertainment)
    ];
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const satisfaction = avgRating >= 2.5 ? 'Satisfied' : 'Not satisfied';

    const newPrediction = {
      ...formData,
      // if you ever need numeric age, convert here:
      // age: Number(formData.age || 0),
      prediction: satisfaction,
      timestamp: new Date().toLocaleString()
    };

    setPredictions(prev => [...prev, newPrediction]);
    return satisfaction;
  };

  const handlePredict = () => setPredictionResult(predictSatisfaction());

  return (
    <div className="app">
      <div className="container">
        <div className="mb-8">
          <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>

        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'predict' && (
          <PredictPage
            formData={formData}
            handleInputChange={handleInputChange}
            handlePredict={handlePredict}
            predictionResult={predictionResult}
          />
        )}
        {currentPage === 'reports' && <ReportsPage predictions={predictions} />}
      </div>
    </div>
  );
}
