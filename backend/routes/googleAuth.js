const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const router = express.Router();

// /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Generate JWT and set as cookie
  const user = req.user;
  const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: false });
  res.redirect('http://localhost:8080'); // Redirect to frontend or dashboard
});

module.exports = router; 