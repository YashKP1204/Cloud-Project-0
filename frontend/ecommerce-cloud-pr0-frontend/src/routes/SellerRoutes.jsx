import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SellerRoute = ({ children }) => {
  const { token, user, loading } = useSelector((s) => s.auth);
  console.log("user inside seller", user)

  if (loading || (!user && token)) return <div>Loading…</div>;
  // if (!token || !user) return <Navigate to="/login" replace />;
  // if (user.role !== "seller") return <Navigate to="/unauthorized" replace />;
  return children;
};

export default SellerRoute;
