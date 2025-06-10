// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: Number,
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      isArrivedAtInventory: {
        type: Boolean,
        default: false
      }
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Card', 'UPI'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Processing',"Ready", 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  placedShopOrder:{
    type:Boolean,
    default: false
  },
  paidAt: Date,
  deliveredAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
