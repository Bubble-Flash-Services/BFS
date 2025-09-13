# Bubble Flash Services (BFS) — Project Overview (Interview Doc)

A full‑stack on‑demand vehicle care and laundry platform with modern UX, subscription plans, add‑ons, cart + checkout, payments, and admin tooling.

## Elevator Pitch
BFS lets users book premium car/bike wash services and laundry with transparent pricing, curated add‑ons, monthly plans, and smooth checkout. It features a modern, mobile‑first UI, real customer testimonials, category‑aware imagery, and a robust Node/Express + MongoDB backend integrated with Razorpay and Google Sign‑In.

---

## Architecture at a Glance
- Frontend: React 18 + Vite, React Router, Context API (Auth/Cart), Tailwind CSS, Framer Motion, custom touch/drag sliders.
- Backend: Node.js + Express, MongoDB (Mongoose), REST APIs, Passport (Google), Razorpay, Telegram notifications to admins.
- Infra/Dev: Render deployment (render.yaml), environment‑driven config (.env), seed scripts and server test scripts.

```
React (Vite)  ──>  Express API ──> MongoDB
     │                  │            │
     ├─ Razorpay UPI    └─ Passport  └─ Mongoose models
     └─ Tailwind/Framer Motion
```

---

## Key User Flows
1) Discover services
- Landing hero with category tiles and ad banner carousel.
- Car/Bike pages to select categories (Hatchback/Sedan/SUV/Luxury; Commuter/Cruiser/Sports).

2) Configure package
- Packages with feature lists, foam upgrades, add‑ons, and monthly plans (Gold/Platinum variants).
- Category-aware images (no more “all hatchback” default).

3) Add to cart & checkout
- Cart groups items, applies coupons, computes subtotals + GST (18%), and proceeds to checkout.
- Address selection and schedule time slots with pincode serviceability checks (Bangalore filters).
- Payment via UPI (Razorpay) or COD.

4) Post‑order
- Order creation persists all details (items, plan details, add‑ons, prices, tax, discount) and notifies admins.

---

## Frontend (src/)
- Library choices:
  - React 18 + Vite: fast dev/build, ESM, tree-shaking.
  - Tailwind CSS: utility-first styling for consistent, responsive layouts.
  - Framer Motion: subtle animations for banners, sliders, and CTA interactions.
  - React Router: navigation between home, service pages, deals, cart, orders.
  - Contexts: useAuth, useCart for global auth and cart state.

- Core pages/components:
  - pages/Homepage/HeroSection.jsx
    - Ad banner carousel, service category tiles.
    - Car accessories slider (touch/drag friendly) with improved item identification to avoid wrong item added on mobile.
    - Real customer testimonials with initial avatars and 5-star ratings.
  - pages/Homepage/services/CarWashDeals.jsx & BikeWashDeals.jsx
    - Packages with feature lists, add‑ons, monthly plans slider (desktop grid + mobile slider).
    - Booking modal with image slider, touch gestures, and add‑on selection.
    - BFS Full Body Checkup sections (placed on car/bike pages/deals only).
  - pages/Homepage/services/CarsPage.jsx & BikesPage.jsx
    - “Select by cars/bikes” category selectors (desktop grid + mobile slider).
    - Full Body Checkup section per category page.
  - components/FullBodyCheckup.jsx
    - Reusable Car/Bike visual inspection checklist.
  - pages/CartPage.jsx
    - Order summary, coupon application, GST (18%) calculation, UPI/COD payment path.
  - pages/OrdersPage.jsx
    - Order list/details; shows subtotal/total; can be extended to display tax breakdown.

- Modern UI/UX highlights:
  - Tailwind-based responsive grid layouts and gradients.
  - Framer Motion animations (fade/slide in, rotating accent ring on accessory icons, interactive buttons).
  - Custom touch/drag swipe handlers for carousels on mobile.
  - Category-specific imagery for monthly plans preventing mismatched visuals.

- Notable frontend fixes/enhancements:
  - Accessory Add-to-Cart (mobile): Stable slug-based IDs + data-slug on buttons to prevent always adding first item.
  - Single-root JSX returns: Restructured pages to fix rendering issues.
  - GST added: UI shows Subtotal, Coupon, Taxable, GST (18%), and Final Total consistently.

---

## Backend (server/)
- Tech stack: Node.js, Express, Mongoose, Passport, Razorpay.
- Controllers (server/controllers/):
  - authController.js, userController.js: sign-in (Google via Passport), user profile.
  - cartController.js: get/add/update/remove/sync cart, computes totals and GST consistently.
  - orderController.js: validation (serviceable pincode), computes subtotal, discount, GST (18%), and total; persists all order details; sends Telegram admin notifications.
  - paymentController.js: payment workflow (Razorpay integration; docs included).
  - couponController.js: coupon validation and discount calculation.
  - serviceController.js, addressController.js, callbackController.js: catalog, address checks, webhooks/callbacks.

