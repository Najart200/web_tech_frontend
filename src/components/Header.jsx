import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="nav-left">
        <Link to="/" className="nav-link">Home</Link>
        {token && (
          <>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/bookings" className="nav-link">Bookings</Link>
            <Link to="/admin" className="nav-link"> Admin Panel</Link>
          </>
        )}
      </div>
      <div className="nav-right">
        {token ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-link">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
