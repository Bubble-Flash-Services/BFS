# Razorpay Live Mode Setup (Render deployment)

This guide explains how to enable and verify Razorpay payments in LIVE mode for your backend hosted at:

- Backend (Render): https://bfs-backend.onrender.com

The backend already includes Razorpay integration and routes. Follow these steps to switch to LIVE keys, configure webhooks, and complete the frontend flow.

---

## 1) Prerequisites

- A Razorpay account with LIVE mode enabled and KYC approved.
- Access to Render dashboard for the backend service (Environment tab).
- Your MongoDB and JWT secrets already configured in Render.

---

## 2) Environment variables (Render → Backend → Environment)

Add or update the following environment variables with LIVE values:

- RAZORPAY_KEY_ID = <your_live_key_id>
- RAZORPAY_KEY_SECRET = <your_live_key_secret>
- RAZORPAY_WEBHOOK_SECRET = <strong_unique_secret_string>
- NODE_ENV = production

Make sure the existing variables are also set correctly:

- MONGO_URI = <your_production_mongo_uri>
- JWT_SECRET = <your_production_jwt_secret>
- PORT = 10000 (Render assigns a port internally; leaving default 5000 is fine too)

Click “Save” and redeploy/restart the service.

---

## 3) Backend endpoints already available

The backend exposes these payment routes (mounted at `/api/payments`):

- POST /api/payments/create-order  (Protected)
- POST /api/payments/verify        (Protected)
- POST /api/payments/failure       (Protected)
- GET  /api/payments/status/:orderId (Protected)
- POST /api/payments/webhook/razorpay (Public)

Your Render base URL: `https://bfs-backend.onrender.com`

Examples:
- Create order: `https://bfs-backend.onrender.com/api/payments/create-order`
- Verify payment: `https://bfs-backend.onrender.com/api/payments/verify`
- Webhook URL: `https://bfs-backend.onrender.com/api/payments/webhook/razorpay`

Note: “Protected” requires an Authorization header: `Bearer <user_token>`.

---

## 4) Configure the Razorpay Webhook (LIVE)

In Razorpay Dashboard (LIVE mode):

1. Go to: Settings → Webhooks → Add new webhook
2. Webhook URL: `https://bfs-backend.onrender.com/api/payments/webhook/razorpay`
3. Secret: Use the same value as `RAZORPAY_WEBHOOK_SECRET` (step 2)
4. Content type: `application/json`
5. Active events (at minimum):
   - `payment.captured`
   - `payment.failed`
6. Click “Create Webhook”.

If you rotate the webhook secret later, update `RAZORPAY_WEBHOOK_SECRET` in Render to match.

---

## 5) Frontend payment flow (LIVE)

The server integrates Razorpay as follows (see `server/controllers/paymentController.js`):

1) Create an order on your server (user must be authenticated):
   - Request
     - POST `/api/payments/create-order`
     - Headers: `Authorization: Bearer <token>`
     - Body JSON:
       ```json
       { "amount": 1399, "orderId": "<mongo_order_id>" }
       ```
       - `amount` is in INR rupees. The server converts it to paise for Razorpay.
   - Response (success)
     ```json
     {
       "success": true,
       "data": {
         "orderId": "order_XXXXXXXXXX",    // Razorpay order id
         "amount": 139900,                   // paise
         "currency": "INR",
         "key": "rzp_live_xxx"             // your LIVE key id
       }
     }
     ```

2) Open Razorpay Checkout on the frontend using the LIVE `key` and `orderId` from step 1. Example options:
   ```js
   const options = {
     key: data.key,                 // rzp_live_...
     amount: data.amount,           // in paise (from server response)
     currency: data.currency,
     order_id: data.orderId,        // Razorpay order id
     name: 'Bubble Flash Services',
     description: 'Order Payment',
     handler: async function (response) {
       // On success, verify with the backend
       await fetch(`${API}/api/payments/verify`, {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           razorpay_order_id: response.razorpay_order_id,
           razorpay_payment_id: response.razorpay_payment_id,
           razorpay_signature: response.razorpay_signature,
           orderId: mongoOrderId
         })
       });
     },
     prefill: { name, email, contact },
     theme: { color: '#3399cc' }
   };
   const rzp = new window.Razorpay(options);
   rzp.open();
   ```

3) On payment failure, optionally notify the server:
   - POST `/api/payments/failure` with `{ orderId, error }`

4) Webhooks (server-side):
   - The webhook handler updates orders on `payment.captured` / `payment.failed` even if the client fails to verify.

5) Status check (optional):
   - GET `/api/payments/status/:orderId` to read `paymentStatus` and `orderStatus`.

---

## 6) Live vs Test keys

- Switch Razorpay Dashboard to LIVE mode to generate `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- Set these LIVE keys in Render (step 2), redeploy, then your server responses will include LIVE `key` and create LIVE orders.
- Your frontend must load Razorpay Checkout from the LIVE environment (the same script works; the key determines mode).

---

## 7) Validation and smoke test

1. Open your site and place a small-value order in LIVE mode.
2. Confirm:
   - Client success handler runs.
   - Backend `/api/payments/verify` returns success.
   - Order document’s `paymentStatus` becomes `completed` and status moves to `confirmed`.
   - Razorpay Dashboard shows a LIVE payment.
3. (Optional) Trigger `payment.captured` from Razorpay to verify the webhook updates the order.

---

## 8) Troubleshooting

- Invalid signature in verify:
  - Ensure `RAZORPAY_KEY_SECRET` is the LIVE secret and matches the key used on the frontend.
  - Ensure you are passing the exact `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` from Razorpay Checkout response.

- Webhook signature invalid:
  - Confirm the webhook URL and `RAZORPAY_WEBHOOK_SECRET` match exactly between Razorpay Dashboard and Render.
  - Make sure the webhook is configured for LIVE mode (not Test), and the event fired is a LIVE payment.
  - Note: The current implementation verifies using `JSON.stringify(req.body)`. For stricter compliance, you can switch to raw body parsing for the webhook route:
    ```js
    // In app.js, BEFORE app.use(express.json())
    import express from 'express';
    app.use('/api/payments/webhook/razorpay', express.raw({ type: 'application/json' }));
    // Then inside the webhook handler, compute HMAC on the raw body buffer
    ```
  - If you adopt raw parsing, adjust the handler to use the raw body while computing HMAC.

- Amount mismatches:
  - Send `amount` as rupees to `/create-order`. The server converts to paise internally.

- 401 Unauthorized from protected endpoints:
  - Ensure the user is logged in and you pass `Authorization: Bearer <token>`.

---

## 9) Reference (code)

- Controller: `server/controllers/paymentController.js`
- Routes: `server/routes/payments.js`
- App mount: `server/app.js` (router mounted at `/api/payments`)

---

## 10) Support

- Razorpay docs: https://razorpay.com/docs
- Render docs: https://docs.render.com
- Backend health: `GET https://bfs-backend.onrender.com/api/health`
