// src/pages/seller/UpdateProduct.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../../redux/product/productSlice';
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, loading, error } = useSelector((state) => state.products);

  const existingProduct = products.find((p) => p._id === id);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        price: existingProduct.price,
        stock: existingProduct.stock,
      });
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProduct({ id, updates: formData })).unwrap();
    navigate('/seller/products');
  };

  return (
    <SellerDashboardLayout>
      <Typography variant="h5" mb={2}>
        Update Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
        <TextField label="Price" name="price" value={formData.price} onChange={handleChange} required type="number" />
        <TextField label="Stock" name="stock" value={formData.stock} onChange={handleChange} required type="number" />

        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
        )}

        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </SellerDashboardLayout>
  );
};

export default UpdateProduct;
