const Product = require('../models/Product');
const { uploadToS3 } = require('../utils/s3Uploader');
// Create Product
exports.createProduct = async (req, res) => {
  try {
    console.log("Creating product...");
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      console.log("Files found:", req.files);
      const uploadPromises = req.files.map(file => uploadToS3(file));
      imageUrls = await Promise.all(uploadPromises);
      console.log("Uploaded image URLs:", imageUrls);
    }

    const product = new Product({
      ...req.body,
      seller: req.user._id,
      images: imageUrls
    });

    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: err.message });
  }
};
  

// Update Product
exports.updateProduct = async (req, res) => {
    try {
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
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Get Seller's Products
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// getting all products for admin only 
exports.getAllProducts = async(req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.statuc(500).json({error:err.messages})
    }
}

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user._id
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
