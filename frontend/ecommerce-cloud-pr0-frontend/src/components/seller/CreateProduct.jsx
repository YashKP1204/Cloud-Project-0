// src/pages/seller/CreateProduct.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../redux/product/productSlice';
import SellerDashboardLayout from './SellerDashboardLayout';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createProduct(formData)).unwrap();
    navigate('/seller/products');
  };

  return (
    <SellerDashboardLayout>
      <Typography variant="h5" mb={2}>
        Create New Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
        <TextField label="Price" name="price" value={formData.price} onChange={handleChange} required type="number" />
        <TextField label="Stock" name="stock" value={formData.stock} onChange={handleChange} required type="number" />

        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Create
          </Button>
        )}

        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </SellerDashboardLayout>
  );
};

export default CreateProduct;
