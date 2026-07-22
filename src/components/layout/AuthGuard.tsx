// ============================================================
// Auth Guard Component
// Restricts access to authenticated users only. Handles auto-login
// on bootstrap by reading session data from IndexedDB.
// ============================================================

import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import useProgressStore from '../../stores/useProgressStore';
import { dbService } from '../../services/db';
import { Box } from 'lucide-react';

export default function AuthGuard() {
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const { setProgress } = useProgressStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (isAuthenticated) {
        setIsChecking(false);
        return;
      }

      try {
        // Try to load active session from IndexedDB
        const session = await dbService.getSession();
        if (session) {
          setUser(session.user, session.token);
          setProgress(session.progress);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Auth Guard bootstrapping failed:', err);
        logout();
      } finally {
        setIsChecking(false);
      }
    };

    bootstrapAuth();
  }, [isAuthenticated, setUser, logout, setProgress]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8b5cf6] via-[#4c1d95] to-[#0f172a] text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: 'var(--gradient-accent)' }}
          >
            <Box size={32} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest">
              <span className="text-white">ALVIO</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Loading environment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location they were trying to access to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
