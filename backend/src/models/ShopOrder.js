const mongoose = require('mongoose');

const shopOrderSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      userOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' // to link back to actual user order
      }
    }
  ],
  inventoryAddress: {
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['Requested', 'Accepted', 'Packed', 'Shipped', 'Delivered'],
    default: 'Requested'
  }
}, { timestamps: true });

module.exports = mongoose.model('ShopOrder', shopOrderSchema);
// This schema is used to manage orders at the shop level, where admins can handle inventory and shipping.
// It allows for tracking of products that need to be shipped to the shop's inventory, and the status of those orders.