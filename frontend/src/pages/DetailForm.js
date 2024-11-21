import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Dashboard from './Dashboard';
import './DetailForm.css';

const DetailForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    distanceToOffice: '',
    vehicleType: 'car',
    fuelType: 'petrol',
    commuteMethod: 'driving',
    energyUsage: '',
    diet: 'meat',
    recycling: false,
    consent: false,
    date: '',
  });
  const [showDashboard, setShowDashboard] = useState(false);

  const navigate = useNavigate();

  // Fetch logged-in user on component mount
  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === steps.length - 1) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authorization token found.');
        }

        const response = await fetch('http://localhost:8080/auth/updateUserDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, userId: formData.email }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error('Error:', errorResponse);
          handleError(errorResponse.message || 'Form submission failed');
        } else {
          const result = await response.json();
          handleSuccess('Form submitted successfully');
          setShowDashboard(true);
        }
      } catch (err) {
        handleError(err.message || 'An error occurred');
      }
    } else {
      handleStepChange(1);
    }
  };

  // Steps logic
  const steps = [
    { title: 'Step 1: Personal Details', content: personalDetailsStep() },
    { title: 'Step 2: Commute Details', content: commuteStep() },
    { title: 'Step 3: Vehicle Details', content: vehicleStep() },
    { title: 'Step 4: Home Energy Consumption', content: energyStep() },
    { title: 'Step 5: Lifestyle and Habits', content: lifestyleStep() },
    { title: 'Step 6: Consent and Privacy', content: consentStep() },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  }

  function handleStepChange(step) {
    setCurrentStep((prevStep) => prevStep + step);
  }

  function personalDetailsStep() {
    return (
      <>
        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone Number:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="date">Select Date (Month/Year):</label>
        <input
          type="month"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </>
    );
  }

  function commuteStep() {
    return (
      <>
        <label htmlFor="distanceToOffice">Distance to Office (km):</label>
        <input
          type="number"
          id="distanceToOffice"
          name="distanceToOffice"
          value={formData.distanceToOffice}
          onChange={handleChange}
          required
        />

        <label htmlFor="commuteMethod">Commute Method:</label>
        <select
          id="commuteMethod"
          name="commuteMethod"
          value={formData.commuteMethod}
          onChange={handleChange}
        >
          <option value="driving">Driving</option>
          <option value="public_transit">Public Transit</option>
          <option value="cycling">Cycling</option>
          <option value="walking">Walking</option>
        </select>
      </>
    );
  }

  function vehicleStep() {
    return (
      <>
        <label htmlFor="vehicleType">Vehicle Type:</label>
        <select
          id="vehicleType"
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
        >
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="bicycle">Bicycle</option>
          <option value="electric_scooter">Electric Scooter</option>
        </select>

        <label htmlFor="fuelType">Fuel Type:</label>
        <select
          id="fuelType"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
        >
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
          <option value="na">N/A</option>
        </select>
      </>
    );
  }

  function energyStep() {
    return (
      <>
        <label htmlFor="energyUsage">Average Monthly Electricity Usage (kWh):</label>
        <input
          type="number"
          id="energyUsage"
          name="energyUsage"
          value={formData.energyUsage}
          onChange={handleChange}
          required
        />
      </>
    );
  }

  function lifestyleStep() {
    return (
      <>
        <label htmlFor="diet">Diet Type:</label>
        <select
          id="diet"
          name="diet"
          value={formData.diet}
          onChange={handleChange}
          required
        >
          <option value="meat">Meat-based</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>

        <label htmlFor="recycling">Do you recycle at home?</label>
        <input
          type="checkbox"
          id="recycling"
          name="recycling"
          checked={formData.recycling}
          onChange={handleCheckboxChange}
        />
      </>
    );
  }

  function consentStep() {
    return (
      <>
        <input
          type="checkbox"
          id="consent"
          name="consent"
          checked={formData.consent}
          onChange={handleCheckboxChange}
          required
        />
        <label htmlFor="consent">I agree to the terms and conditions</label>
      </>
    );
  }

  return (
    <div className="form-container">
      <h1>Welcome {loggedInUser}</h1>
      <button onClick={handleLogout}>Logout</button>

      {!showDashboard ? (
        <form onSubmit={handleSubmit}>
          <h2>{steps[currentStep].title}</h2>
          {steps[currentStep].content}

          <div className="step-buttons">
            <button
              type="button"
              onClick={() => handleStepChange(-1)}
              disabled={currentStep === 0}
            >
              Previous
            </button>

            <button type="submit">
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </form>
      ) : (
        <Dashboard formData={formData} />
      )}

      <ToastContainer />
    </div>
  );
};

export default DetailForm;
