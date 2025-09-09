import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-6">Bezig met laden…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

export function RequireRole({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-6">Bezig met laden…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!user.roles?.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
