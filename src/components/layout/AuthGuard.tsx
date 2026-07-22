// ============================================================
// Auth Guard Component
// Restricts access to authenticated users only.
// ============================================================

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

export default function AuthGuard() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the location they were trying to access to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
