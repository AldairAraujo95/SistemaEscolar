import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, role } = useAuth();

  // Admin role is mocked, others rely on a session
  const isAuthenticated = !!session || role === 'admin';

  if (!isAuthenticated) {
    // Redirect to the main role selection page if not authenticated
    return <Navigate to="/" replace />;
  }

  // If authenticated, check if the role is allowed for this route
  return allowedRoles.includes(role || '') ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;