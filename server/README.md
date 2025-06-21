# BFS Backend

## Features
- User signup/signin with email/password
- Google OAuth login
- JWT authentication
- MongoDB (Mongoose)
- User profile endpoint

## Endpoints
- `POST /api/auth/signup` — Signup with email/password
- `POST /api/auth/signin` — Signin with email/password
- `GET /api/auth/google` — Start Google OAuth
- `GET /api/auth/google/callback` — Google OAuth callback
- `GET /api/user/me` — Get current user profile (JWT required)

## Setup
1. Install dependencies:
   ```sh
   npm install express mongoose cors dotenv bcryptjs jsonwebtoken passport passport-google-oauth20 express-session
   ```
2. Set up your `.env` file (see `.env` in this folder).
3. Start MongoDB locally or use MongoDB Atlas.
4. Run the server:
   ```sh
   npm start
   ```
