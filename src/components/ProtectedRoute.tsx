import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, role } = useAuth();

  // The admin/professor roles are still mocked for now
  const isAuthenticated = !!session || (role && ['admin', 'professor'].includes(role));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = session ? 'aluno' : role;

  return allowedRoles.includes(userRole || '') ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;