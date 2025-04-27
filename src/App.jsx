import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import BookingForm from './components/BookingForm.jsx';
import Home from './pages/Home.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import ResourcePage from './pages/ResourcePage.jsx';
import AdminPanel from './pages/AdminPanel'; 
import AdminRoute from './components/adminRoute.jsx'; // 👈 import it


// 🧠 App Layout to show Header only when needed
const AppLayout = ({ token, setToken, role, children }) => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideHeader && <Header token={token} setToken={setToken} role={role} />}
      {children}
    </>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));  // Fetch token from localStorage
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        console.log("Decoded role:", decoded.role); // Debugging role
      } catch (error) {
        console.error("Invalid token:", error);
        setRole(null);  // Ensure the role is reset if the token is invalid
      }
    } else {
      setRole(null);
    }
  }, [token]);

  return (
    <Router>
      <AppLayout token={token} setToken={setToken} role={role}>
        <Routes>
          <Route path="/" element={<Home role={role} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resources" element={<PrivateRoute token={token}><ResourcePage role={role} token={token} /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute token={token}><BookingsPage role={role} token={token} /></PrivateRoute>} />
          <Route path="/book" element={<PrivateRoute token={token}><BookingForm token={token} role={role} /></PrivateRoute>} />
          <Route path="/admin" element={<AdminPanel />} />
         
                
  

        </Routes>
      </AppLayout>
    </Router>
  );
};



// 🔒 Protect route if no token
const PrivateRoute = ({ token, children }) => {
  console.log("PrivateRoute Token:", token); // Debugging token
  return token ? children : <Navigate to="/login" replace />;
};


export default App;
