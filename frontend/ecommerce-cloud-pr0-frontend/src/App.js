import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchUserProfile } from "./redux/auth/authSlice" // adjust path if needed
import ProtectedRoute from "./routes/ProtectedRoute";
import { GoogleOAuthProvider } from '@react-oauth/google';
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProductList from './components/seller/ProductList';
import SellerRoute from './routes/SellerRoutes';
import Unauthorized from './pages/Unauthorized';
import SellerDashboardLayout from "./components/seller/SellerDashboardLayout";
import CreateProduct from "./components/seller/CreateProduct";
import SingleProduct from "./components/seller/SingleProduct";
import UpdateProduct from "./components/seller/UpdateProdcut";



function App() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  console.log("auth in app js", auth);
const { user, token, loading, isAuthenticated } = auth;

  console.log("isAuthenticated in app js",isAuthenticated);
  console.log("loading in app js",loading);
  console.log("token in app js",token);
  console.log("user in app js",user);
  useEffect(() => {
    console.log("usereffect being called on regresh")
    console.log("token inside useEffect", token);
    console.log("user inside useEffect", user);
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

  if (token && loading) {
    return <div>Loading user profile…</div>;
  }
  return (
    <GoogleOAuthProvider clientId="185249501279-o810u146pjp9dvjtusmq6vhlka08at5n.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/seller/products"
            element={
              <SellerRoute>
                <ProductList />
              </SellerRoute>
            }
          />
          <Route
          path  ="/seller/dashboard"
          element={
            <SellerRoute>
              <SellerDashboardLayout />
            </SellerRoute>
          }/>
          <Route
          path  ="/seller/products/create"
          element={
            <SellerRoute>
              <CreateProduct />
            </SellerRoute>
          }/>
          <Route
          path  ="/seller/products/:id"
          element={
            <SellerRoute>
              <SingleProduct />
            </SellerRoute>
          }/>
          <Route
          path  ="/seller/products/:id/update"
          element={
            <SellerRoute>
              <UpdateProduct />
            </SellerRoute>
          }/>

         

          {/* Add more routes later */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
