const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: String, required: true },
  discount_price:{type:String},
  brand:{ type: String, required: true },
  stock: { type: String, default: 0 },
  category: {type:String,required:true},
  sub_category:{type:String,requied:true},
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Shop',
    required:true
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
