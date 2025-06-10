// models/Shop.js
const  mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
  isActive: {
    type: Boolean,
    default: true
  },
  products: [
    {
      category: {
        type: String,
        required: true
    },
      productByCategory: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        }
      ]
    }
  ],
  orders: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'ShopOrder'
}],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shop', shopSchema);