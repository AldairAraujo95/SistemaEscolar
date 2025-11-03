import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const isAuthenticated = !!session || role === 'admin';

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(role || '') ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;