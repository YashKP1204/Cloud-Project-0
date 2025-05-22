import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../redux/auth/authSlice"; // Import googleLogin action
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
    .then(() => {
      // On successful login, redirect to dashboard
      navigate('/dashboard');
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const handleGoogleLogin = async (response) => {
    if (response.credential) {
      console.log("Google login response:", response); // Debugging line
      const token = response.credential; // Google token

      try {
        // Dispatch the googleLogin action with the token
        dispatch(googleLogin(token))
        .then(() => {
          // On successful login, redirect to dashboard
          navigate('/dashboard');
        })
        .catch((err) => {
          console.log(err);
        });
      } catch (error) {
        console.error("Google login failed:", error);
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log("Google login failed")}
        />
      </div>
    </div>
  );
};

export default LoginPage;
