const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');
const adminAuth = require('../middleware/adminAuth');

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Create a new category (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    console.log('Received category data:', { name, description, image });
    
    // Upload image to Cloudinary if provided
    let imageData = null;
    if (image && image.url && image.public_id) {
      console.log('Using provided image data:', image);
      imageData = {
        url: image.url,
        public_id: image.public_id
      };
    } else if (image) {
      console.log('Uploading image to Cloudinary...');
      const result = await cloudinary.uploader.upload(image, {
        folder: 'categories',
        width: 300,
        crop: "scale"
      });
      console.log('Cloudinary upload result:', result);
      
      imageData = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }
    console.log('Formatted image data:', imageData);

    const categoryData = { 
      name, 
      description,
      image: imageData
    };
    console.log('Creating category with data:', categoryData);

    const category = await Category.create(categoryData);
    console.log('Created category:', category);
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category already exists' });
    } else {
      res.status(500).json({ 
        message: 'Error creating category',
        error: error.message 
      });
    }
  }
});

// Update a category (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const updateData = { name, description };

    // Handle image update if provided
    if (image) {
      // Delete old image if exists
      const oldCategory = await Category.findById(req.params.id);
      if (oldCategory?.image?.public_id) {
        await cloudinary.uploader.destroy(oldCategory.image.public_id);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(image, {
        folder: 'categories',
        width: 300,
        crop: "scale"
      });
      
      updateData.image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
});

// Delete a category (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete image from Cloudinary if exists
    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router; 