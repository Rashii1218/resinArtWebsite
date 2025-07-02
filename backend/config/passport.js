const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Only configure Google OAuth if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Fallback for missing names
        let firstName = profile.name?.givenName || '';
        let lastName = profile.name?.familyName;
        if (!lastName) {
          // Try to extract from displayName
          const fullName = profile.displayName || '';
          const parts = fullName.split(' ');
          if (parts.length > 1) {
            lastName = parts.slice(1).join(' ');
          } else {
            lastName = 'GoogleUser';
          }
        }
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName,
          lastName,
          avatar: profile.photos[0].value,
          password: '' // No password for Google users
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
} else {
  console.log('Google OAuth credentials not found. Google sign-in will be disabled.');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}); 