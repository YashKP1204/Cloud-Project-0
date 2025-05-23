const ShopRequest = require("../models/Shop");

// POST /api/shop/request
const submitShopRequest = async (req, res) => {
  const { gstNumber, shopType, address, pinCode, state } = req.body;
  const userId = req.user._id;

  try {
    // Check if request already exists
    const existing = await ShopRequest.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: 'Shop request already submitted' });
    }

    // Create new shop request
    const request = new ShopRequest({
      user: userId,
      gstNumber,
      shopType,
      address,
      pinCode,
      state
    });

    await request.save();

    res.status(201).json({ message: 'Shop request submitted successfully', request });
  } catch (err) {
    console.error('Submit shop request error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/shop/my-request - Get the current user's shop request
const getMyShopRequest = async (req, res) => {
    try {
      const request = await ShopRequest.findOne({ user: req.user._id });
      if (!request) return res.status(404).json({ message: 'No shop request found' });
  
      res.json(request);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch your shop request' });
    }
  };
  
  // DELETE /api/shop/my-request - Delete your shop request (only if pending)
  const deleteMyShopRequest = async (req, res) => {
    try {
      const request = await ShopRequest.findOne({ user: req.user._id });
      if (!request) return res.status(404).json({ message: 'No request found' });
  
      if (request.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending requests can be deleted' });
      }
  
      await request.deleteOne();
      res.json({ message: 'Your shop request has been deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete shop request' });
    }
  };
  
  module.exports = {
    submitShopRequest ,
    getMyShopRequest,
    deleteMyShopRequest,
  };
  


