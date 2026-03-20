/**
 * Passport.js Google OAuth Strategy Configuration
 *
 * This module sets up the Google OAuth 2.0 strategy used for both web and
 * Capacitor mobile app authentication. A single strategy is shared by both
 * platforms – the per-request `source` value is passed via the OAuth `state`
 * parameter rather than being encoded here.
 */

import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Serialize only the user's database ID into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize by fetching the full user document from MongoDB
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/**
 * Google OAuth 2.0 Strategy
 *
 * The callbackURL must match the "Authorized redirect URI" configured in the
 * Google Cloud Console.  Set GOOGLE_CALLBACK_URL in your environment to the
 * full URL, e.g. https://api.example.com/api/auth/google/callback.
 *
 * `passReqToCallback` is enabled so that, if needed in the future, the
 * request object (and therefore the OAuth state) can be inspected inside the
 * verify callback.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Full backend callback URL, e.g. BACKEND_URL/api/auth/google/callback
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        `${process.env.BACKEND_URL || ''}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Google profiles always include at least one email, but guard
        // defensively in case the OAuth scope response is incomplete.
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('Google profile did not provide an email address'), null);
        }

        // Find existing user by Google ID, fall back to matching email
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.findOne({ email });
        }

        if (!user) {
          // Create a new user record for first-time Google sign-in
          user = await User.create({
            name: profile.displayName,
            email,
            image: profile.photos?.[0]?.value,
            provider: 'google',
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          // Link Google ID to an existing email-based account
          user.googleId = profile.id;
          if (!user.image) user.image = profile.photos?.[0]?.value;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
