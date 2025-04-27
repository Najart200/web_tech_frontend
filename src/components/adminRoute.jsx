import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    // Logged in but not an admin
    return <Navigate to="/" replace />;
  }

  return children;
}
