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
router.get(
  "/google",
  (req, res, next) => {
    // Store the source parameter in session to preserve it through OAuth flow
    // Validate source parameter to prevent session pollution
    if (req.query.source === 'app') {
      req.session = req.session || {};
      req.session.oauthSource = 'app';
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful Google login
    const user = req.user;
    const token = generateToken(user);
    
    // Check if the request came from the native app
    // The app adds ?source=app to the initial OAuth request
    const source = req.query.source || req.session?.oauthSource;
    
    // Clean up session
    if (req.session?.oauthSource) {
      delete req.session.oauthSource;
    }
    
    // Detect if request is from Android or iOS device
    const userAgent = req.headers['user-agent'] || '';
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isMobile = isAndroid || isIOS;
    
    // Use custom scheme ONLY if explicitly from the app (source=app) and on a mobile platform
    // Otherwise, use HTTPS URL even on mobile devices (for mobile web browsers)
    let redirectUrl;
    if (source === 'app' && isMobile) {
      console.log('📱 App-initiated OAuth detected, using custom scheme for direct app redirect');
      redirectUrl = `com.bubbleflashservices.bfsapp://google-success?token=${encodeURIComponent(token)}&name=${encodeURIComponent(
        user.name
      )}&email=${encodeURIComponent(user.email)}&image=${encodeURIComponent(
        user.image || ""
      )}`;
    } else {
      // For web browsers (desktop or mobile), use HTTPS URL
      console.log('🌐 Web-initiated OAuth detected, using HTTPS redirect');
      redirectUrl = `${
        process.env.BASE_URL
      }/google-success?token=${encodeURIComponent(token)}&name=${encodeURIComponent(
        user.name
      )}&email=${encodeURIComponent(user.email)}&image=${encodeURIComponent(
        user.image || ""
      )}`;
    }
    
    console.log(`Redirecting to: ${redirectUrl.substring(0, 100)}...`);
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
