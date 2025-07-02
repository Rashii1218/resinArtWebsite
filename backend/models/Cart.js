const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  customText: {
    type: String,
    trim: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', async function(next) {
  try {
    let total = 0;
    for (const item of this.items) {
      const product = await mongoose.model('Product').findById(item.product);
      if (product) {
        total += product.price * item.quantity;
        // Add custom text cost if present
        if (item.customText && product.customTextPrice) {
          total += product.customTextPrice * item.quantity;
        }
      }
    }
    this.total = parseFloat(total.toFixed(2));
    next();
  } catch (error) {
    next(error);
  }
});

// Calculate total after populating
cartSchema.post('findOne', async function(doc) {
  if (doc) {
    let total = 0;
    for (const item of doc.items) {
      if (item.product && typeof item.product.price === 'number') {
        total += item.product.price * item.quantity;
        // Add custom text cost if present
        if (item.customText && item.product.customTextPrice) {
          total += item.product.customTextPrice * item.quantity;
        }
      }
    }
    doc.total = parseFloat(total.toFixed(2));
  }
});

cartSchema.post('find', async function(docs) {
  for (const doc of docs) {
    let total = 0;
    for (const item of doc.items) {
      if (item.product && typeof item.product.price === 'number') {
        total += item.product.price * item.quantity;
        // Add custom text cost if present
        if (item.customText && item.product.customTextPrice) {
          total += item.product.customTextPrice * item.quantity;
        }
      }
    }
    doc.total = parseFloat(total.toFixed(2));
  }
});

module.exports = mongoose.model('Cart', cartSchema); 