// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import axios from "../../axios/axios"; // Adjust the import based on your axios setup

// BASE URL (adjust based on your backend API)
const BASE_URL = 'http://localhost:5000/products';

// Async Thunks
export const createProduct = createAsyncThunk('product/create', async (productData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BASE_URL}/create`, productData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message || 'Create failed');
  }
});

export const getSellerProducts = createAsyncThunk('/seller/product', async (_, { rejectWithValue }) => {
  try {
    console.log("inside the getSellerProducts")
    const res = await axios.get(`${BASE_URL}/seller/product`);
    console.log("response from getSellerProducts", res.data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message || 'Fetch failed');
  }
});

export const updateProduct = createAsyncThunk('product/update', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${BASE_URL}/update/${id}`, updatedData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message || 'Update failed');
  }
});
export const getProductById = createAsyncThunk('product/getById', async (id, { rejectWithValue }) => {
  try {
    console.log("inside the singel pordudct get id")
    const res = await axios.get(`${BASE_URL}/${id}`);
    console.log("response from getProductById", res.data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message || 'Fetch failed');
  }
});
export const deleteProduct = createAsyncThunk('product/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data.message || 'Delete failed');
  }
});

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Products
      .addCase(getSellerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get single product by id
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;

      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
