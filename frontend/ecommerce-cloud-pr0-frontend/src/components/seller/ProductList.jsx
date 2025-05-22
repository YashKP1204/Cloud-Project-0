import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SellerDashboardLayout from '../../components/seller/SellerDashboardLayout';
import { getSellerProducts } from '../../redux/product/productSlice';
import { Box, Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';
import {Link} from 'react-router-dom';
const ProductList = () => {
  const dispatch = useDispatch();

  const { products = [], loading, error } = useSelector((state) => state.product || {});

  useEffect(() => {
    console.log("inside the useEffect of ProductList");
    dispatch(getSellerProducts());
  }, [dispatch]);

  return (
    <SellerDashboardLayout>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {products.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Link to={`/seller/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Grid item xs={12} md={6} lg={4} key={product._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Product Image Gallery */}
                <Box sx={{ display: 'flex', overflowX: 'auto' }}>
                  {product.images.map((img, index) => (
                    <CardMedia
                      component="img"
                      key={index}
                      image={img}
                      alt={`Product image ${index + 1}`}
                      sx={{ height: 150, width: 150, objectFit: 'cover', mr: 1 }}
                    />
                  ))}
                </Box>

                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                  </Typography>
                  <Typography variant="body2"><strong>Category:</strong> {product.category}</Typography>
                  <Typography variant="body2"><strong>Sub-category:</strong> {product.sub_category}</Typography>
                  <Typography variant="body2"><strong>Price:</strong> ₹{product.price}</Typography>
                  <Typography variant="body2"><strong>Stock:</strong> {product.stock}</Typography>
                  <Typography variant="body2"><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Link>
          ))}
        </Grid>
      )}
    </SellerDashboardLayout>
  );
}

export default ProductList;