- Middleware: auth.js, authAdmin.js for securing routes.
- Models (server/models/):
  - Core: Service, Package, AddOn, Cart, Order, Coupon, Address.
  - Users/Admin/Employee: Admin, Employee, User.
  - Others: Advertisement, etc.

- Recent tax enhancement:
  - Cart model fields: subtotalAmount, taxRate (default 0.18), taxAmount; pre-save computes tax and total.
  - Order model fields: taxRate, taxAmount; orderController computes tax and total server-side.
  - getCart backfills tax for older carts to maintain compatibility.

- Payments
  - Razorpay UPI integration; setup docs (RAZORPAY_LIVE_SETUP.md).
  - Cash on Delivery fallback.

- Auth
  - Google Sign‑In via Passport (passport.js + GOOGLE_SIGNIN_PRODUCTION_SETUP.md).

- Admin / Ops
  - Telegram notifications on orders (services/telegramService.js).
  - Seed scripts (seedDatabase, seedCoupons, seedAdminEmployee).
  - Test scripts for routes and flows (test-*.js) to validate key endpoints.

---

## Data Model Highlights
- Cart
  - items: [{ serviceId, packageId?, quantity, price, addOns[], laundryItems[], vehicleType, specialInstructions }]
  - subtotalAmount, taxRate, taxAmount, totalAmount, totalItems.
- Order
  - items: service + package refs and immutable snapshot fields (serviceName, image, type/category, packageName, price, quantity, addOns, laundryItems, includedFeatures, planDetails).
  - serviceAddress, scheduledDate/TimeSlot, paymentMethod/Status, couponCode, subtotal, discountAmount, taxRate, taxAmount, totalAmount.

---

## API Surface (Selected)
- Cart: GET /api/cart, POST /api/cart (add), PATCH /api/cart/:itemId, DELETE /api/cart/:itemId, POST /api/cart/sync.
- Orders: POST /api/orders (create) → returns order with totals and tax.
- Coupons: POST /api/coupons/validate → returns discount amount.
- Services: GET service lists and packages (config-driven UI).

Error Modes & Validation
- Missing services/add‑ons handled with 404 on add; fallback services for accessory auto-create when enabled.
- Serviceable area enforced at checkout (Bangalore pincodes unless DEV_MODE).

---

## Implementation Details & Notable Decisions
- Stable accessory IDs
  - Slug-based deterministic IDs to keep distinct items separate and avoid merging/overwriting in the cart.
- Category-aware visuals
  - Helper selects correct car image per category for monthly plans and modals.
- Tax consistency
  - Tax computed on backend (source of truth) and mirrored on frontend for immediate UX feedback.
- Mobile gestures
  - Custom touch/drag logic for both package and accessories sliders; thresholds + speed checks for natural swipes.

---

## Testing & Quality
- Server test scripts (test-*.js) cover routes, orders, carts, and simple flows.
- Defensive coding in controllers (graceful fallbacks; detailed logging).
- Linting/Type: JavaScript with consistent code style; Vite dev server fast feedback.

---

## Deployment & Config
- Render deployment via `render.yaml`.
- `.env` (server):
  - MongoDB URI, JWT/Session secrets, Razorpay keys, Google OAuth, feature toggles (e.g., ALLOW_ACCESSORY_AUTOCREATE), DEV_MODE.
- `package.json` (root + server) scripts for dev/build/start.

---

## Security & Privacy
- Auth-protected routes for cart/order.
- Payment handled by Razorpay; sensitive keys in environment vars.
- Admin-only actions gated by middleware.

---

## What Makes It “Modern”
- Responsive Tailwind UI with tasteful animations (Framer Motion).
- Composable, reusable components (FullBodyCheckup, sliders, modals).
- Real-time UX: mobile gestures, auto-play banners, category-specific visuals.
- Robust backend with proper data modeling, coupon/tax flows, and integrations.

---

## Recent Highlights You Can Mention
- Fixed a mobile bug where accessories always added the first item; used slug IDs and delegated click resolution.
- Implemented 18% GST end-to-end (backend models/controllers + frontend UI) with discount-aware taxable base.
- Moved Full Body Checkup section to relevant pages only (car/bike deals & selectors) to reduce homepage noise.
- Ensured monthly plans show category-correct images across flows.

---

## Roadmap Ideas
- Show tax breakdown on Orders details page (frontend) and invoices.
- Add inventory/stock for accessories and delivery option.
- Expand serviceable cities with dynamic pincode configuration.
- Introduce subscriptions with proration and renewal reminders.

---

## Quick Demo Script (2–3 min)
1) Home: show ad banner, categories, reviews. Scroll to Car wash Accessories slider and add an item (mobile gesture support).
2) Cars Page: select a category; open deals; show monthly plan cards and booking modal.
3) Cart: apply coupon, see Subtotal → Discount → Taxable → GST (18%) → Total. Proceed to checkout.
4) Checkout: provide address (Bangalore pincode), pick time slot, choose UPI/COD; explain order creation and admin notification.

Use this doc to guide your interview explanation from high-level architecture to specific implementation details and recent improvements.
