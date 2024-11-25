import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useLocation, Navigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const formData = location.state?.formData || JSON.parse(localStorage.getItem('formData'));

  const [footprintData, setFootprintData] = useState(null);
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);  // To track any errors

  useEffect(() => {
    if (formData) {
      const fetchFootprint = async () => {
        try {
          setLoading(true);
          setError(null);

          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authorization token found');
          }

          const response = await fetch('http://localhost:8080/auth/dashboard', {
            method: 'GET', // Ensure this matches the backend route method
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch footprint data');
          }

          const calculatedData = await response.json();
          setFootprintData(calculatedData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFootprint();
    }
  }, [formData]);

  if (!formData) {
    return <Navigate to="/home" replace />;
  }

  if (loading) {
    return <div>Loading your carbon footprint data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Destructure the user data if available
  const user = footprintData?.user || {};

  return (
    <div className="dashboard-container">
      <h2>Your Carbon Footprint</h2>
      <p>Monthly Footprint: {user.monthlyFootprint || 'N/A'} kg CO2</p>
      <p>Yearly Footprint: {user.yearlyFootprint || 'N/A'} kg CO2</p>

      <h3>User Details</h3>
      <p>Name: {user.name || 'N/A'}</p>
      <p>Email: {user.email || 'N/A'}</p>
      <p>Phone: {user.phone || 'N/A'}</p>
      <p>Distance to Office: {user.distanceToOffice || 'N/A'}</p>
      <p>Vehicle Type: {user.vehicleType || 'N/A'}</p>
      <p>Fuel Type: {user.fuelType || 'N/A'}</p>
      <p>Commute Method: {user.commuteMethod || 'N/A'}</p>
      <p>Energy Usage: {user.energyUsage || 'N/A'}</p>
      <p>Diet: {user.diet || 'N/A'}</p>
      <p>Recycling: {user.recycling ? 'Yes' : 'No'}</p>
      <p>Consent: {user.consent ? 'Yes' : 'No'}</p>
      <p>Date: {user.date || 'N/A'}</p>
    </div>
  );
};

export default Dashboard;
