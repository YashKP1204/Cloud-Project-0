import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/";

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user; // <-- Return only user
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user profile");
    }
  }
);

// Async action to login user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      console.log("Registering user with data:", userData); // Debugging line
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log("Register response:", response.data); // Debugging line
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}auth/login`, userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Google Login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (token, thunkAPI) => {
    try {
      console.log("Google login token:", token); // Debugging line
      const response = await axios.post("http://localhost:5000/auth/google", { token });
      console.log("Google login response:", response.data); // Debugging line
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const token = localStorage.getItem("token");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: token || null,
    isAuthenticated: !!token,
    loading: !!token,  // <-- important
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // Remove token on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
