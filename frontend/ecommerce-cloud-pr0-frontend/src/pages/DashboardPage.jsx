import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/authSlice"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>ID: {user._id}</p>
      <p>token: {token}</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={()=>{navigate("/seller/dashboard")}}>Seller Dashboard </button>
    </div>
  );
};

export default DashboardPage;
