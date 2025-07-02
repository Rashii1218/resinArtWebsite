const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Received upload request');
    console.log('Request file:', req.file ? {
      fieldname: req.file.fieldname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
    } : 'No file');
    console.log('Request query:', req.query);
    console.log('Request headers:', req.headers);
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing'
    });

    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ message: 'No image file provided' });
    }

    if (!req.file.buffer) {
      console.log('No file buffer');
      return res.status(400).json({ message: 'Invalid file data' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Determine folder based on type parameter
    const folder = req.query.type === 'category' ? 'categories' : 'resin-art';
    console.log('Using folder:', folder);

    console.log('Uploading to Cloudinary...');

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto'
    }).catch(error => {
      console.error('Cloudinary upload error:', error);
      throw error;
    });

    console.log('Cloudinary upload result:', result);

    if (!result.secure_url || !result.public_id) {
      console.error('Invalid Cloudinary response:', result);
      throw new Error('Invalid response from Cloudinary');
    }

    const response = {
      url: result.secure_url,
      public_id: result.public_id
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error uploading image:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response'
    });
    res.status(500).json({ 
      message: 'Error uploading image',
      error: error.message,
      details: error.stack
    });
  }
});

// Delete image
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error deleting image' });
  }
});

module.exports = router; 