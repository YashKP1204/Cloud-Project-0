import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../../redux/product/productSlice';
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout';
import {
  Typography,
  Box,
  CardMedia,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.product);
  const product = products.find((p) => p._id === id);

  useEffect(() => {
    if (!product) {
        console.log("inside the single pag effect")
      dispatch(getProductById(id));
    }
  }, [dispatch, id, product]);

  return (
    <SellerDashboardLayout>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : !product ? (
        <Typography>No product found.</Typography>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          {/* Product Images */}
          <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3 }}>
            {product.images.map((img, i) => (
              <CardMedia
                key={i}
                component="img"
                image={img}
                alt={`Product ${i + 1}`}
                sx={{ height: 200, width: 200, mr: 2, borderRadius: 2 }}
              />
            ))}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography><strong>Description:</strong> {product.description}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Category:</strong> {product.category}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Sub-category:</strong> {product.sub_category}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Price:</strong> ₹{product.price}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Stock:</strong> {product.stock}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </>
      )}
    </SellerDashboardLayout>
  );
};

export default SingleProduct;
