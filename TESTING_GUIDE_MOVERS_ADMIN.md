# Testing Guide: Movers & Packers and Admin Updates

## Quick Start

### Prerequisites
1. MongoDB running
2. Backend server running on port 3000 (or configured port)
3. Frontend dev server or built app running
4. Admin account created for testing admin features

### Test Accounts Needed
- Regular user account (for customer-facing features)
- Admin account (for admin panel testing)
- Employee accounts (for assignment testing)
- Provider accounts (for Green & Clean assignment)

---

## Test Cases

### 1. Authentication Flow Testing

#### Test 1.1: Token Expiration Check
**Steps:**
1. Login with valid credentials
2. Note the token in localStorage
3. Wait for token to expire (or modify exp time in JWT)
4. Try to access a protected route (e.g., /profile)
5. **Expected**: Automatic logout and redirect to home page

#### Test 1.2: 401 Error Handling
**Steps:**
1. Login with valid credentials
2. Clear token from localStorage
3. Try to make an API call (e.g., fetch profile)
4. **Expected**: 401 error caught, user logged out, redirected to home

#### Test 1.3: Profile Refresh
**Steps:**
1. Login with valid credentials
2. Refresh the page
3. **Expected**: User remains logged in, profile data loaded

---

### 2. Movers & Packers Page Testing

#### Test 2.1: UI Elements Display
**Steps:**
1. Navigate to `/movers-packers`
2. Verify page loads with all sections
3. **Expected**: 
   - Header with truck icon visible
   - Move type selection (2 buttons)
   - Home size selection (5 options)
   - Location section with gradient background
   - Date picker
   - Vehicle shifting section
   - Painting services section
   - Contact information fields
   - No login button visible anywhere

#### Test 2.2: Address Autocomplete
**Steps:**
1. Click in "Pickup Address" field
2. Type "123 Main St"
3. **Expected**: Suggestions appear
4. Select a suggestion
5. **Expected**: Address fills in, shows below field with green pin icon
6. Repeat for "Destination Address"
7. **Expected**: Shows with red pin icon

#### Test 2.3: Current Location
**Steps:**
1. Click target icon in address field
2. **Expected**: Browser asks for location permission
3. Allow location
4. **Expected**: Current address fills in automatically

#### Test 2.4: Vehicle Selection
**Steps:**
1. Toggle "Need Vehicle Shifting?" to Yes
2. **Expected**: Vehicle options appear (Car, Bike, Scooter, Others)
3. Click + on Car
4. **Expected**: Counter increases to 1
5. Click + again
6. **Expected**: Counter increases to 2
7. Click - once
8. **Expected**: Counter decreases to 1

#### Test 2.5: Painting Services
**Steps:**
1. Toggle "Need Painting Services?" to Yes
2. **Expected**: Three checkbox options appear
3. Check "Interior Painting"
4. **Expected**: Checkbox selected
5. Check "Exterior Painting"
6. **Expected**: Both checkboxes selected

#### Test 2.6: Price Quote Calculation
**Steps:**
1. Select "Within City" move type
2. Select "2BHK" home size
3. **Expected**: Price quote appears showing base price
4. Add 1 Car for vehicle shifting
5. **Expected**: Price updates with vehicle cost
6. Enable interior painting
7. **Expected**: Price updates with painting cost
8. Verify total is sum of all costs

#### Test 2.7: Form Validation
**Steps:**
1. Try to submit without selecting home size
2. **Expected**: Error toast "Please select home size"
3. Select home size but don't enter source address
4. **Expected**: Error toast "Please enter source address"
5. Fill all required fields
6. Try to submit without logging in
7. **Expected**: Error toast "Please login to book our services"

#### Test 2.8: Booking Submission (Logged In)
**Steps:**
1. Login as regular user
2. Fill all required fields
3. Click "Book Now"
4. **Expected**: 
   - Submit button shows loading state
   - Success toast appears
   - Redirect to /orders after 2 seconds

#### Test 2.9: Date Validation
**Steps:**
1. Try to select today's date
2. **Expected**: Date picker doesn't allow today or past dates
3. Select tomorrow's date
4. **Expected**: Date is accepted

---

### 3. Admin - Movers & Packers Testing

#### Test 3.1: Access Control
**Steps:**
1. Try to access `/admin/movers-packers` without logging in
2. **Expected**: Redirect to admin login
3. Login as admin
4. **Expected**: Redirect to admin page

#### Test 3.2: View All Bookings
**Steps:**
1. Navigate to `/admin/movers-packers`
2. **Expected**: 
   - Page shows all bookings in card format
   - Each card shows booking details
   - Status badges are color-coded
   - Booking ID visible (last 8 characters)

#### Test 3.3: Filter by Status
**Steps:**
1. Click status filter dropdown
2. Select "Pending"
3. **Expected**: Only pending bookings shown
4. Change to "Confirmed"
5. **Expected**: Only confirmed bookings shown
6. Select "All Status"
7. **Expected**: All bookings shown

#### Test 3.4: Search Functionality
**Steps:**
1. Type a phone number in search field
2. **Expected**: Bookings filtered in real-time
3. Clear search and type an address
4. **Expected**: Bookings with matching address shown
5. Type non-existent text
6. **Expected**: "No bookings found" message

#### Test 3.5: Assign Employee
**Steps:**
1. Click "Assign Employee" on a booking
2. **Expected**: Modal opens with employee dropdown
3. Select an employee from dropdown
4. Click "Assign"
5. **Expected**: 
   - Success toast appears
   - Modal closes
   - Booking refreshes showing assigned employee
6. Open assign modal again
7. **Expected**: Previously assigned employee is shown

