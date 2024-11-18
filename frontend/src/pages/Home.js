import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import DetailForm from './DetailForm';
import Dashboard from './Dashboard';
import './Home.css';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [formData, setFormData] = useState(null); // State to store form data after submission
  const [showDashboard, setShowDashboard] = useState(false); // State to manage dashboard display
  const [submittedData, setSubmittedData] = useState(null); // State to store submitted data

  const navigate = useNavigate();

  // Fetch logged-in user from localStorage
  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  // Handle form submission from the CarbonFootprintTracker
  const handleFormSubmit = async (data) => {
    console.log('Form submitted: ', data);
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authorization token found.');
        }

        const response = await fetch('http://localhost:8080/auth/updateUserDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ...data, userId: data.email }), // Ensure this structure matches backend expectations
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error:', errorResponse);
            handleError(errorResponse.message || 'Form submission failed');
        } else {
            const result = await response.json();
            handleSuccess('Form submitted successfully');
            setFormData(data);
            setShowDashboard(true);
        }
    } catch (err) {
        handleError(err.message || 'An error occurred');
    }
    setFormData(data);
  localStorage.setItem('formData', JSON.stringify(data)); // Store form data in localStorage
  setShowDashboard(true);
};


  return (
    <div className="home-container">
      <h1>Welcome {loggedInUser}</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* Conditionally render the form or the dashboard */}
      {!showDashboard ? (
        <div className="form-section">
          <h2>Carbon Footprint Tracker</h2>
          <DetailForm onSubmit={handleFormSubmit} />
        </div>
      ) : (
        <Dashboard formData={formData} />
      )}

      {/* Display submitted data if available */}
      {submittedData && (
        <div className="submitted-data">
          <h2>Submitted Data:</h2>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre> {/* Display the submitted data */}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
