import React, { useState } from 'react';
import { Home, Users, ClipboardCheck, FileText } from 'lucide-react';

export default function AirlineSatisfactionSystem() {
  const [currentPage, setCurrentPage] = useState('home');
  const [predictions, setPredictions] = useState([]);
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
    // Simple prediction logic based on average ratings
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

  const [predictionResult, setPredictionResult] = useState('');

  const handlePredict = () => {
    const result = predictSatisfaction();
    setPredictionResult(result);
  };

  const Navigation = () => (
    <div className="flex justify-center gap-4 mb-8 items-center relative">
      {currentPage === 'home' && (
        <Home className="w-12 h-12 text-gray-800 absolute left-0" />
      )}
      <button
        onClick={() => setCurrentPage('home')}
        className="px-6 py-3 bg-amber-200 hover:bg-amber-300 rounded-lg font-semibold transition-all shadow-md"
      >
        Home
      </button>
      <button
        onClick={() => setCurrentPage('about')}
        className="px-6 py-3 bg-amber-200 hover:bg-amber-300 rounded-lg font-semibold transition-all shadow-md"
      >
        About Us
      </button>
      <button
        onClick={() => setCurrentPage('predict')}
        className="px-6 py-3 bg-amber-200 hover:bg-amber-300 rounded-lg font-semibold transition-all shadow-md"
      >
        Predict
      </button>
      <button
        onClick={() => setCurrentPage('reports')}
        className="px-6 py-3 bg-amber-200 hover:bg-amber-300 rounded-lg font-semibold transition-all shadow-md"
      >
        Reports
      </button>
    </div>
  );

  const HomePage = () => (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-8 text-gray-800">
        WELCOME TO AIRLINE PASSENGER SATISFACTION SYSTEM
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <img 
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Crect fill='%23e3f2fd' width='1200' height='400'/%3E%3Cg%3E%3Cpath fill='%23fff' d='M0 300h1200v20H0z'/%3E%3Cpath fill='%23ddd' d='M50 200h100v100H50z M200 150h100v150H200z M350 180h100v120H350z M900 200h100v100H900z M1050 150h100v150H1050z'/%3E%3Cpath fill='%23ccc' d='M100 200v-50l-30 25z M250 150v-40l-30 20z M400 180v-45l-30 22z M950 200v-50l-30 25z M1100 150v-40l-30 20z'/%3E%3Cellipse cx='120' cy='380' rx='80' ry='15' fill='%23bbb'/%3E%3Cellipse cx='180' cy='320' rx='60' ry='12' fill='%23bbb'/%3E%3Cpath fill='%23bbb' d='M850 250l150-30 50 20-150 30z M900 240l140-28v8l-140 28z'/%3E%3Cellipse cx='980' cy='280' rx='30' ry='30' fill='%23555'/%3E%3Cellipse cx='1050' cy='280' rx='30' ry='30' fill='%23555'/%3E%3Cellipse cx='1120' cy='280' rx='30' ry='30' fill='%23555'/%3E%3Cpath fill='%23e3f2fd' d='M920 200h140v40H920z'/%3E%3C/g%3E%3Cg%3E%3Cellipse cx='80' cy='100' rx='40' ry='50' fill='%23fdd'/%3E%3Cpath fill='%23fcc' d='M70 105l-15 8 15 8 15-8z'/%3E%3Cpath fill='%23999' d='M50 110h60v3H50z'/%3E%3Cpath fill='%23999' d='M30 50l30 15v10l-30-15z M130 50l-30 15v10l30-15z'/%3E%3C/g%3E%3Cg%3E%3Ccircle cx='500' cy='150' r='60' fill='%23fef3c7' opacity='0.3'/%3E%3Ccircle cx='520' cy='130' r='50' fill='%23fcd34d'/%3E%3Cpath d='M500 115c-5 0-8 3-8 8 0 3 2 5 5 6v-6h6c1-4-1-8-3-8z M540 115c5 0 8 3 8 8 0 3-2 5-5 6v-6h-6c-1-4 1-8 3-8z' fill='%23000'/%3E%3Cpath d='M505 140q15 8 30 0' stroke='%23000' stroke-width='2' fill='none'/%3E%3C/g%3E%3Cg transform='translate(500,220)'%3E%3Cellipse cx='0' cy='80' rx='25' ry='80' fill='%232563eb'/%3E%3Ccircle cx='0' cy='0' r='35' fill='%23fcd5ce'/%3E%3Cellipse cx='-8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cellipse cx='8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cpath d='M-8 8q8 5 16 0' stroke='%23000' stroke-width='2' fill='none'/%3E%3Cpath fill='%23964B00' d='M-20 -15q-5-15 0-25 M20 -15q5-15 0-25'/%3E%3Cellipse cx='-30' cy='50' rx='8' ry='35' fill='%232563eb'/%3E%3Cellipse cx='30' cy='50' rx='8' ry='35' fill='%232563eb'/%3E%3Cellipse cx='-20' cy='160' rx='20' ry='22' fill='%231e3a8a'/%3E%3Cellipse cx='20' cy='160' rx='20' ry='22' fill='%231e3a8a'/%3E%3C/g%3E%3Cg transform='translate(700,220)'%3E%3Cellipse cx='0' cy='80' rx='25' ry='80' fill='%2314b8a6'/%3E%3Ccircle cx='0' cy='0' r='35' fill='%23fcd5ce'/%3E%3Cellipse cx='-8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cellipse cx='8' cy='-5' rx='4' ry='6' fill='%23000'/%3E%3Cpath d='M-8 8q8 5 16 0' stroke='%23000' stroke-width='2' fill='none'/%3E%3Cpath fill='%23964B00' d='M-25 -10q-10-20 -5-30l40 5q5 10-5 30'/%3E%3Cellipse cx='-30' cy='50' rx='8' ry='35' fill='%2314b8a6'/%3E%3Cellipse cx='30' cy='50' rx='8' ry='35' fill='%2314b8a6'/%3E%3Cellipse cx='25' cy='85' rx='18' ry='25' fill='%235b21b6'/%3E%3Cellipse cx='-20' cy='160' rx='20' ry='22' fill='%23fb7185'/%3E%3Cellipse cx='20' cy='160' rx='20' ry='22' fill='%23fb7185'/%3E%3C/g%3E%3C/svg%3E" 
          alt="Happy passengers at airport" 
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
        <p className="text-2xl text-gray-700 font-semibold">
          Predict passenger satisfaction with data-driven insights
        </p>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">About Us</h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Welcome to the Airline Passenger Satisfaction System - a cutting-edge data mining solution 
            designed to revolutionize how airlines understand and improve their customer experience.
          </p>
          <p>
            Our system leverages advanced machine learning algorithms to analyze various factors that 
            contribute to passenger satisfaction, including seat comfort, in-flight services, baggage 
            handling, and more.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">Key Features:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✈️</span>
                <span>Comprehensive satisfaction prediction based on multiple service parameters</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">📊</span>
                <span>Detailed reporting and analytics for tracking trends</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">🎯</span>
                <span>User-friendly interface for easy data input and visualization</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">🔍</span>
                <span>Real-time prediction results to support decision-making</span>
              </li>
            </ul>
          </div>
          <p className="mt-6">
            Our mission is to help airlines deliver exceptional service by understanding what matters 
            most to their passengers. Through data-driven insights, we empower aviation companies to 
            make informed decisions that enhance customer satisfaction and loyalty.
          </p>
        </div>
      </div>
    </div>
  );

  const PredictPage = () => (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Predict Passenger Satisfaction
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-center text-xl mb-6 text-gray-700">
          Please enter the values to predict the satisfaction
        </p>
        <p className="text-center text-sm mb-8 text-gray-600 italic">
          On scale of 0-5 for service ratings
        </p>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Customer Type</label>
              <select
                value={formData.customerType}
                onChange={(e) => handleInputChange('customerType', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>Loyal</option>
                <option>Disloyal</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Type of travel</label>
              <select
                value={formData.travelType}
                onChange={(e) => handleInputChange('travelType', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>Business</option>
                <option>Personal</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Age</label>
              <select
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>18</option>
                <option>20</option>
                <option>25</option>
                <option>30</option>
                <option>35</option>
                <option>40</option>
                <option>45</option>
                <option>50</option>
                <option>55</option>
                <option>60</option>
                <option>65</option>
                <option>70</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Flight distance (miles)</label>
              <input
                type="number"
                value={formData.flightDistance}
                onChange={(e) => handleInputChange('flightDistance', parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Departure Delay (mins)</label>
              <input
                type="number"
                value={formData.departureDelay}
                onChange={(e) => handleInputChange('departureDelay', parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Seat Comfort</label>
              <select
                value={formData.seatComfort}
                onChange={(e) => handleInputChange('seatComfort', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Inflight Wifi</label>
              <select
                value={formData.inflightWifi}
                onChange={(e) => handleInputChange('inflightWifi', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Online Boarding</label>
              <select
                value={formData.onlineBoarding}
                onChange={(e) => handleInputChange('onlineBoarding', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Cleanliness</label>
              <select
                value={formData.cleanliness}
                onChange={(e) => handleInputChange('cleanliness', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Baggage Handling</label>
              <select
                value={formData.baggageHandling}
                onChange={(e) => handleInputChange('baggageHandling', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Gate Location</label>
              <select
                value={formData.gateLocation}
                onChange={(e) => handleInputChange('gateLocation', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 w-48">Inflight entertainment</label>
              <select
                value={formData.inflightEntertainment}
                onChange={(e) => handleInputChange('inflightEntertainment', e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handlePredict}
            className="px-12 py-3 bg-green-400 hover:bg-green-500 text-gray-800 font-bold rounded-lg text-xl transition-all shadow-lg hover:shadow-xl"
          >
            Predict
          </button>
        </div>

        {predictionResult && (
          <div className="mt-8 text-center">
            <div className={`inline-block px-8 py-4 rounded-lg text-2xl font-bold ${
              predictionResult === 'Satisfied' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {predictionResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ReportsPage = () => (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Prediction Reports</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {predictions.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-xl">
            No predictions yet. Go to the Predict page to create your first prediction.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Customer Type</th>
                  <th className="px-4 py-3 text-left">Travel Type</th>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">Distance</th>
                  <th className="px-4 py-3 text-left">Seat Comfort</th>
                  <th className="px-4 py-3 text-left">Wifi</th>
                  <th className="px-4 py-3 text-left">Boarding</th>
                  <th className="px-4 py-3 text-left">Cleanliness</th>
                  <th className="px-4 py-3 text-left">Baggage</th>
                  <th className="px-4 py-3 text-left">Gate</th>
                  <th className="px-4 py-3 text-left">Entertainment</th>
                  <th className="px-4 py-3 text-left font-bold">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{pred.timestamp}</td>
                    <td className="px-4 py-3">{pred.gender}</td>
                    <td className="px-4 py-3">{pred.customerType}</td>
                    <td className="px-4 py-3">{pred.travelType}</td>
                    <td className="px-4 py-3">{pred.age}</td>
                    <td className="px-4 py-3">{pred.flightDistance}</td>
                    <td className="px-4 py-3">{pred.seatComfort}</td>
                    <td className="px-4 py-3">{pred.inflightWifi}</td>
                    <td className="px-4 py-3">{pred.onlineBoarding}</td>
                    <td className="px-4 py-3">{pred.cleanliness}</td>
                    <td className="px-4 py-3">{pred.baggageHandling}</td>
                    <td className="px-4 py-3">{pred.gateLocation}</td>
                    <td className="px-4 py-3">{pred.inflightEntertainment}</td>
                    <td className={`px-4 py-3 font-bold ${
                      pred.prediction === 'Satisfied' ? 'text-green-600' : 'text-red-600'
                    }`}>
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
    <div className="min-h-screen bg-gradient-to-br from-red-300 via-red-400 to-red-500 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Navigation />
        </div>
        
        <div>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'predict' && <PredictPage />}
          {currentPage === 'reports' && <ReportsPage />}
        </div>
      </div>
    </div>
  );
}