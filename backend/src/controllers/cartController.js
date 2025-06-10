const Cart = require('../models/cartModel');

exports.addToCart = async (req, res) => {
  try {
    console.log("Inside the addToCart controller");
    console.log("Request body:", req.body);
    const userId = req.user._id;
    const { productId, quantity, size, color } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item =>
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, size, color } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ message: 'Cart item updated', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size, color } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item =>
      !(
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
      )
    );

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ message: 'Cart item removed', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
