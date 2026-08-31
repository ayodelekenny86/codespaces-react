const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/orders
// @desc    Get all orders (filtered by role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'buyer') {
      query.buyer = req.user.id;
    } else if (req.user.role === 'seller') {
      query.seller = req.user.id;
    } else if (req.user.role === 'institution') {
      query.buyer = req.user.id;
    }
    // Admin sees all orders
    
    const orders = await Order.find(query)
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .populate('products.product', 'name price images');
      
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone address')
      .populate('seller', 'name email phone')
      .populate('products.product', 'name price images description');
      
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Check authorization
    if (order.buyer._id.toString() !== req.user.id && 
        order.seller._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private/Buyer/Institution
router.post('/', protect, authorize('buyer', 'institution', 'admin'), async (req, res) => {
  try {
    const { products, deliveryAddress } = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one product' });
    }
    
    // Calculate total and verify products
    let totalAmount = 0;
    const orderProducts = [];
    
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      if (!product.isAvailable || product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Product ${product.name} is not available in requested quantity` });
      }
      
      const price = product.price * item.quantity;
      totalAmount += price;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: price
      });
    }
    
    const order = await Order.create({
      buyer: req.user.id,
      seller: orderProducts[0].product.seller, // Simplified: assuming single seller
      products: orderProducts,
      totalAmount,
      deliveryAddress: deliveryAddress || req.user.address
    });
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Seller/Admin
router.put('/:id/status', protect, authorize('seller', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (order.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }
    
    order.status = status;
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }
    
    await order.save();
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status (escrow)
// @access  Private/Buyer/Admin
router.put('/:id/payment', protect, authorize('buyer', 'admin'), async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this payment' });
    }
    
    order.paymentStatus = paymentStatus;
    await order.save();
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
