const Product = require('../models/Product');
const Shop = require('../models/Shop');
const Order = require('../models/Order');
const ShopOrder = require('../models/ShopOrder');
const { uploadToS3 } = require('../utils/s3Uploader');
// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    let imageUrls = [];
    const { name, description, price, discount_price, stock, brand, category, sub_category } = req.body;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToS3(file));
      imageUrls = await Promise.all(uploadPromises);
    }

    const product = new Product({
      name,
      description,
      price,
      discount_price,
      stock,
      brand,
      category,
      sub_category,
      seller: req.user._id,
      shop:shopId,
      images: imageUrls
    });

    const newProduct = await product.save();

    // 🔍 Find existing category
    const categoryEntry = shop.products.find(entry => entry.category === newProduct.category);

    if (categoryEntry) {
      // ✅ If exists, push product ID to the category
      categoryEntry.productByCategory.push(newProduct._id);
    } else {
 // ✅ Else, create new category block
      console.log(newProduct.category); 
      shop.products.push({
        category: newProduct.category,
        productByCategory: [newProduct._id]
      });
    }

    await shop.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
};

  

// Update Product
exports.updateProduct = async (req, res) => {
    try {
      console.log("update product controller");
      let imageUrls = [];
  
      if (req.files && req.files.length > 0) {
        // Upload each new file to S3 and collect the URLs
        const uploadPromises = req.files.map(file => uploadToS3(file));
        imageUrls = await Promise.all(uploadPromises);
      }
  
      // Merge imageUrls with any existing ones (optional — based on how you want to handle existing images)
      const updateData = {
        ...req.body,
      };
  
      if (imageUrls.length > 0) {
        updateData.images = imageUrls; // Replace or update as per your strategy
      }
  
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, seller: req.user._id },
        updateData,
        { new: true }
      );
  
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.json({ message: "Product updated", product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('seller', 'name email');
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Get Seller's Products
exports.getShopProducts = async (req, res) => {
  try {
    const {shopId} = req.params;
    console.log("Inside the getSHopProducsts contrller");
    console.log("shopId:", shopId);
    const shop = await Shop.findById(shopId).populate('products');
     if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.status(200).json({ products: shop.products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// getting all products for admin only 
exports.getAllProducts = async(req,res)=>{
    try {
      // this function is for admin and to reflect on dashboard - to get all products
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.statuc(500).json({error:err.messages})
    }
}

// Delete Product
// controllers/productController.js


exports.safeDeleteProduct = async (req, res) => {
  try {
    console.log("Inside safeDeleteProduct controller");
    const productId = req.params.id;

    // 1. Check User Orders with product that are NOT Delivered
    const userOrder = await Order.findOne({
      'orderItems.product': productId,
      status: { $ne: 'Delivered' } // Not yet delivered
    });
    console.log("userOrder:", userOrder);

    // 2. Check Shop Orders with product that are NOT Delivered
    const shopOrder = await ShopOrder.findOne({
      'orderItems.product': productId,
      status: { $ne: 'Delivered' }
    });
    console.log("shopOrder:", shopOrder);

    if (userOrder || shopOrder) {
      console.log("Cannot delete product: It exists in active user/shop orders.");
      return res.status(400).json({
        message: 'Cannot delete product: It exists in active user/shop orders.'
      });
    }
    console.log("No active orders found for this product. Proceeding with deletion.");

    // 3. Remove reference from Shop.products
    await Shop.updateMany(
      {},
      { $pull: { 'products.$[].productByCategory': productId } }
    );
    console.log("Removed product reference from all shops.");

    // 4. Finally delete product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log("Deleted product:", deletedProduct);

    if (!deletedProduct) {
      console.log("Product not found for deletion.");
      return res.status(404).json({ message: 'Product not found.' });
    }
    console.log("Product deleted successfully.");

    res.status(200).json({ message: 'Product deleted successfully and safely.' });
  } catch (err) {
    console.error('Safe Delete Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

