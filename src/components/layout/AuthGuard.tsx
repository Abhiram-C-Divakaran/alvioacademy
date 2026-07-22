// ============================================================
// Auth Guard Component
// Authentication requirement has been removed per user request.
// ============================================================

import { Outlet } from 'react-router-dom';

export default function AuthGuard() {
  return <Outlet />;
}
