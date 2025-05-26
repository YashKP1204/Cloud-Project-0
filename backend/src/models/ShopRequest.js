const mongoose = require('mongoose');

const shopRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One request per user
  },
  shopName:{
    type:String,
    required: true,
  },
  gstNumber: {
    type: String,
    required: true,
    unique: true
  },
  shopType: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pinCode: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  }
});

module.exports = mongoose.model('ShopRequest', shopRequestSchema);




  
