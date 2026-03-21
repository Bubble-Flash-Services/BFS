import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import crypto from "crypto";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  signinOtp,
  sendOtp,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

// Helper: generate JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

// Signup (email/password)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          message: "Name, email, and password are required",
        });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "User already exists" });
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone)
        return res.status(400).json({ message: "Phone already in use" });
    }
    // Create user; pre-save hook hashes password
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || undefined,
      address: address || undefined,
      provider: "local",
    });
    const token = generateToken(user);
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: null,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Signin (email/password)
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.provider !== "local")
      return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = generateToken(user);
    res.json({
      token,
      user: { name: user.name, email: user.email, image: null },
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Alias for /signin (for frontend compatibility)
router.post("/login", async (req, res) => {
  console.log("Login route hit");
  // Reuse /signin logic
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.provider !== "local")
    return res.status(400).json({ message: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });
  const token = generateToken(user);
  res.json({
    token,
    user: { name: user.name, email: user.email, image: null },
  });
});

// Google OAuth
// The `source` query param ('web' or 'app') is forwarded through the OAuth
// `state` parameter so it survives the round-trip through Google's servers.
// We deliberately avoid storing it in the session because server-side session
// state is unreliable across OAuth redirects (proxy hops, cross-origin cookies).
router.get("/google", googleOAuthRateLimit, (req, res, next) => {
  // Accept 'app' or 'web' as the source value.  Any other value (including
  // undefined) is treated as 'web' so that the flow degrades gracefully.
  // Only 'app' triggers the native deep-link redirect in the callback.
  const source = req.query.source === 'app' ? 'app' : 'web';
  passport.authenticate("google", {
    scope: ["profile", "email"],
    // Pass source through OAuth state so the callback knows where to redirect
    state: source,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.WEB_URL || process.env.BASE_URL || '/'}/login?error=auth_failed`,
    session: false,
  }),
  (req, res) => {
    // Successful Google login
    const user = req.user;
    if (!user) {
      const webUrl = process.env.WEB_URL || process.env.BASE_URL || '/';
      return res.redirect(`${webUrl}/login?error=user_not_found`);
    }

    const token = generateToken(user);

    // Extract the source from the OAuth state parameter that was set when the
    // login was initiated.  This is more reliable than session or user-agent
    // detection because it is carried by Google back to us in the callback URL.
    const source = req.query.state;

    let redirectUrl;
    if (source === 'app') {
      // Redirect into the native Capacitor app via a custom deep-link scheme.
      // IMPORTANT: we never redirect Google directly to the app deep link –
      // the backend always handles the callback first, generates the JWT, and
      // only then forwards the user to the app.
      const appDeepLink =
        process.env.APP_DEEP_LINK ||
        'com.bubbleflashservices.bfsapp://google-success';
      redirectUrl = `${appDeepLink}?token=${encodeURIComponent(
        token
      )}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(
        user.email
      )}&image=${encodeURIComponent(user.image || '')}`;
      console.log('📱 App-initiated OAuth: redirecting via deep link');
    } else {
      // Redirect to the web app's success page so it can store the JWT and
      // update the UI without exposing the token in the Authorization header.
      const webUrl =
        process.env.WEB_URL || process.env.BASE_URL || 'http://localhost:3000';
      redirectUrl = `${webUrl}/google-success?token=${encodeURIComponent(
        token
      )}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(
        user.email
      )}&image=${encodeURIComponent(user.image || '')}`;
      console.log('🌐 Web-initiated OAuth: redirecting to web success page');
    }

    res.redirect(redirectUrl);
  }
);

// OTP-based signin (mobile)
router.post("/signin-otp", signinOtp);

// Send OTP for signup (mobile)
router.post("/send-otp", sendOtp);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

// Simple in-memory rate limiter for the Google token endpoint (10 requests/minute per IP)
const googleTokenRateMap = new Map();
function googleTokenRateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;
  const entry = googleTokenRateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }
  googleTokenRateMap.set(ip, entry);
  if (entry.count > maxRequests) {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  }
  next();
}

// Simple in-memory rate limiter for the Google OAuth redirect (20 requests/minute per IP)
const googleOAuthRateMap = new Map();
function googleOAuthRateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;
  const entry = googleOAuthRateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }
  googleOAuthRateMap.set(ip, entry);
  if (entry.count > maxRequests) {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  }
  next();
}

// In-app Google OAuth: verify access_token from @react-oauth/google
router.post("/google-token", googleTokenRateLimit, async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "Access token required" });
    }

    // Verify token and fetch user profile from Google
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!googleRes.ok) {
      return res.status(401).json({ message: "Invalid Google access token" });
    }

    const profile = await googleRes.json();

    if (!profile.email || !profile.sub) {
      return res.status(401).json({ message: "Could not retrieve Google profile" });
    }

    // Find user by googleId, fall back to email
    let user = await User.findOne({ googleId: profile.sub });
    if (!user) {
      user = await User.findOne({ email: profile.email });
    }
    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        provider: "google",
        googleId: profile.sub,
      });
    } else if (!user.googleId) {
      user.googleId = profile.sub;
      if (!user.image) user.image = profile.picture;
      await user.save();
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        image: user.image || profile.picture,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Google token auth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

// Profile endpoints (for frontend compatibility)
router.get("/me", authenticateToken, getProfile);
router.put("/me", authenticateToken, updateProfile);

// Test route for debugging router connection
router.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("ok");
});

export default router;
