import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import productReducer from '../redux/product/productSlice'

const token = localStorage.getItem("token");
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
  preloadedState: {
    auth: {
      user: token ? { token } : null, // If token exists, pre-load user data
      loading: false,
      error: null,
    },
  },
});
