// controllers/orderController.js

const Order = require('../models/Order');
const Cart = require('../models/cartModel');
const Shop = require('../models/Shop');
const ShopOrder = require('../models/ShopOrder'); 
const Product = require('../models/Product');
const {areAllItemsInInventory}= require('../utils/adminWorks/AdminUtils');

// user placing order
exports.placeOrder = async (req, res) => {
  try {
    console.log("inside the placeOrder controller");
    const userId = req.user._id;
    const { shippingAddress ,paymentMethod } = req.body;

    console.log("shippingAddress:", shippingAddress);
    console.log("paymentMethod:", paymentMethod);


    // 1. Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // 2. Build order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      seller: item.product.seller, 
      quantity: item.quantity,
      price: item.product.price,
      isArrivedAtInventory: false,

    }));
    console.log("orderItems:", orderItems);

    // 3. Calculate total
    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log("totalPrice:", totalPrice);

    // 4. Save main order
    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalPrice,
    });
    console.log("order:", order);

    const savedOrder = await order.save();

    // 7. Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    return res.status(201).json({
      message: 'Order placed successfully',
      order: savedOrder,
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// users view their order 
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product').sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Could not fetch orders' });
  }
};



// Seller controller  


exports.getSellerShopOrders = async (req, res) => {
  try {
    // Step 1: Find the seller's shop
    const userId = req.user._id;
    console.log("getSellerShopOrders userId:", userId);


    const shop = await Shop.findOne({ user: req.user._id },);
    console.log("shop:", shop);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found for seller.' });
    }
    

    // Step 2: Find all ShopOrders for this shop
    const shopOrders = await ShopOrder.find({ shop: shop._id })
      .populate('orderItems.product', 'name brand price')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, shopOrders });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateSellerOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { newStatus } = req.body;
    const {orderId} = req.params;
    console.log("updateSellerOrderStats:  ",sellerId, newStatus, orderId); 


    

    // Validate new status
    const allowedStatuses =['Accepted', 'Packed', 'Shipped', 'Delivered'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const shop = await Shop.findOne({ user: sellerId });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const order = await ShopOrder.findOne({ _id: orderId, shop: shop._id });
    console.log("order:", order);
    if (!order) {
      console.log("order not found for the shop");
      return res.status(404).json({ error: 'Order not found for your shop' });
    }

    const currentStatusIndex = allowedStatuses.indexOf(order.status);
    console.log("currentStatusIndex:", currentStatusIndex);
    const newStatusIndex = allowedStatuses.indexOf(newStatus);
    console.log("newStatusIndex:", newStatusIndex);
    if (newStatusIndex <= currentStatusIndex) {
      return res.status(400).json({ error: 'Invalid status transition' });
    }

    order.status = newStatus;
    await order.save();
    if (newStatus === 'Delivered') {
  for (const item of order.orderItems) {
   const updatedOrder =  await Order.updateOne(
      { _id: item.userOrderId },
      { $set: { "orderItems.$[elem].isArrivedAtInventory": true } },
      {
        arrayFilters: [{ "elem.product": item.product }],
      }
    );
    console.log("updatedOrder:", updatedOrder);
  }
}

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      updatedOrder: order
    });

  } catch (err) {
    console.error('Error updating shop order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



// admin controller 
// this order that havenot be place to shop yet
// create a pendign order view for admin 
exports.getAdminPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ placedShopOrder: false })
      .populate('user', 'name email')
      .populate({
        path: 'orderItems.product',
        select: 'name brand price shop',
        populate: {
          path: 'shop',
          model: 'Shop',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pendingOrders
    });

  } catch (error) {
    console.error('Error fetching admin pending orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// get orders arrived to inventory 

exports.getOrdersWithAtLeastOneItemArrived = async (req, res) => {
  try {
    // Fetch orders where any item has isArrivedAtInventory = true
    const orders = await Order.find({
      'orderItems.isArrivedAtInventory': true
    })
      .populate('user', 'name email')
      .populate({
        path: 'orderItems.product',
        select: 'name brand price isArrivedAtInventory',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Error fetching partially arrived orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// get order with all items arrived at inventory



exports.adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // who placed the order
      .populate('orderItems.product', 'name brand price') // product details
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Admin getAllOrders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



//admin  group by shop view
exports.adminGetOrdersGroupedByShop = async (req, res) => {
  try {
    // Step 1: Only get unplaced orders
    const orders = await Order.find({ placedShopOrder: false })
      .populate('user', 'name email')
      .populate({
        path: 'orderItems.product',
        select: 'name brand price shop',
        populate: {
          path: 'shop',
          model: 'Shop',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    const groupedByShop = {};
    const updatedOrderIds = new Set();

    for (const order of orders) {
      for (const item of order.orderItems) {
        const product = item.product;
        const shop = product?.shop;
        if (!shop) continue;

        const shopId = shop._id.toString();
        if (!groupedByShop[shopId]) {
          groupedByShop[shopId] = {
            shopId,
            shopName: shop.name,
            items: []
          };
        }

        groupedByShop[shopId].items.push({
          orderId: order._id,
          user: order.user,
          product: {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            price: item.price
          },
          quantity: item.quantity,
          shippingAddress: order.shippingAddress,
          status: order.status,
          placedShopOrder: order.placedShopOrder,
          createdAt: order.createdAt
        });

        updatedOrderIds.add(order._id.toString());
      }
    }

    // Step 2: Update placedShopOrder to true for affected orders
    // await Order.updateMany(
    //   { _id: { $in: Array.from(updatedOrderIds) } },
    //   { $set: { placedShopOrder: true } }
    // );

    return res.status(200).json({
      success: true,
      groupedOrders: Object.values(groupedByShop)
    });

  } catch (error) {
    console.error('Admin getOrdersGroupedByShop error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




// admin placing order to the shop , 
exports.adminPlaceOrderToShop = async (req, res) => {
  try {
    const { shopId, inventoryAddress } = req.body;

    if (!shopId || !inventoryAddress) {
      return res.status(400).json({ error: 'shopId and inventoryAddress are required.' });
    }

    // Step 1: Find all user orders where placedShopOrder is false
    const allOrders = await Order.find({ placedShopOrder: false })
      .populate({
        path: 'orderItems.product',
        select: 'shop name price',
        populate: {
          path: 'shop',
          select: '_id name'
        }
      });

    const itemsForShop = [];
    const touchedOrders = new Set(); // To avoid saving same order multiple times

    for (const order of allOrders) {
      let hasItemForThisShop = false;

      for (const item of order.orderItems) {
        const product = item.product;

        if (product.shop && product.shop._id.toString() === shopId) {
          hasItemForThisShop = true;
          itemsForShop.push({
            product: product._id,
            quantity: item.quantity,
            userOrderId: order._id
          });
        }
      }

      // Only mark and save if at least one item matched
      if (hasItemForThisShop) {
        order.placedShopOrder = true;
        await order.save();
        touchedOrders.add(order._id.toString());
      }
    }

    if (itemsForShop.length === 0) {
      return res.status(404).json({ error: 'No unplaced orders found for this shop.' });
    }

    // Step 2: Create new ShopOrder
    const shopOrder = new ShopOrder({
      shop: shopId,
      orderItems: itemsForShop,
      inventoryAddress
    });

    const savedShopOrder = await shopOrder.save();

    // Step 3: Optionally push the shopOrder into Shop model (if needed)
    await Shop.findByIdAndUpdate(shopId, {
      $push: { shopOrders: savedShopOrder._id }
    });

    return res.status(201).json({
      message: `Order placed to shop successfully for ${touchedOrders.size} orders.`,
      shopOrder
    });

  } catch (error) {
    console.error('Admin placeOrderToShop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// admin get  view of all order that are ready for final delivery 
exports.adminGetFullyArrivedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderItems: {
        $not: {
          $elemMatch: { isArrivedAtInventory: false }
        }
      }
    })
      .populate('user', 'name email')
      .populate({
        path: 'orderItems.product',
        select: 'name brand price shop',
        populate: {
          path: 'shop',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      fullyArrivedOrders: orders
    });

  } catch (error) {
    console.error('Error fetching fully arrived orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// 

exports.adminMarkOrderAsArrivedWhenAllItemsReady = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const allArrived = order.orderItems.every(item => item.isArrivedAtInventory === true);

    if (!allArrived) {
      return res.status(400).json({ error: 'Not all items have arrived at the inventory yet' });
    }

    // Update order status to 'ArrivedAtInventory' or 'Ready'
    order.status = 'Ready'; // or 'ArrivedAtInventory' based on your schema
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order marked as fully arrived at inventory(Ready for Delivery)',
      updatedOrder: order
    });

  } catch (error) {
    console.error('Error marking order as arrived:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const readyToDeliver = areAllItemsInInventory(order);

    if (!readyToDeliver)
      return res.status(400).json({ message: 'Not all items have arrived at inventory' });
    const allowedStatuses = ['Processing',"Ready", 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    order.status = newStatus;

    if(newStatus === 'Delivered') {
      order.deliveredAt = Date.now();
    } 
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Admin update order error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};



