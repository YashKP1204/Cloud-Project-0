import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useSelector((s) => s.auth);

  // 1) Still loading user → show spinner
  if (loading || (!user && token)) return <div>Loading…</div>;

  // 2) No valid session → redirect to login
  if (!token || !user) return <Navigate to="/login" replace />;

  // 3) Otherwise, render children
  return children;
};

export default ProtectedRoute;

