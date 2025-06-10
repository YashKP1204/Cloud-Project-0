const Product = require('../models/Product');
const ShopOrder = require('../models/ShopOrder');
exports.getSellerDashboardData = async (req, res) => {
  try {
    const shopId = req.shop._id;

    // Fetch basic seller data
    const [products, orders] = await Promise.all([
      Product.find({ shop: shopId }),
      ShopOrder.find({ shop: shopId }).sort({ createdAt: -1 }).limit(10)
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        shopName: req.shop.shopName,
        shopType: req.shop.shopType,
        shopAddress: req.shop.address,
        totalProducts: products.length,
        recentOrders: orders,
        shopId: shopId
      }
    });

  } catch (error) {
    console.error('Error fetching seller dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
