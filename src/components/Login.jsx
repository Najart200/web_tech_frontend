import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import Header from './Header';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser({ email, password });
      console.log('Login response:', response); // 👈 Add this
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        setToken(response.token);
        navigate('/');
      } else {
        setError(response.message || 'Invalid login credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="register-link">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="link-text">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
