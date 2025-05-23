const mongoose = require('mongoose');

const shopRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One request per user
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

module.exports = mongoose.model('ShopRequest', shopRequestSchema);
// after approval , 
const shopSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gstNumber: { type: String, required: true },
    shopType: { type: String, required: true },
    address: { type: String, required: true },
    pinCode: { type: String, required: true },
    state: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Shop', shopSchema);
  
