import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const location = useLocation();
  const userRaw = localStorage.getItem('user');

  if (!userRaw) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

