const ShopRequest = require('../models/ShopRequest');
const User = require('../models/User');

// GET /api/shop/admin/requests - get all pending shop requests
const getAllShopRequests = async (req, res) => {
  try {
    const requests = await ShopRequest.find().populate('user', 'name email role');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch shop requests' });
  }
};

// PUT /api/shop/admin/approve/:id - approve a request
const approveShopRequest = async (req, res) => {
  try {
    const request = await ShopRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'approved';
    request.reviewedAt = new Date();
    await request.save();

    // Update user role to 'seller'
    await User.findByIdAndUpdate(request.user, { role: 'seller' });

    res.json({ message: 'Shop request approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
};

// PUT /api/shop/admin/reject/:id - reject a request
const rejectShopRequest = async (req, res) => {
  const { reason } = req.body;

  try {
    const request = await ShopRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    request.reviewedAt = new Date();
    request.rejectionReason = reason || 'No reason provided';
    await request.save();

    res.json({ message: 'Shop request rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Rejection failed' });
  }
};

module.exports = {
  getAllShopRequests,
  approveShopRequest,
  rejectShopRequest,
};
