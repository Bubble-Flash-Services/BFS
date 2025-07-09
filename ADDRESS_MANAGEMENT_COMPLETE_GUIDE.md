# Complete Address Management System - Line by Line Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Database Layer (MongoDB Model)](#database-layer)
3. [Backend Service Layer](#backend-service-layer)
4. [Backend Controller Layer](#backend-controller-layer)
5. [Backend Routes Layer](#backend-routes-layer)
6. [Frontend API Layer](#frontend-api-layer)
7. [Frontend Components](#frontend-components)
8. [Frontend Pages](#frontend-pages)
9. [Complete Data Flow](#complete-data-flow)
10. [ER Diagram](#er-diagram)

---

## System Overview

The address management system allows users to:
- Add, edit, delete, and view saved addresses
- Set default addresses
- Use autocomplete with real-time address suggestions
- Detect current location via GPS
- Manage addresses in their profile

**Technology Stack:**
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, React Router, Lucide React Icons
- **APIs**: OpenCage Geocoding API, Nominatim (OpenStreetMap)
- **Database**: MongoDB with Mongoose ODM

---

## Database Layer (MongoDB Model)

**File: `server/models/Address.js`**

```javascript
import mongoose from 'mongoose';
```
- **Line 1**: Import Mongoose ODM library for MongoDB interaction
- **Purpose**: Provides object modeling and schema validation for MongoDB

```javascript
const addressSchema = new mongoose.Schema({
```
- **Line 3**: Create new Mongoose schema object
- **Purpose**: Defines structure, validation rules, and behavior for Address documents

```javascript
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
```
- **userId**: Foreign key reference to User collection
- **type**: ObjectId data type (MongoDB's unique identifier)
- **ref**: References the 'User' model for population
- **required**: Field is mandatory for all documents

```javascript
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
```
- **type**: Address category field
- **String**: Text data type
- **enum**: Restricts values to only 'home', 'work', or 'other'
- **default**: Sets 'home' as default value if not specified

```javascript
  fullAddress: {
    type: String,
    required: true
  },
```
- **fullAddress**: Complete address text
- **String**: Text data type for address description
- **required**: Mandatory field for all addresses

```javascript
  latitude: {
    type: Number,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180
  },
```
- **latitude/longitude**: GPS coordinates
- **Number**: Decimal data type for precise coordinates
- **min/max**: Validation constraints for valid Earth coordinates
- **Optional**: Not required, allows addresses without GPS data

```javascript
  city: {
    type: String,
    maxlength: 100
  },
  state: {
    type: String,
    maxlength: 100
  },
  pincode: {
    type: String,
    maxlength: 10
  },
```
- **city/state/pincode**: Address components
- **String**: Text data type
- **maxlength**: Prevents excessively long entries
- **Optional**: Not required but recommended for better organization

```javascript
  landmark: {
    type: String,
    maxlength: 255
  },
```
- **landmark**: Nearby reference point
- **String**: Text data type
- **maxlength**: Limits to 255 characters
- **Optional**: User can provide for easier location identification

```javascript
  isDefault: {
    type: Boolean,
    default: false
  }
```
- **isDefault**: Flags primary address for user
- **Boolean**: True/false value
- **default**: Sets false by default (not primary address)

```javascript
}, {
  timestamps: true
});
```
- **timestamps**: Mongoose option
- **Purpose**: Automatically adds createdAt and updatedAt fields
- **Behavior**: Updates timestamps on document creation and modification

```javascript
addressSchema.pre('save', async function(next) {
```
- **pre('save')**: Mongoose middleware hook
- **Purpose**: Executes before document is saved to database
- **async function**: Asynchronous function for database operations
- **next**: Callback to continue save operation

```javascript
  if (this.isDefault) {
```
- **this.isDefault**: Checks if current document is being set as default
- **this**: Refers to the document being saved
- **Condition**: Only executes if address is marked as default

```javascript
    await mongoose.model('Address').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
```
- **updateMany**: Bulk update operation on Address collection
- **Query**: Finds all addresses for same user except current document
- **{ userId: this.userId }**: Matches same user
- **{ _id: { $ne: this._id } }**: Excludes current document ($ne = not equal)
- **{ isDefault: false }**: Sets all other addresses as non-default
- **Purpose**: Ensures only one default address per user

```javascript
  next();
```
- **next()**: Continues with save operation
- **Purpose**: Required to complete middleware execution

```javascript
export default mongoose.model('Address', addressSchema);
```
- **mongoose.model**: Creates model from schema
- **'Address'**: Model name (creates 'addresses' collection)
- **addressSchema**: Schema definition to use
- **export default**: Makes model available for import in other files

---

## Backend Service Layer

**File: `server/services/addressService.js`**

```javascript
class AddressService {
```
- **class**: ES6 class declaration
- **AddressService**: Service layer for address-related operations
- **Purpose**: Centralizes business logic and external API calls

```javascript
  constructor() {
    this.openCageApiKey = process.env.OPENCAGE_API_KEY;
    this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
  }
```
- **constructor**: Class initialization method
- **this.openCageApiKey**: Stores API key from environment variables
- **process.env.OPENCAGE_API_KEY**: Reads from .env file
- **this.nominatimBaseUrl**: Fallback API endpoint
- **Purpose**: Sets up API configurations for geocoding services

```javascript
  async reverseGeocode(latitude, longitude) {
```
- **async**: Asynchronous method declaration
- **reverseGeocode**: Converts coordinates to human-readable address
- **Parameters**: latitude and longitude coordinates

```javascript
    try {
      if (this.openCageApiKey) {
        return await this.reverseGeocodeOpenCage(latitude, longitude);
      } else {
        return await this.reverseGeocodeNominatim(latitude, longitude);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
```
- **try-catch**: Error handling block
- **Conditional**: Uses OpenCage if API key available, otherwise Nominatim
- **await**: Waits for async operation completion
- **throw error**: Re-throws error for caller to handle

```javascript
  async reverseGeocodeOpenCage(latitude, longitude) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${this.openCageApiKey}&limit=1`;
```
- **Template literal**: Constructs API URL with parameters
- **q=${latitude}+${longitude}**: Query parameter with coordinates
- **key=${this.openCageApiKey}**: Authentication parameter
- **limit=1**: Restricts to single result

```javascript
    const response = await fetch(url);
    const data = await response.json();
```
- **fetch**: HTTP request to external API
- **await**: Waits for response
- **response.json()**: Parses JSON response body

```javascript
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        formatted_address: result.formatted,
        city: result.components.city || result.components.town || result.components.village,
        state: result.components.state,
        postcode: result.components.postcode,
        latitude: result.geometry.lat,
        longitude: result.geometry.lng
      };
    }
```
- **Validation**: Checks if API returned results
- **data.results[0]**: Gets first result from array
- **Object destructuring**: Extracts relevant fields from API response
- **Fallback values**: Uses town/village if city not available
- **Return**: Standardized address object

```javascript
  async searchAddresses(query, limit = 5) {
```
- **searchAddresses**: Method for address search functionality
- **query**: Search text from user
- **limit = 5**: Default limit with parameter default value

```javascript
    if (!query || query.trim().length < 2) {
      return [];
    }
```
- **Validation**: Ensures query exists and has minimum length
- **query.trim()**: Removes whitespace
- **Early return**: Returns empty array for invalid queries

```javascript
    const encodedQuery = encodeURIComponent(query.trim());
```
- **encodeURIComponent**: URL-encodes query for safe HTTP transmission
- **Purpose**: Handles special characters in search terms

```javascript
    if (this.openCageApiKey) {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${this.openCageApiKey}&limit=${limit}&countrycode=in`;
      // ... API call logic
    }
```
- **Conditional API selection**: Uses OpenCage if available
- **countrycode=in**: Restricts results to India
- **URL construction**: Builds complete API endpoint

---

## Backend Controller Layer

**File: `server/controllers/addressController.js`**

```javascript
import Address from '../models/Address.js';
import { addressService } from '../services/addressService.js';
```
- **Import statements**: Brings in dependencies
- **Address**: Mongoose model for database operations
- **addressService**: Business logic layer for geocoding

```javascript
export const getUserAddresses = async (req, res) => {
```
- **export const**: Named export for route handler
- **async**: Asynchronous function for database operations
- **req, res**: Express.js request and response objects

```javascript
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
```
- **Address.find()**: Mongoose query to find documents
- **{ userId: req.user.id }**: Filter by current user's ID
- **req.user.id**: User ID from authentication middleware
- **sort()**: Orders results
- **{ isDefault: -1 }**: Default addresses first (-1 = descending)
- **{ createdAt: -1 }**: Then by creation date (newest first)

```javascript
    res.json({
      success: true,
      data: addresses
    });
```
- **res.json()**: Sends JSON response to client
- **success: true**: Indicates successful operation
- **data: addresses**: Includes retrieved addresses

```javascript
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
```
- **catch block**: Handles any errors
- **console.error**: Logs error for debugging
- **res.status(500)**: Sets HTTP status to 500 (Internal Server Error)
- **error.message**: Includes error details in response

```javascript
export const addAddress = async (req, res) => {
  try {
    const { type, fullAddress, latitude, longitude, city, state, pincode, landmark, isDefault } = req.body;
```
- **Object destructuring**: Extracts fields from request body
- **req.body**: Contains data sent by client
- **Individual fields**: Each property from the address form

```javascript
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }
```
- **Conditional logic**: If new address is default
- **updateMany**: Bulk update operation
- **{ userId: req.user.id }**: Filter by current user
- **{ isDefault: false }**: Sets all user addresses as non-default
- **Purpose**: Ensures only one default address

```javascript
    const address = new Address({
      userId: req.user.id,
      type: type || 'home',
      fullAddress,
      latitude,
      longitude,
      city,
      state,
      pincode,
      landmark,
      isDefault: isDefault || false
    });
```
- **new Address()**: Creates new document instance
- **userId**: Associates with current user
- **type || 'home'**: Uses provided type or defaults to 'home'
- **Other fields**: Direct assignment from request
- **isDefault || false**: Defaults to false if not specified

```javascript
    await address.save();
```
- **save()**: Persists document to database
- **await**: Waits for save completion
- **Triggers**: Pre-save middleware for default address logic

```javascript
export const reverseGeocode = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
```
- **Input validation**: Checks required parameters
- **Early return**: Exits if validation fails
- **status(400)**: Bad Request HTTP status
- **Clear error message**: Informs client of missing data

```javascript
    const addressData = await addressService.reverseGeocode(latitude, longitude);
```
- **Service call**: Delegates to business logic layer
- **await**: Waits for geocoding completion
- **Separation of concerns**: Controller handles HTTP, service handles business logic

---

## Backend Routes Layer

**File: `server/routes/addresses.js`**

```javascript
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as addressController from '../controllers/addressController.js';
```
- **express**: Web framework for routing
- **authenticateToken**: Middleware for user authentication
- **addressController**: All controller functions via namespace import

```javascript
const router = express.Router();
```
- **express.Router()**: Creates modular route handler
- **Purpose**: Groups related routes together

```javascript
// Public routes (no authentication required)
router.post('/reverse-geocode', addressController.reverseGeocode);
router.get('/search', addressController.searchAddresses);
router.get('/suggestions', addressController.getAddressSuggestions);
```
- **Public routes**: No authentication middleware
- **POST /reverse-geocode**: Converts coordinates to address
- **GET /search**: Searches addresses by query
- **GET /suggestions**: Provides autocomplete suggestions
- **addressController.method**: Maps to controller functions

```javascript
// Protected routes (authentication required)
router.get('/', authenticateToken, addressController.getUserAddresses);
router.post('/', authenticateToken, addressController.addAddress);
router.put('/:addressId', authenticateToken, addressController.updateAddress);
router.delete('/:addressId', authenticateToken, addressController.deleteAddress);
router.patch('/:addressId/default', authenticateToken, addressController.setDefaultAddress);
router.get('/:addressId', authenticateToken, addressController.getAddressById);
```
- **Protected routes**: Require authentication
- **authenticateToken**: Middleware runs before controller
- **Route parameters**: `:addressId` captures URL parameter
- **HTTP methods**: GET, POST, PUT, DELETE, PATCH for CRUD operations
- **RESTful design**: Standard HTTP methods for operations

```javascript
export default router;
```
- **export default**: Makes router available for import
- **Purpose**: Allows app.js to mount these routes

---

## Frontend API Layer

**File: `src/api/address.js`**

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```
- **import.meta.env**: Vite's environment variable access
- **VITE_API_URL**: Environment variable for API endpoint
- **Fallback**: Uses localhost if env var not set
- **Purpose**: Configurable API endpoint for different environments

```javascript
class AddressAPI {
  constructor() {
    this.baseURL = `${API_BASE_URL}/addresses`;
  }
```
- **Class constructor**: Initializes API helper
- **this.baseURL**: Stores complete API endpoint
- **Template literal**: Combines base URL with addresses path

```javascript
  async getCurrentAddress() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
```
- **Promise wrapper**: Wraps geolocation API in Promise
- **navigator.geolocation**: Browser geolocation API
- **Feature detection**: Checks if geolocation is available
- **Early return**: Exits if feature not supported

```javascript
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await this.reverseGeocode(latitude, longitude);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
```
- **getCurrentPosition**: Browser API for GPS location
- **Success callback**: Async function for successful location
- **position.coords**: Contains latitude/longitude
- **this.reverseGeocode**: Calls class method for address lookup
- **Error callback**: Handles geolocation errors
- **Options object**: GPS configuration
- **enableHighAccuracy**: Requests precise location
- **timeout**: 10 second limit
- **maximumAge**: Cache location for 5 minutes

```javascript
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(`${this.baseURL}/reverse-geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude, longitude })
      });
```
- **fetch**: Modern HTTP client
- **Template literal**: Constructs full URL
- **POST method**: Sends data in request body
- **Headers**: Specifies JSON content type
- **JSON.stringify**: Converts object to JSON string
- **Object shorthand**: { latitude, longitude } instead of { latitude: latitude, longitude: longitude }

```javascript
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
```
- **response.ok**: Checks if HTTP status indicates success
- **Error throwing**: Creates descriptive error message
- **Template literal**: Includes status code in error
- **response.json()**: Parses response body as JSON
- **Return**: Passes data to caller

```javascript
  async getUserAddresses(token) {
    try {
      const response = await fetch(this.baseURL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
```
- **Authorization header**: Sends JWT token for authentication
- **Bearer token**: Standard format for JWT authentication
- **Template literal**: Includes token in header value
- **GET request**: Default method for fetch (no method specified)

```javascript
  async addAddress(addressData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });
```
- **localStorage.getItem**: Retrieves stored JWT token
- **POST method**: Creates new resource
- **Authorization**: Includes token for authentication
- **JSON.stringify**: Converts address object to JSON
- **addressData**: Complete address information from form

---

## Frontend Components

**File: `src/components/AddressAutocomplete.jsx`**

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X, Loader } from 'lucide-react';
import { addressAPI } from '../api/address';
```
- **React hooks**: useState, useEffect, useRef for component state
- **Lucide icons**: Pre-built SVG icons for UI
- **addressAPI**: Import API helper for address operations

```javascript
const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Enter address...", 
  showCurrentLocation = false,
  className = "",
  debounceMs = 300
}) => {
```
- **Functional component**: React component with props destructuring
- **value**: Current input value (controlled component)
- **onChange**: Callback when input changes
- **onSelect**: Callback when user selects suggestion
- **Default parameters**: Provides fallback values
- **showCurrentLocation**: Toggle for GPS button
- **debounceMs**: Delay for search requests

```javascript
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [gettingLocation, setGettingLocation] = useState(false);
```
- **useState hooks**: Component state management
- **suggestions**: Array of address suggestions
- **showSuggestions**: Boolean to control dropdown visibility
- **loading**: Loading state for search requests
- **selectedIndex**: Currently highlighted suggestion (keyboard navigation)
- **gettingLocation**: Loading state for GPS detection

```javascript
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
```
- **useRef hooks**: References to DOM elements and timers
- **debounceRef**: Stores timeout ID for debouncing
- **inputRef**: Reference to input element
- **dropdownRef**: Reference to suggestions dropdown

```javascript
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
```
- **useEffect**: Side effect for click outside detection
- **handleClickOutside**: Event handler function
- **dropdownRef.current**: Current DOM element reference
- **contains()**: Checks if clicked element is inside dropdown
- **Purpose**: Closes dropdown when clicking elsewhere

```javascript
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
```
- **addEventListener**: Registers global click listener
- **Cleanup function**: Returned function removes listener
- **Purpose**: Prevents memory leaks

```javascript
  const debouncedSearch = async (query) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
```
- **Debouncing**: Delays search until user stops typing
- **clearTimeout**: Cancels previous timer if exists
- **Purpose**: Reduces API calls and improves performance

```javascript
    debounceRef.current = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const results = await addressAPI.searchAddresses(query);
          setSuggestions(results.data || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, debounceMs);
```
- **setTimeout**: Creates delayed execution
- **Minimum length**: Only searches if 2+ characters
- **setLoading(true)**: Shows loading indicator
- **API call**: Searches for addresses
- **Error handling**: Catches and logs errors
- **finally block**: Always executes to hide loading

```javascript
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedIndex(-1);
    debouncedSearch(newValue);
  };
```
- **Event handler**: Handles input value changes
- **e.target.value**: New input value
- **onChange**: Notifies parent component
- **setSelectedIndex(-1)**: Resets keyboard selection
- **debouncedSearch**: Triggers search with delay

```javascript
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
```
- **Keyboard navigation**: Handles arrow key navigation
- **e.preventDefault()**: Prevents default browser behavior
- **Arrow Down**: Moves selection down
- **Circular navigation**: Wraps to top when at bottom
- **prev**: Previous state value in setter function

```javascript
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
```
- **Arrow Up**: Moves selection up
- **Circular navigation**: Wraps to bottom when at top

```javascript
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
```
- **Enter key**: Selects highlighted suggestion
- **selectedIndex check**: Ensures valid selection
- **handleSuggestionClick**: Reuses selection logic

```javascript
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
```
- **Escape key**: Closes suggestions and removes focus
- **Optional chaining**: ?. safely calls blur if ref exists

---

## Frontend Pages

**File: `src/pages/AddressesPage.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
```
- **React hooks**: Core hooks for state and lifecycle
- **useAuth**: Custom hook for authentication context
- **useNavigate**: React Router hook for programmatic navigation

```javascript
export default function AddressesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
```
- **useAuth destructuring**: Gets user and loading state
- **useNavigate**: Gets navigation function

```javascript
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
```
- **Component state**: Multiple state variables for UI control
- **addresses**: Array of user's saved addresses
- **loadingAddresses**: Loading state for address fetch
- **showAddForm**: Controls modal visibility
- **editingAddress**: Stores address being edited (null for new)

```javascript
  const [formData, setFormData] = useState({
    type: 'home',
    fullAddress: '',
    latitude: null,
    longitude: null,
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });
```
- **Form state**: Object matching database schema
- **Default values**: Provides initial form state
- **Controlled components**: All form inputs controlled by this state

```javascript
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }
    
    if (user) {
      fetchAddresses();
    }
  }, [user, loading, navigate]);
```
- **Authentication guard**: Redirects if not logged in
- **Dependency array**: Re-runs when user, loading, or navigate changes
- **Early return**: Prevents execution if redirecting
- **fetchAddresses**: Loads user's addresses when authenticated

```javascript
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await addressAPI.getUserAddresses(token);
      
      if (response.success && Array.isArray(response.data)) {
        setAddresses(response.data);
      } else {
        console.error('Invalid response format:', response);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };
```
- **API call**: Fetches user's saved addresses
- **Token retrieval**: Gets JWT from localStorage
- **Response validation**: Checks for success and array data
- **Error handling**: Logs errors and sets empty array
- **finally block**: Always stops loading state

```javascript
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullAddress.trim()) newErrors.fullAddress = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
```
- **Form validation**: Checks required fields and formats
- **newErrors object**: Collects all validation errors
- **trim()**: Removes whitespace for validation
- **Regular expression**: /^\d{6}$/ matches exactly 6 digits
- **setErrors**: Updates error state for UI display
- **Return boolean**: True if form is valid

```javascript
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      let response;
      if (editingAddress) {
        response = await addressAPI.updateAddress(editingAddress._id, formData);
      } else {
        response = await addressAPI.addAddress(formData);
      }
      
      if (response.success) {
        await fetchAddresses();
        handleCancel();
      } else {
        console.error('Error saving address:', response.message);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setSaving(false);
    }
  };
```
- **Form submission**: Handles form submit event
- **e.preventDefault()**: Prevents default form submission
- **Validation check**: Exits early if form invalid
- **setSaving(true)**: Shows saving state in UI
- **Conditional API call**: Update if editing, add if new
- **Success handling**: Refreshes list and closes form
- **Error handling**: Logs errors for debugging

```javascript
  const handleAddressSelect = (selectedAddress) => {
    setFormData(prev => ({
      ...prev,
      fullAddress: selectedAddress.formatted_address || selectedAddress.display_name || '',
      city: selectedAddress.city || selectedAddress.town || selectedAddress.village || '',
      state: selectedAddress.state || selectedAddress.state_district || '',
      pincode: selectedAddress.postcode || '',
      latitude: selectedAddress.lat || selectedAddress.latitude || null,
      longitude: selectedAddress.lon || selectedAddress.longitude || null
    }));
  };
```
- **Address selection**: Handles autocomplete selection
- **Spread operator**: Preserves existing form data
- **Fallback values**: Uses || operator for multiple possible field names
- **API compatibility**: Handles different response formats from geocoding APIs

---

## Complete Data Flow

### 1. User Authentication Flow
```
User Login → JWT Token → localStorage → API Headers → Backend Verification → User Context
```

### 2. Address List Loading Flow
```
Page Load → useEffect → fetchAddresses() → API Call → Database Query → Response → UI Update
```

### 3. Add New Address Flow
```
Click "Add Address" → Show Form → User Input → Autocomplete Search → Select Address → 
Form Validation → API Call → Database Insert → Refresh List → Close Form
```

### 4. Address Autocomplete Flow
```
User Types → Debounced Search → API Call → Geocoding Service → Format Results → 
Show Suggestions → User Selection → Form Auto-fill
```

### 5. Set Default Address Flow
```
Click "Set Default" → API Call → Database Update (Unset Others) → Database Update (Set New) → 
Refresh List → UI Update
```

### 6. Delete Address Flow
```
Click Delete → Confirmation Dialog → API Call → Database Delete → Check Default → 
Auto-set New Default (if needed) → Refresh List → UI Update
```

### 7. GPS Location Flow
```
Click Location Button → Browser Geolocation API → GPS Coordinates → Reverse Geocoding API → 
Formatted Address → Auto-fill Form
```

---

## ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ADDRESS MANAGEMENT SYSTEM                        │
│                                                                             │
│  ┌─────────────┐                    ┌──────────────────────────────────────┐ │
│  │    USER     │                    │             ADDRESS                  │ │
│  │─────────────│                    │──────────────────────────────────────│ │
│  │ _id (PK)    │ 1                  │ _id (PK)                             │ │
│  │ email       │─────────────────── * │ userId (FK) → User._id               │ │
│  │ password    │                    │ type (enum: home/work/other)         │ │
│  │ name        │                    │ fullAddress (String, required)       │ │
│  │ phone       │                    │ latitude (Number, optional)          │ │
│  │ createdAt   │                    │ longitude (Number, optional)         │ │
│  │ updatedAt   │                    │ city (String, optional)              │ │
│  └─────────────┘                    │ state (String, optional)             │ │
│                                     │ pincode (String, optional)           │ │
│                                     │ landmark (String, optional)          │ │
│                                     │ isDefault (Boolean, default: false)  │ │
│                                     │ createdAt (auto)                     │ │
│                                     │ updatedAt (auto)                     │ │
│                                     └──────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                          EXTERNAL APIS                                 │ │
│  │─────────────────────────────────────────────────────────────────────────│ │
│  │                                                                         │ │
│  │  ┌─────────────────┐              ┌─────────────────────────────────┐    │ │
│  │  │   OPENCAGE API  │              │        NOMINATIM API            │    │ │
│  │  │─────────────────│              │─────────────────────────────────│    │ │
│  │  │ Geocoding       │              │ Geocoding (Fallback)            │    │ │
│  │  │ Reverse Geo     │              │ Reverse Geo (Fallback)          │    │ │
│  │  │ Address Search  │              │ Address Search (Fallback)       │    │ │
│  │  │ Autocomplete    │              │ Autocomplete (Fallback)         │    │ │
│  │  └─────────────────┘              └─────────────────────────────────┘    │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                           SYSTEM LAYERS                                │ │
│  │─────────────────────────────────────────────────────────────────────────│ │
│  │                                                                         │ │
│  │  Frontend (React)           Backend (Node.js)          Database         │ │
│  │  ┌─────────────────┐      ┌─────────────────────┐     ┌─────────────┐   │ │
│  │  │ AddressesPage   │ ──── │ Routes (/addresses) │ ─── │ MongoDB     │   │ │
│  │  │ AddressAutocomp │      │ Controllers         │     │ Collections │   │ │
│  │  │ API Helper      │      │ Services            │     │ - users     │   │ │
│  │  │ AuthContext     │      │ Models (Mongoose)   │     │ - addresses │   │ │
│  │  └─────────────────┘      │ Middleware (Auth)   │     └─────────────┘   │ │
│  │                           └─────────────────────┘                       │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                          DATA FLOW DIAGRAM                             │ │
│  │─────────────────────────────────────────────────────────────────────────│ │
│  │                                                                         │ │
│  │  User Input → Component State → API Call → Route Handler →             │ │
│  │  Controller → Service (if needed) → Database → Response →              │ │
│  │  Component Update → UI Render                                          │ │
│  │                                                                         │ │
│  │  Special Flows:                                                        │ │
│  │  • GPS Location: Browser API → Coordinates → Reverse Geocoding →       │ │
│  │    Formatted Address → Form Auto-fill                                  │ │
│  │                                                                         │ │
│  │  • Autocomplete: User Input → Debounced Search → Geocoding API →       │ │
│  │    Suggestions → User Selection → Form Update                          │ │
│  │                                                                         │ │
│  │  • Default Address: Set Request → Unset All Others → Set New →         │ │
│  │    Database Constraint Validation → Response                           │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Relationship Details:
- **One-to-Many**: One User can have multiple Addresses
- **Foreign Key**: Address.userId references User._id
- **Default Constraint**: Only one address per user can be default (enforced by pre-save middleware)
- **Authentication**: JWT token required for all address operations
- **Geocoding**: External APIs provide address search and coordinate conversion

### Key Business Rules:
1. Each user can have multiple addresses
2. Only one address per user can be marked as default
3. When setting a new default, all other user addresses become non-default automatically
4. Addresses can be of three types: home, work, or other
5. GPS coordinates are optional but recommended for better service delivery
6. Full address text is required, other fields are optional but recommended

This completes the comprehensive line-by-line explanation of the entire address management system!
