import React, { useState } from 'react';
import { Home } from 'lucide-react';
import './App.css';

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
      prediction: satisfaction,
      timestamp: new Date().toLocaleString()
    };

    setPredictions(prev => [...prev, newPrediction]);
    return satisfaction;
  };

  const handlePredict = () => setPredictionResult(predictSatisfaction());

  const Navigation = () => (
    <div className="nav">
      {currentPage === 'home' && <Home className="home-icon" />}
      <button className="btn btn-amber" onClick={() => setCurrentPage('home')}>Home</button>
      <button className="btn btn-amber" onClick={() => setCurrentPage('about')}>About Us</button>
      <button className="btn btn-amber" onClick={() => setCurrentPage('predict')}>Predict</button>
      <button className="btn btn-amber" onClick={() => setCurrentPage('reports')}>Reports</button>
    </div>
  );

  const HomePage = () => (
    <div className="center">
      <h1 className="h1-xl">WELCOME TO AIRLINE PASSENGER SATISFACTION SYSTEM</h1>
      <div className="card centered">
        <img
          className="hero-img"
          alt="Happy passengers at airport"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Crect fill='%23e3f2fd' width='1200' height='400'/%3E%3Cg%3E%3Cpath fill='%23fff' d='M0 300h1200v20H0z'/%3E%3Cpath fill='%23ddd' d='M50 200h100v100H50z M200 150h100v150H200z M350 180h100v120H350z M900 200h100v100H900z M1050 150h100v150H1050z'/%3E%3Cpath fill='%23ccc' d='M100 200v-50l-30 25z M250 150v-40l-30 20z M400 180v-45l-30 22z M950 200v-50l-30 25z M1100 150v-40l-30 20z'/%3E%3Cellipse cx='120' cy='380' rx='80' ry='15' fill='%23bbb'/%3E%3Cellipse cx='180' cy='320' rx='60' ry='12' fill='%23bbb'/%3E%3Cpath fill='%23bbb' d='M850 250l150-30 50 20-150 30z M900 240l140-28v8l-140 28z'/%3E%3Cellipse cx='980' cy='280' rx='30' ry='30' fill='%23555'/%3E%3Cellipse cx='1050' cy='280' rx='30' ry='30' fill='%23555'/%3E%3Cellipse cx='1120' cy='280' rx='30' ry='30' fill='%23555'/%3E%3Cpath fill='%23e3f2fd' d='M920 200h140v40H920z'/%3E%3C/g%3E%3Cg%3E%3Cellipse cx='80' cy='100' rx='40' ry='50' fill='%23fdd'/%3E%3Cpath fill='%23fcc' d='M70 105l-15 8 15 8 15-8z'/%3E%3Cpath fill='%23999' d='M50 110h60v3H50z'/%3E%3Cpath fill='%23999' d='M30 50l30 15v10l-30-15z M130 50l-30 15v10l30-15z'/%3E%3C/g%3E%3Cg%3E%3Ccircle cx='500' cy='150' r='60' fill='%23fef3c7' opacity='0.3'/%3E%3Ccircle cx='520' cy='130' r='50' fill='%23fcd34d'/%3E%3Cpath d='M500 115c-5 0-8 3-8 8 0 3 2 5 5 6v-6h6c1-4-1-8-3-8z M540 115c5 0 8 3 8 8 0 3-2 5-5 6v-6h-6c-1-4 1-8 3-8z' fill='%23000'/%3E%3Cpath d='M505 140q15 8 30 0' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/g%3E%3Cg transform='translate(500,220)'%3E%3Cellipse cx='0' cy='80' rx='25' ry='80' fill='%232563eb'/%3E%3Ccircle cx='0' cy='0' r='35' fill='%23fcd5ce'/%3E%3Cellipse cx='-8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cellipse cx='8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cpath d='M-8 8q8 5 16 0' stroke='%23000' stroke-width='2' fill='none'/%3E%3Cpath fill='%23964B00' d='M-20 -15q-5-15 0-25 M20 -15q5-15 0-25'/%3E%3Cellipse cx='-30' cy='50' rx='8' ry='35' fill='%232563eb'/%3E%3Cellipse cx='30' cy='50' rx='8' ry='35' fill='%232563eb'/%3E%3Cellipse cx='-20' cy='160' rx='20' ry='22' fill='%231e3a8a'/%3E%3Cellipse cx='20' cy='160' rx='20' ry='22' fill='%231e3a8a'/%3E%3C/g%3E%3Cg transform='translate(700,220)'%3E%3Cellipse cx='0' cy='80' rx='25' ry='80' fill='%2314b8a6'/%3E%3Ccircle cx='0' cy='0' r='35' fill='%23fcd5ce'/%3E%3Cellipse cx='-8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cellipse cx='8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cpath fill='%23964B00' d='M-25 -10q-10-20 -5-30l40 5q5 10-5 30'/%3E%3Cellipse cx='-30' cy='50' rx='8' ry='35' fill='%2314b8a6'/%3E%3Cellipse cx='30' cy='50' rx='8' ry='35' fill='%2314b8a6'/%3E%3Cellipse cx='25' cy='85' rx='18' ry='25' fill='%235b21b6'/%3E%3Cellipse cx='-20' cy='160' rx='20' ry='22' fill='%23fb7185'/%3E%3Cellipse cx='20' cy='160' rx='20' ry='22' fill='%23fb7185'/%3E%3C/g%3E%3C/svg%3E"
        />
        <p className="lead" style={{fontWeight: 600}}>
          Predict passenger satisfaction with data-driven insights
        </p>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="section-narrow">
      <h1 className="h1-lg">About Us</h1>
      <div className="card">
        <div style={{color: 'var(--gray-700)', fontSize: '1.125rem', lineHeight: 1.75}}>
          <p>
            Welcome to the Airline Passenger Satisfaction System - a cutting-edge data mining solution
            designed to revolutionize how airlines understand and improve their customer experience.
          </p>
          <p>
            Our system leverages advanced machine learning algorithms to analyze various factors that
            contribute to passenger satisfaction, including seat comfort, in-flight services, baggage
            handling, and more.
          </p>

          <div style="--tw:1"></div>
          <div className="card" style={{background: 'var(--blue-50)', marginTop: '1.5rem'}}>
            <h3 style={{fontSize:'1.5rem', fontWeight:700, color:'var(--blue-800)', marginBottom:'1rem'}}>Key Features:</h3>
            <ul style={{display:'grid', rowGap:'0.75rem'}}>
              <li>✈️ Comprehensive satisfaction prediction based on multiple service parameters</li>
              <li>📊 Detailed reporting and analytics for tracking trends</li>
              <li>🎯 User-friendly interface for easy data input and visualization</li>
              <li>🔍 Real-time prediction results to support decision-making</li>
            </ul>
          </div>

          <p style={{marginTop:'1.5rem'}}>
            Our mission is to help airlines deliver exceptional service by understanding what matters most
            to their passengers. Through data-driven insights, we empower aviation companies to make
            informed decisions that enhance customer satisfaction and loyalty.
          </p>
        </div>
      </div>
    </div>
  );

  const PredictPage = () => (
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
              <select className="form-select"
                value={formData.gender}
                onChange={e => handleInputChange('gender', e.target.value)}>
                <option>Female</option><option>Male</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Customer Type</label>
              <select className="form-select"
                value={formData.customerType}
                onChange={e => handleInputChange('customerType', e.target.value)}>
                <option>Loyal</option><option>Disloyal</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Type of travel</label>
              <select className="form-select"
                value={formData.travelType}
                onChange={e => handleInputChange('travelType', e.target.value)}>
                <option>Business</option><option>Personal</option>
              </select>
            </div>

          <div className="form-row">
            <label className="form-label">Age</label>
            <input
              className="form-input"
              type="text"           // not "number" -> avoids browser quirks
              inputMode="numeric"   // mobile numeric keypad
              placeholder="e.g., 30"
              value={formData.age}  // keep as string in state
              onChange={(e) => {
                const v = e.target.value;
                // allow empty & up to 3 digits
                if (v === '' || /^[0-9]{0,3}$/.test(v)) {
                  handleInputChange('age', v);
                }
              }}
              onBlur={(e) => {
                // clamp to 0..120 on blur; leave empty if cleared
                const v = e.target.value;
                if (v !== '') {
                  const n = Math.max(0, Math.min(120, Number(v)));
                  handleInputChange('age', String(n));
                }
              }}
              autoComplete="off"
            />
          </div>



            <div className="form-row">
              <label className="form-label">Flight distance (miles)</label>
              <input className="form-input" type="number"
                value={formData.flightDistance}
                onChange={e => handleInputChange('flightDistance', parseInt(e.target.value || 0, 10))}/>
            </div>

            <div className="form-row">
              <label className="form-label">Departure Delay (mins)</label>
              <input className="form-input" type="number"
                value={formData.departureDelay}
                onChange={e => handleInputChange('departureDelay', parseInt(e.target.value || 0, 10))}/>
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
                <select className="form-select"
                  value={formData[key]}
                  onChange={e => handleInputChange(key, e.target.value)}>
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

  const ReportsPage = () => (
    <div className="section-wide">
      <h1 className="h1-lg">Prediction Reports</h1>
      <div className="card" style={{padding:0, overflow:'hidden'}}>
        {predictions.length === 0 ? (
          <div className="center" style={{padding:'4rem', color:'var(--gray-500)', fontSize:'1.25rem'}}>
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
                    <td style={{fontSize:'0.875rem'}}>{pred.timestamp}</td>
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
                    <td style={{fontWeight:800, color: pred.prediction === 'Satisfied' ? 'var(--green-500)' : 'var(--red-800)'}}>
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

  return (
    <div className="app">
      <div className="container">
        <div className="mb-8"><Navigation/></div>
        {currentPage === 'home' && <HomePage/>}
        {currentPage === 'about' && <AboutPage/>}
        {currentPage === 'predict' && <PredictPage/>}
        {currentPage === 'reports' && <ReportsPage/>}
      </div>
    </div>
  );
}
