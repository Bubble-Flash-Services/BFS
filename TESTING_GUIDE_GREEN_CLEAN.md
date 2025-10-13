# 🎯 Quick Start Guide - Green & Clean Cart System

## 🚀 How to Test

### 1. Start the Application

```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
npm run dev
```

### 2. Access Green & Clean

```
Visit: http://localhost:3000/green&clean
```

---

## ✅ Testing Workflow

### Test Case 1: Add Single Service (Logged In)
1. ✅ **Login first** (if not already logged in)
2. ✅ Click "Home Cleaning" category
3. ✅ Modal opens with 3 packages
4. ✅ Button shows "Add to Cart"
5. ✅ Click "Add to Cart" on "2BHK Deep Clean (₹999)"
6. ✅ Success toast appears: "2BHK Deep Clean added to cart! 🧹"
7. ✅ Cart badge shows "1"
8. ✅ Click floating cart button
9. ✅ Cart page shows item under "Green & Clean" group

### Test Case 1B: Add Single Service (Not Logged In)
1. ✅ **Logout first** (if logged in)
2. ✅ Click "Home Cleaning" category
3. ✅ Modal opens with 3 packages
4. ✅ Button shows "Login to Add to Cart"
5. ✅ Click "Login to Add to Cart"
6. ✅ Error toast appears: "Please login to add items to cart"
7. ✅ Redirected to /login page
8. ✅ Login and return to /green&clean
9. ✅ Now can add to cart successfully

### Test Case 2: Add Multiple Services
1. ✅ Go back to /green&clean
2. ✅ Click "Sofa & Carpet"
3. ✅ Add "Sofa + Carpet Combo (₹999)"
4. ✅ Cart badge now shows "2"
5. ✅ Click "Bathroom & Kitchen"
6. ✅ Add "Kitchen Deep Clean (₹599)"
7. ✅ Cart badge shows "3"
8. ✅ Go to cart page
9. ✅ All 3 items visible under "Green & Clean"

### Test Case 3: Mix with Other Services
1. ✅ Go to /car (or /bike or /helmet)
2. ✅ Add any car wash service
3. ✅ Go to cart
4. ✅ See items grouped:
   - Car Wash (your car service)
   - Green & Clean (your cleaning services)

### Test Case 4: Checkout with COD
1. ✅ In cart, click "Proceed to Checkout"
2. ✅ Fill details:
   ```
   Address: 100 Feet Road, Indiranagar, Bangalore
   Pincode: 560038
   Phone: 9876543210
   Date: [Tomorrow's date]
   Time: 10:00 AM - 12:00 PM
   Payment: Cash on Delivery (COD)
   ```
3. ✅ Click "Place Order"
4. ✅ Order created immediately
5. ✅ Success message with order number
6. ✅ Cart cleared

### Test Case 5: Checkout with UPI
1. ✅ Add items to cart again
2. ✅ Proceed to checkout
3. ✅ Fill same details
4. ✅ Select "UPI" payment
5. ✅ Click "Place Order"
6. ✅ Razorpay modal opens
7. ✅ Use test card: `4111 1111 1111 1111`
8. ✅ CVV: `123`, Expiry: `12/25`
9. ✅ Payment successful
10. ✅ Order completed
11. ✅ Cart cleared

---

## 🔍 What to Check

### UI Elements
- [ ] Hero section with 2-column grid (left: content, right: quick select)
- [ ] 4 category cards in grid layout
- [ ] Smooth hover effects on cards
- [ ] Modal opens when clicking category
- [ ] Package cards show price, duration, features
- [ ] "Add to Cart" button on each package
- [ ] **Button shows "Login to Add to Cart" when not logged in**
- [ ] **Button shows "Add to Cart" when logged in**
- [ ] Floating cart badge (bottom-right)
- [ ] Cart badge shows correct count
- [ ] Toast notifications on add to cart

### Cart Functionality
- [ ] **Login required to add items to cart**
- [ ] **Toast error shown when not logged in**
- [ ] **Redirect to /login when not logged in**
- [ ] Cart page shows Green & Clean section
- [ ] Items grouped properly
- [ ] Can increase/decrease quantity
- [ ] Can remove items
- [ ] Subtotal calculates correctly
- [ ] GST (18%) calculates correctly
- [ ] Total amount is correct

### Checkout Flow
- [ ] All form fields appear
- [ ] Address autocomplete works
- [ ] Date picker works
- [ ] Time slot dropdown works
- [ ] Payment method selection works
- [ ] Validation shows errors for missing fields
- [ ] COD completes immediately
- [ ] UPI shows Razorpay modal

