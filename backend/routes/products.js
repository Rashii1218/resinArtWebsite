const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

// Create a new product (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      stock, 
      images, 
      allowsCustomText, 
      customTextLabel, 
      customTextMaxLength, 
      customTextPrice 
    } = req.body;
    console.log('Received product data:', { 
      name, 
      description, 
      price, 
      category, 
      stock, 
      images, 
      allowsCustomText, 
      customTextLabel, 
      customTextMaxLength, 
      customTextPrice 
    });

    // Validate required fields
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate and format images
    const formattedImages = Array.isArray(images) 
      ? images.filter(img => {
          console.log('Processing image:', img);
          return img && img.url && img.public_id;
        }).map(img => ({
          url: img.url,
          public_id: img.public_id
        }))
      : [];

    console.log('Formatted images:', formattedImages);

    const productData = {
      name,
      description,
      price,
      category,
      stock,
      images: formattedImages,
      allowsCustomText: allowsCustomText || false,
      customTextLabel: customTextLabel || "Custom Text",
      customTextMaxLength: customTextMaxLength || 50,
      customTextPrice: customTextPrice || 0
    };

    console.log('Creating product with data:', productData);

    const product = await Product.create(productData);

    console.log('Created product:', product);

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Error creating product',
      error: error.message 
    });
  }
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get featured products (public)
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6, sort = '-createdAt' } = req.query;
    const featuredProducts = await Product.find({ isFeatured: true })
      .sort(sort)
      .limit(parseInt(limit))
      .populate('category', 'name');
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching featured products' });
  }
});

// Get a single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Update product (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, stock, images, isFeatured } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, images, isFeatured },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => { 
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router; 