const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // Custom text field
  customText: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can't have duplicate products in cart
cartItemSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema); 