import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if token is valid
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Correctly call the function using named import
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);  // Token is valid
        } else {
          setIsAuthenticated(false); // Token expired
          localStorage.removeItem('token');  // Clear token
        }
      } catch (error) {
        setIsAuthenticated(false);  // Token is invalid
        localStorage.removeItem('token');  // Clear token
      }
    } else {
      setIsAuthenticated(false); // No token found
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication on initial load
  }, []);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />
      </Routes>
    </div>
  );
}

export default App;