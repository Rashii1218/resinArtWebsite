const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock allowsCustomText customTextLabel customTextMaxLength customTextPrice')
      .populate('user', 'firstName lastName email');

    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = await Cart.create({ 
        user: req.user._id,
        items: []
      });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Add item to cart
router.post('/items', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, customText } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ 
        user: req.user._id,
        items: []
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      // Update custom text if provided
      if (customText !== undefined) {
        existingItem.customText = customText;
      }
    } else {
      cart.items.push({ product: productId, quantity, customText });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock allowsCustomText customTextLabel customTextMaxLength customTextPrice');
    await cart.populate('user', 'firstName lastName email');

    res.json(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
});

// Update item quantity
router.patch('/items/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock allowsCustomText customTextLabel customTextMaxLength customTextPrice');
    await cart.populate('user', 'firstName lastName email');

    res.json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
});

// Remove item from cart
router.delete('/items/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product', 'name price images stock allowsCustomText customTextLabel customTextMaxLength customTextPrice');
    await cart.populate('user', 'firstName lastName email');

    res.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
});

module.exports = router; 