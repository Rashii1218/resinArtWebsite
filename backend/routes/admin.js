const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const adminAuth = require('../middleware/adminAuth');

// Get all customers
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const customers = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

// Get customer details
router.get('/customers/:customerId', adminAuth, async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await User.findById(customerId).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });

    res.json({
      customer,
      orders
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ message: 'Error fetching customer details', error: error.message });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Get order details
router.get('/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phoneNumber')
      .populate('items.product', 'name price images stock');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
});

// Update order status
router.put('/orders/:orderId/status', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Update tracking number
router.put('/orders/:orderId/tracking', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { trackingNumber },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating tracking number:', error);
    res.status(500).json({ message: 'Error updating tracking number', error: error.message });
  }
});

// Add order notes
router.patch('/orders/:id/notes', adminAuth, async (req, res) => {
  try {
    const { notes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.notes = notes;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order notes', error: error.message });
  }
});

module.exports = router; 