---

## 📊 Expected Cart Item Structure

When you inspect `localStorage` or Redux state, you should see:

```javascript
{
  id: "green-deep-home-1697123456789",
  type: "green-clean",
  category: "Home Cleaning",
  name: "2BHK Deep Clean",
  image: "/clean-home.jpg",
  price: 999,
  basePrice: 999,
  quantity: 1,
  duration: 180,
  features: [
    "All rooms deep cleaned",
    "Kitchen appliances",
    "Balcony & windows"
  ],
  serviceCategory: "Home Cleaning",
  metadata: {
    categoryId: "home-cleaning",
    packageId: "deep-home",
    description: "Deep cleaning for your entire home"
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Cart badge not showing
**Solution**: Check if `useCart()` hook is working
```javascript
// In browser console:
localStorage.getItem('cartItems')
```

### Issue 2: Items not added to cart
**Solution**: Check console for errors
- Verify CartContext is providing `addToCart`
- Check if toast notification appears
- Inspect network tab for errors

### Issue 3: Checkout fails
**Solution**: Verify form validation
- Ensure all required fields filled
- Check pincode format (6 digits)
- Check phone format (10 digits)
- Verify date is future date

### Issue 4: Payment modal doesn't open
**Solution**: Check Razorpay setup
- Verify Razorpay script in index.html
- Check RAZORPAY_KEY_ID in .env
- Check console for Razorpay errors

---

## 🎨 Color Scheme Verification

All Green & Clean elements should use BFS colors:

- **Primary Blue**: `#1F3C88`
- **Secondary Blue**: `#2952A3`
- **Accent Yellow**: `#FFB400`
- **Background**: Gradients with above colors

### Check These Elements:
- [ ] Hero gradient (blue to blue)
- [ ] Category card icon backgrounds (blue gradient)
- [ ] "Add to Cart" buttons (blue bg, yellow text)
- [ ] Floating cart button (yellow bg, blue text)
- [ ] Package modal header (blue gradient)
- [ ] Price tags (yellow color)

---

## 📱 Mobile Responsiveness

Test on different screen sizes:

### Desktop (1920x1080)
- [ ] 2-column hero layout
- [ ] 4-column category grid
- [ ] 3-column package modal

### Tablet (768x1024)
- [ ] 2-column hero layout
- [ ] 2-column category grid
- [ ] 2-column package modal

### Mobile (375x667)
- [ ] 1-column hero layout (stacked)
- [ ] 1-column category grid
- [ ] 1-column package modal
- [ ] Floating cart button visible
- [ ] All text readable

---

## 🔗 Key Pages to Test

1. **Homepage** → Should have Green & Clean link
2. **/green&clean** → Main service page
3. **/cart** → Cart page with items
4. **/orders** → Order history (after placing order)

---

## ✅ Success Criteria

Your implementation is working correctly if:

1. ✅ Can add Green & Clean services to cart
2. ✅ Cart badge shows correct item count
3. ✅ Cart page groups items under "Green & Clean"
4. ✅ Can mix Green & Clean with other services
5. ✅ Checkout works with COD
6. ✅ Checkout works with UPI
7. ✅ Order is created in database
8. ✅ Cart is cleared after order
9. ✅ No console errors
10. ✅ All UI elements match BFS theme

---

## 📞 Quick Reference

### Routes
- `/green&clean` - Main service page
- `/cart` - Shopping cart
- `/checkout` - Checkout modal (part of cart page)
- `/orders` - Order history

### Components
- `GreenCleanCart.jsx` - Main service page
- `CartContext.jsx` - Cart state management
- `CartPage.jsx` - Cart & checkout UI

### API Endpoints
- `GET /api/green/services` - Load services (optional)
- `POST /api/orders` - Create order
- `POST /api/coupons/validate` - Apply coupon

### Payment Methods
- **COD**: Immediate order placement
- **UPI**: Razorpay modal → Payment → Order confirmation

---

## 🎯 Next Steps After Testing

1. ✅ Test all user flows
2. ✅ Verify mobile responsiveness
3. ✅ Check console for errors
4. ✅ Test with real data
5. ✅ Verify order creation
6. ✅ Test payment gateway
7. ✅ Review UX/UI
8. ✅ Get user feedback

---

## 🎉 You're All Set!

The Green & Clean cart-based booking system is now complete and ready for testing!

**Happy Testing!** 🚀🧹

---

**Last Updated**: October 13, 2025
**Version**: 2.0 (Cart-Based)
