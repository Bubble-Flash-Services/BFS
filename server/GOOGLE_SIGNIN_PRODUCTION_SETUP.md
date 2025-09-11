# Google Sign-In: Production Setup for bubbleflashservices.in

This guide turns your working local Google login into a production-ready setup for https://bubbleflashservices.in using the existing Passport + Express backend (Render) and Vite frontend.

## 1) Google Cloud Console Configuration

Create or update an OAuth 2.0 Client ID of type "Web application".

- OAuth consent screen:
  - Authorized domains:
    - bubbleflashservices.in
    - www.bubbleflashservices.in (if used)

- Credentials → Your Web client (Client ID):
  - Authorized JavaScript origins:
    - https://bubbleflashservices.in
    - https://www.bubbleflashservices.in (if used)
  - Authorized redirect URIs (must match backend callback exactly):
    - https://bfs-backend.onrender.com/api/auth/google/callback

Notes:
- The callback must be HTTPS and exactly match what your server uses.
- If you later host the backend on a custom domain, update this URI accordingly.

## 2) Backend (Render) Environment Variables

In Render → your backend service → Environment:

- GOOGLE_CLIENT_ID = <your production web client ID>
- GOOGLE_CLIENT_SECRET = <your production secret>
- BASE_URL = https://bubbleflashservices.in
- JWT_SECRET = <a strong random string>
- NODE_ENV = production

Optional (if you prefer configuring callback via env):
- GOOGLE_CALLBACK_URL = https://bfs-backend.onrender.com/api/auth/google/callback

Restart the backend after setting these.

## 3) Backend Code Expectations (already present)

- `server/passport.js` uses GoogleStrategy with callbackURL `/api/auth/google/callback` (relative). In production, the effective URL becomes `https://bfs-backend.onrender.com/api/auth/google/callback`.
- `server/routes/auth.js` builds a JWT and redirects to `${process.env.BASE_URL}/google-success?...` after successful login. Ensure `BASE_URL` points to your production frontend: `https://bubbleflashservices.in`.
- `server/app.js` sessions & CORS:
  - CORS is currently `origin: true, credentials: true`. For stricter config, consider:
    ```js
    app.use(cors({
      origin: [
        'http://localhost:5173',
        'https://bubbleflashservices.in',
        'https://www.bubbleflashservices.in'
      ],
      credentials: true,
    }));
    ```
  - Session cookie is `secure: process.env.NODE_ENV === 'production'`. On HTTPS, cookies will be secure-only. If frontend and backend are on different domains, also set `sameSite: 'none'` and `app.set('trust proxy', 1)` so cookies work across sites:
    ```js
    app.set('trust proxy', 1);
    app.use(session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      }
    }));
    ```

Since your login flow issues a JWT and redirects to the frontend, the session is mostly useful during the OAuth hop. The above cookie settings help avoid cross-site cookie issues during the OAuth callback.

## 4) Frontend (Vite) Env Variables

Add a `.env.production` (or set in your hosting) for the frontend build:

```
VITE_API_URL=https://bfs-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=<your production client ID>
```

Ensure anywhere you initialize the Google button or link to the backend uses these envs. Typical flows:

- "Continue with Google" button sends user to `${VITE_API_URL}/api/auth/google` (Passport redirects to Google, then back to your backend callback, then to `${BASE_URL}/google-success?...`).
- On `/google-success`, parse the `token` query param; store it client-side; treat as logged in.

## 5) DNS, HTTPS, and Mixed Content

- Ensure `https://bubbleflashservices.in` is using HTTPS with a valid certificate.
- Avoid any `http://` API calls from the frontend; always use `VITE_API_URL` over HTTPS.

## 6) Common Errors & Fixes

- redirect_uri_mismatch:
  - The callback you configured in Google must exactly equal `https://bfs-backend.onrender.com/api/auth/google/callback`.

- origin_mismatch:
  - Add your site to Authorized JavaScript origins: `https://bubbleflashservices.in` (and `https://www.bubbleflashservices.in` if used).

- CORS error or blocked by cookies:
  - Configure CORS to allow the production domain with `credentials: true`.
  - Use `cookie.sameSite = 'none'` and `cookie.secure = true` on the backend session.
  - `app.set('trust proxy', 1)` on Render to ensure secure cookies.

- Stuck on a white page after Google:
  - Check the backend logs. Make sure `BASE_URL` is set to `https://bubbleflashservices.in` so the post-login redirect goes to your frontend.

## 7) Quick Verification Checklist

- Google Cloud → OAuth client has:
  - JS origins: https://bubbleflashservices.in
  - Redirect URIs: https://bfs-backend.onrender.com/api/auth/google/callback
- Render env:
  - GOOGLE_CLIENT_ID / SECRET = production values
  - BASE_URL = https://bubbleflashservices.in
  - NODE_ENV = production
- Frontend env:
  - VITE_API_URL = https://bfs-backend.onrender.com
  - VITE_GOOGLE_CLIENT_ID = production client ID
- Test flow:
  1. Click Continue with Google on bubbleflashservices.in
  2. Consent screen → select account
  3. Redirect to onrender callback
  4. Final redirect to https://bubbleflashservices.in/google-success with token in URL
  5. User appears logged in

## 8) Optional Hardening

- Consider setting explicit allowed origins in CORS for production only.
- Log the `req.originalUrl` on callback to verify the exact URL Google is calling.
- Add rate limiting to auth endpoints.

## 9) Troubleshooting Commands (optional)

- Tail backend logs on Render and reproduce the login to see errors in real time.
- If you need to manually verify env in the running container, add a temporary `/api/debug/env` route printing relevant keys (and remove afterwards).

---
If you want, I can also patch `server/app.js` with the stricter CORS and session cookie settings and add a minimal `/google-success` handler page on the frontend that reads the token and signs the user in.