#### Test 3.6: Update Status
**Steps:**
1. Click "Update Status" on a booking
2. **Expected**: Modal opens with status dropdown and notes field
3. Select "Confirmed" status
4. Type "Customer confirmed booking" in notes
5. Click "Update"
6. **Expected**: 
   - Success toast appears
   - Modal closes
   - Booking status badge updates to blue "confirmed"
7. Open status modal again
8. **Expected**: Notes field shows previous notes

#### Test 3.7: Status Progression
**Steps:**
1. Create test booking in "pending" status
2. Update to "confirmed"
3. Update to "in-progress"
4. Update to "completed"
5. **Expected**: Each transition works, colors change appropriately

---

### 4. Admin - Green & Clean Testing

#### Test 4.1: Access Control
**Steps:**
1. Navigate to `/admin/green-clean`
2. **Expected**: Admin authentication required
3. Login as admin
4. **Expected**: Page loads with bookings

#### Test 4.2: View All Bookings
**Steps:**
1. Page shows all green & clean bookings
2. **Expected**: 
   - Service name displayed
   - Booking number visible
   - Customer details shown
   - Address displayed
   - Total amount shown
   - Status color-coded

#### Test 4.3: Filter and Search
**Steps:**
1. Filter by "assigned" status
2. **Expected**: Only assigned bookings shown
3. Search by booking number
4. **Expected**: Specific booking appears
5. Search by customer phone
6. **Expected**: Customer's bookings appear

#### Test 4.4: Assign Provider
**Steps:**
1. Click "Assign Provider" button
2. **Expected**: Modal opens with provider dropdown
3. Select a provider
4. Click "Assign"
5. **Expected**: 
   - Success toast
   - Provider name shown in booking card
   - Status updates to "assigned"

#### Test 4.5: Update Status with Notes
**Steps:**
1. Click "Update Status"
2. Select "in_progress"
3. Add note "Service started"
4. Click "Update"
5. **Expected**: 
   - Status updates
   - Notes saved and visible
6. Update to "completed"
7. **Expected**: Completion timestamp set

---

### 5. Navigation and Integration Testing

#### Test 5.1: Admin Sidebar Navigation
**Steps:**
1. Login as admin
2. Go to `/admin/dashboard`
3. Click "Movers & Packers" in sidebar
4. **Expected**: Navigate to movers admin page, item highlighted
5. Click "Green & Clean" in sidebar
6. **Expected**: Navigate to green clean page, item highlighted
7. Click "Dashboard"
8. **Expected**: Return to dashboard

#### Test 5.2: Mobile Responsive
**Steps:**
1. Resize browser to mobile width (375px)
2. **Expected**: 
   - Sidebar collapses
   - Menu button appears
   - Forms stack vertically
3. Click menu button
4. **Expected**: Sidebar slides in
5. Select menu item
6. **Expected**: Sidebar closes, navigates

#### Test 5.3: Multiple Admin Sessions
**Steps:**
1. Open admin panel in one browser
2. Open same admin panel in different browser
3. Make changes in first browser
4. **Expected**: Changes persist
5. Refresh second browser
6. **Expected**: Changes visible

---

### 6. Error Handling Testing

#### Test 6.1: Network Error
**Steps:**
1. Disconnect from internet
2. Try to submit booking
3. **Expected**: Error toast shown
4. Reconnect internet
5. Retry
6. **Expected**: Submission succeeds

#### Test 6.2: Invalid Data
**Steps:**
1. Enter invalid phone number (letters)
2. Try to submit
3. **Expected**: Validation error
4. Enter valid phone
5. **Expected**: Submission allowed

#### Test 6.3: Server Error
**Steps:**
1. Stop backend server
2. Try to load admin bookings
3. **Expected**: Error toast "Failed to fetch bookings"
4. Start server
5. Refresh page
6. **Expected**: Data loads

---

### 7. Performance Testing

#### Test 7.1: Large Dataset
**Steps:**
1. Create 50+ bookings
2. Load admin page
3. **Expected**: Page loads smoothly
4. Search and filter
5. **Expected**: Operations are fast

#### Test 7.2: Rapid Actions
**Steps:**
1. Quickly change filters multiple times
2. **Expected**: No errors, smooth updates
3. Type rapidly in search
4. **Expected**: Debounced, no lag

---

### 8. Backward Compatibility Testing

#### Test 8.1: Existing Features
**Steps:**
1. Test car wash booking
2. Test bike wash booking
3. Test laundry booking
4. Test cart functionality
5. Test orders page
6. **Expected**: All work as before

#### Test 8.2: Other Admin Pages
**Steps:**
1. Test User Management
2. Test Employee Management
3. Test Coupons
4. Test Booking History
5. **Expected**: All work without issues

---

## Test Results Template

Use this format to report test results:

```
Test ID: [e.g., 2.1]
Test Name: [e.g., UI Elements Display]
Status: [PASS/FAIL]
Notes: [Any observations]
Issues Found: [List any bugs]
Environment: [Browser, OS]
Date Tested: [Date]
```

---

## Common Issues and Solutions

### Issue: Token expiration not working
**Solution**: Check JWT_SECRET is same on frontend and backend

### Issue: Admin page blank
**Solution**: Verify admin token is in localStorage, check browser console

### Issue: Address autocomplete not working
**Solution**: Check API key is configured, check network tab for errors

### Issue: Booking submission fails
**Solution**: Check backend logs, verify all required fields are sent

---

## Automation Testing (Future)

Consider adding:
1. Jest unit tests for components
2. Cypress E2E tests for user flows
3. API tests with Postman/Newman
4. Load testing with k6 or Artillery

---

**Last Updated**: December 5, 2025
**Version**: 1.0.0
