// ============================================================
// Auth Store — Zustand state management for authentication
// ============================================================
import { create } from 'zustand';
import type { User, AuthState } from '../types/user';
import { dbService } from '../services/db';

interface AuthActions {
  /** Set user data after login/register */
  setUser: (user: User, token: string) => void;
  /** Clear auth state on logout */
  logout: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
}

/**
 * Global authentication state.
 * Connects with IndexedDB to store session state.
 */
const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // ---- State ----
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // ---- Actions ----
  setUser: (user: User, token: string) =>
    set({ user, token, isAuthenticated: true, isLoading: false, error: null }),

  logout: () => {
    dbService.clearSession().catch((err) => console.warn('Failed to clear DB session:', err));
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),

  setError: (error: string | null) =>
    set({ error, isLoading: false }),
}));

export default useAuthStore;
