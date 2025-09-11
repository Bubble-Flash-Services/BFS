import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0]?.value,
        provider: 'google',
        googleId: profile.id,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
