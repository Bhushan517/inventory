import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRoles = null }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
