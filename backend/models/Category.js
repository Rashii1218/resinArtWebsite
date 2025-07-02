const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    url: {
      type: String,
      required: false
    },
    public_id: {
      type: String,
      required: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema); 