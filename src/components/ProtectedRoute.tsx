import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'faculty';
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRole, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role if specified
  const hasRequiredRole = 
    (requiredRole && profile?.role === requiredRole) || 
    (allowedRoles.length > 0 && profile?.role && allowedRoles.includes(profile.role));

  // If role is required but user doesn't have it, show unauthorized
  if ((requiredRole || allowedRoles.length > 0) && !hasRequiredRole) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
