import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as cartApi from '../api/cart';

// Helper function to get default service images
const getDefaultServiceImage = (serviceName) => {
  if (!serviceName) return '/car/car1.png';
  
  const name = serviceName.toLowerCase();
  
  if (name.includes('car') || name.includes('vehicle')) {
    return '/car/car1.png';
  } else if (name.includes('bike') || name.includes('motorcycle') || name.includes('scooter')) {
    return '/bike/bike1.png';
  } else if (name.includes('helmet')) {
    return '/helmet/helmethome.png';
  } else if (name.includes('laundry') || name.includes('wash') || name.includes('clean')) {
    return '/laundry/laundry1.png';
  } else if (name.includes('green') || name.includes('home cleaning') || name.includes('sofa') || name.includes('carpet') || name.includes('bathroom') || name.includes('kitchen') || name.includes('office')) {
    return '/clean-home.jpg';
  }
  
  // Default fallback
  return '/car/car1.png';
};

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  // Derive a human-friendly category for items coming from server
  const deriveCategory = (rawItem) => {
    try {
      const svcName = (rawItem.serviceId?.name || rawItem.name || '').toLowerCase();
      const vt = (rawItem.vehicleType || '').toLowerCase();
      const kind = (rawItem.type || '').toLowerCase();
      const cat = (rawItem.category || '').toLowerCase();
      
      // Check for Green & Clean services
      if (kind.includes('green') || cat.includes('green') || /green.*clean|home.*clean|sofa.*clean|carpet.*clean|bathroom.*clean|kitchen.*clean|office.*clean/i.test(svcName)) {
        return 'Green & Clean';
      }
      
      if (kind.includes('accessory') || /accessor/.test(svcName)) return 'Car Accessories';
      if (kind.includes('helmet')) return 'Helmet';
      if (kind.includes('bike')) return 'Bike Wash';
      if (kind.includes('car') || kind.includes('monthly')) return 'Car Wash';
      if (['bike','commuter','cruiser','sports','scooter','motorbike'].includes(vt)) return 'Bike Wash';
      if (['car','hatchback','sedan','suv','luxury','luxuries'].includes(vt) || ['suv','sedan','hatchbacks','luxuries'].includes(cat)) return 'Car Wash';
      if (/(laundry|wash & fold|dry clean|ironing)/i.test(rawItem.serviceId?.name || rawItem.name || '')) return 'Laundry Service';
      // fallback by keywords
      if (/bike/i.test(svcName)) return 'Bike Wash';
      if (/car/i.test(svcName)) return 'Car Wash';
      return 'Service';
    } catch {
      return 'Service';
    }
  };


  console.log('🚀 CartProvider mounted for user:', user?.email || 'guest');
  
  // Add cleanup logging
  useEffect(() => {
    return () => {
      console.log('🗑️ CartProvider unmounting for user:', user?.email || 'guest');
      console.log('🛒 Cart items at unmount:', cartItems.map(item => ({id: item.id, name: item.name})));
    };
  }, [user?.email, cartItems]);

  // Sync localStorage cart to database
  const syncCartToDatabase = async () => {
    if (!user || !token || cartItems.length === 0) return;
    
    setLoading(true);
    try {
      console.log('🔄 Syncing cart to database:', cartItems.length, 'items');
      const response = await cartApi.syncCartToDatabase(token, cartItems);
      if (response.success) {
        console.log('✅ Cart synced successfully:', response.message);
        // Reload cart from server to get the synced data
        await loadCartFromServer();
      } else {
        console.error('❌ Failed to sync cart:', response.message);
      }
    } catch (error) {
      console.error('💥 Error syncing cart to database:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cart when user logs in or on component mount
  useEffect(() => {
    console.log('=== CART LOADING FOR USER ===');
    console.log('User:', user?.name, user?.email);
    
    if (user && token) {
      console.log('Loading cart for authenticated user');
      loadUserCart();
    } else {
      console.log('Loading guest cart');
      loadCartFromLocalStorage();
    }
    console.log('=== CART LOADING COMPLETE ===');
  }, [user, token]);

  const loadUserCart = async () => {
    if (!token || !user) return;
    
    setLoading(true);
    try {
      // Try to load from server first
      const response = await cartApi.getCart(token);
      if (response.success && response.data && response.data.items && response.data.items.length > 0) {
        // Convert backend cart format to frontend format
        const items = response.data.items || [];
        const formattedItems = items.map(item => ({
          id: item._id || item.serviceId,
          serviceId: item.serviceId,
          packageId: item.packageId,
          name: item.serviceName || item.name,
          serviceName: item.serviceName,
          packageName: item.packageName,
          price: item.price,
          quantity: item.quantity,
          addOns: item.addOns || [],
          vehicleType: item.vehicleType,
          specialInstructions: item.specialInstructions,
          // Add image handling
          img: item.image || item.img || item.serviceId?.image || getDefaultServiceImage(item.serviceName || item.name),
          image: item.image || item.img || item.serviceId?.image || getDefaultServiceImage(item.serviceName || item.name),
          // Add other properties as needed
          category: item.category || deriveCategory(item),
          description: item.description,
          packageDetails: item.packageDetails
        }));
        console.log('✅ Loaded cart from server:', formattedItems.length, 'items');
        setCartItems(formattedItems);
        
        // Also save to localStorage for backup
        const userCartKey = getUserCartKey(user);
        localStorage.setItem(userCartKey, JSON.stringify(formattedItems));
      } else {
        // No server cart, try localStorage
        console.log('No server cart found, checking localStorage...');
        loadUserSpecificCart();
        
        // If we found items in localStorage, sync them to server
        const userCartKey = getUserCartKey(user);
        const localCart = localStorage.getItem(userCartKey);
        if (localCart) {
          try {
            const localCartItems = JSON.parse(localCart);
            if (localCartItems.length > 0) {
              console.log('🔄 Found localStorage cart, syncing to database...');
              const syncResponse = await cartApi.syncCartToDatabase(token, localCartItems);
              if (syncResponse.success) {
                console.log('✅ localStorage cart synced to database');
                // Don't clear localStorage - keep it as backup
              }
            }
          } catch (error) {
            console.error('Error parsing localStorage cart:', error);
          }
        }
      }
    } catch (error) {
      console.error('💥 Error loading user cart:', error);
      // Fallback to localStorage
      loadUserSpecificCart();
    } finally {
      setLoading(false);
    }
  };

  const debugCartStorage = () => {
    console.log('🔍 === CART STORAGE DEBUG ===');
    console.log('👤 Current user:', user?.name, user?.email, user?._id);
    console.log('🛒 Current cartItems:', cartItems);
    
    // List all cart-related localStorage keys
    const allKeys = Object.keys(localStorage);
    const cartKeys = allKeys.filter(key => key.startsWith('bubbleFlashCart'));
    console.log('🗃️ All cart keys in localStorage:', cartKeys);
    
    cartKeys.forEach(key => {
      const data = localStorage.getItem(key);
      try {
        const parsed = JSON.parse(data);
        console.log(`📦 ${key}:`, parsed.length, 'items:', parsed.map(item => item.name));
      } catch {
        console.log(`📦 ${key}:`, data);
      }
    });
    console.log('🔍 === END DEBUG ===');
  };

  // Expose debug functions globally for testing
  useEffect(() => {
    window.debugCartStorage = debugCartStorage;
    window.clearAllCartData = clearAllCartData;
    window.clearSpecificUserCart = clearSpecificUserCart;
    window.forceResetCartState = forceResetCartState;
  }, [cartItems, user]);

  const getUserCartKey = (userData) => {
    if (!userData) return 'bubbleFlashCart';
    
    // Use email if available, otherwise use _id
    const identifier = userData.email || userData._id;
    const cartKey = `bubbleFlashCart_${identifier}`;
    
    // Enhanced debugging for cart key generation
    console.log('🔑 Cart key for user:', userData.name || 'Unknown', 'Email:', userData.email, 'Key:', cartKey);
    
    return cartKey;
  };

  const loadUserSpecificCart = () => {
    if (!user) {
      console.log('❌ No user, setting empty cart');
      setCartItems([]);
      return;
    }
    
    const userCartKey = getUserCartKey(user);
    const savedCart = localStorage.getItem(userCartKey);
    
    console.log('📥 Loading cart for user:', user.name, 'from key:', userCartKey);
    console.log('📦 Raw saved cart data:', savedCart);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('✅ Found saved cart for user:', user.name, 'Items count:', parsedCart.length);
        console.log('📋 Cart items:', parsedCart.map(item => ({id: item.id, name: item.name, quantity: item.quantity})));
        setCartItems(parsedCart);
      } catch (error) {
        console.error('❌ Error parsing user cart:', error);
        setCartItems([]);
      }
    } else {
      console.log('🚫 No saved cart found for user:', user.name);
      // Check for guest cart to migrate only if user has no cart
      migrateGuestCart();
    }
  };

  const migrateGuestCart = () => {
    const guestCart = localStorage.getItem('bubbleFlashCart');
    if (guestCart && user) {
      try {
        const guestItems = JSON.parse(guestCart);
        if (guestItems.length > 0) {
          console.log('Migrating guest cart to user:', user.name, 'Items:', guestItems);
          setCartItems(guestItems);
          // Save to user-specific cart
          const userCartKey = getUserCartKey(user);
          localStorage.setItem(userCartKey, guestCart);
          console.log('Guest cart migrated to:', userCartKey);
          // Clear guest cart after migration
          localStorage.removeItem('bubbleFlashCart');
        } else {
          // No guest cart items, start with empty cart
          console.log('No guest cart items to migrate, starting with empty cart');
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error migrating guest cart:', error);
        setCartItems([]);
      }
    } else {
      // No guest cart to migrate, start with empty cart
      console.log('No guest cart to migrate for user:', user.name);
      setCartItems([]);
    }
  };

  const loadCartFromServer = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await cartApi.getCart(token);
      if (response.success && response.data) {
        // Convert backend cart format to frontend format
        const items = response.data.items || [];
        setCartItems(items.map(item => {
          // Normalize add-ons with names
          const normalizedAddOns = (item.addOns || []).map(a => ({
            addOnId: a.addOnId?._id || a.addOnId,
            name: a.addOnId?.name || a.name,
            price: a.price,
            quantity: a.quantity || 1
          }));
          const uiAddOns = (item.uiAddOns || []).map(u => ({
            name: u.name,
            price: u.price,
            quantity: u.quantity || 1
          }));
          const derivedPackageDetails = item.packageDetails || (item.packageId ? {
            basePrice: item.price,
            features: item.packageId?.features || [],
            addons: normalizedAddOns.length ? normalizedAddOns : undefined
          } : undefined);

          return {
            id: item._id || item.serviceId,
            serviceId: item.serviceId,
            packageId: item.packageId?._id || item.packageId,
            name: item.serviceName || item.name || item.serviceId?.name,
            serviceName: item.serviceName || item.name || item.serviceId?.name,
            packageName: item.packageName || item.packageId?.name,
            price: item.price,
            quantity: item.quantity,
            addOns: normalizedAddOns,
            uiAddOns,
            packageDetails: derivedPackageDetails,
            includedFeatures: item.includedFeatures || derivedPackageDetails?.features || [],
            vehicleType: item.vehicleType,
            specialInstructions: item.specialInstructions,
            // Prefer stored image over populated fallback image
            img: item.image || item.img || item.serviceId?.image || getDefaultServiceImage(item.serviceName || item.name || item.serviceId?.name),
            image: item.image || item.img || item.serviceId?.image || getDefaultServiceImage(item.serviceName || item.name || item.serviceId?.name),
            category: item.category || deriveCategory(item)
          };
        }));
      }
    } catch (error) {
      console.error('Error loading cart from server:', error);
      // Fallback to localStorage
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('bubbleFlashCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartItems([]);
      }
    }
  };

  const clearSpecificUserCart = (email) => {
    const cartKey = `bubbleFlashCart_${email}`;
    console.log('Clearing cart for specific user:', email, 'Key:', cartKey);
    localStorage.removeItem(cartKey);
    
    // If it's the current user, also clear the state
    if (user && user.email === email) {
      console.log('Clearing state for current user');
      setCartItems([]);
    }
  };

  const forceResetCartState = () => {
    console.log('FORCE RESETTING CART STATE');
    setCartItems([]);
    // Reload cart after reset
    setTimeout(() => {
      if (user && token) {
        loadUserSpecificCart();
      } else {
        loadCartFromLocalStorage();
      }
    }, 100);
  };

  const clearAllCartData = () => {
    console.log('Clearing ALL cart data from localStorage');
    const allKeys = Object.keys(localStorage);
    const cartKeys = allKeys.filter(key => key.startsWith('bubbleFlashCart'));
    cartKeys.forEach(key => {
      console.log('Removing:', key);
      localStorage.removeItem(key);
    });
    setCartItems([]);
    console.log('All cart data cleared');
  };

  // Save cart to localStorage (user-specific for logged-in users, general for guests)
  useEffect(() => {
    console.log('💾 === SAVE EFFECT TRIGGERED ===');
    console.log('👤 User:', user?.name, user?.email);
    console.log('🛒 CartItems length:', cartItems.length);
    console.log('📋 CartItems:', cartItems.map(item => ({id: item.id, name: item.name, quantity: item.quantity})));
    
    if (cartItems.length > 0) {
      if (user) {
        // Save to user-specific cart using email-based key
        const userCartKey = getUserCartKey(user);
        console.log('💾 SAVING cart for user:', user.name, 'to key:', userCartKey);
        const cartData = JSON.stringify(cartItems);
        localStorage.setItem(userCartKey, cartData);
        console.log('✅ Cart saved to:', userCartKey);
        console.log('💾 Saved data:', cartData);
        
        // Verify save worked
        const verification = localStorage.getItem(userCartKey);
        console.log('🔍 Verification - saved data retrieved:', verification ? 'SUCCESS' : 'FAILED');
      } else {
        // Save to general cart for guests
        console.log('💾 Saving guest cart');
        localStorage.setItem('bubbleFlashCart', JSON.stringify(cartItems));
      }
    }
    console.log('💾 === SAVE EFFECT COMPLETE ===');
  }, [cartItems, user]);

  const addToCart = async (product) => {
    // Try server cart first for logged-in users
    if (user && token) {
      setLoading(true);
      try {
        // Only send valid addOns with a proper MongoDB ObjectId as addOnId
        const sanitizeAddOns = (arr) => {
          const list = Array.isArray(arr) ? arr : [];
          return list.filter(a => typeof a?.addOnId === 'string' && /^[0-9a-fA-F]{24}$/.test(a.addOnId)).map(a => ({
            addOnId: a.addOnId,
            quantity: a.quantity || 1,
            // Price is looked up on server; include if present, it's ignored otherwise
            ...(a.price ? { price: a.price } : {})
          }));
        };

        const onlyValidObjectId = (v) => (typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)) ? v : undefined;
        const cartData = {
          serviceId: product.serviceId || product.id,
          serviceName: product.serviceName || product.name, // Prefer explicit serviceName
          packageName: product.packageName || product.plan,
          packageId: onlyValidObjectId(product.packageId) ? product.packageId : undefined,
          quantity: 1,
          price: product.price,
          addOns: sanitizeAddOns(product.addOns || product.packageDetails?.addons),
          // Also send UI-only add-ons (no DB id) so server can store and we can display
          uiAddOns: (product.uiAddOns || product.packageDetails?.addons || [])
            .filter(a => !a.addOnId) // only UI entries
            .map(a => ({ name: a.name, price: a.price, quantity: a.quantity || 1 })),
          packageDetails: product.packageDetails, // carry features/addons/basePrice/monthly fields
          includedFeatures: product.includedFeatures || product.packageDetails?.features || [],
          vehicleType: product.vehicleType,
          specialInstructions: product.specialInstructions,
          type: product.type,
          category: product.category,
          image: product.image || product.img
        };
        
        const response = await cartApi.addToCart(token, cartData);
        if (response.success) {
          // Reload cart from server to get updated data
          await loadCartFromServer();
        } else {
          throw new Error(response.message || 'Failed to add to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local cart
        addToLocalCart(product);
      } finally {
        setLoading(false);
      }
    } else {
      // Add to local cart for guest users
      addToLocalCart(product);
    }
  };

  const addToLocalCart = (product) => {
    console.log('=== ADD TO LOCAL CART ===');
    console.log('Current user:', user?.name, user?.email);
    console.log('Product being added:', {id: product.id, name: product.name});
    console.log('Current cart before adding:', cartItems.map(item => ({id: item.id, name: item.name})));
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        console.log('Item exists, increasing quantity');
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new item, add to cart with quantity 1
        console.log('New item, adding to cart');
        return [...prevItems, { ...product, quantity: 1, id: product.id || Date.now() }];
      }
    });
    console.log('=== ADD TO LOCAL CART COMPLETE ===');
  };

  const removeFromCart = async (productId) => {
    if (user && token) {
      // Remove from server for logged-in users
      setLoading(true);
      try {
        const response = await cartApi.removeFromCart(token, productId);
        if (response.success) {
          await loadCartFromServer();
        } else {
          throw new Error(response.message || 'Failed to remove from cart');
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        // Fallback to local removal
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      } finally {
        setLoading(false);
      }
    } else {
      // Remove from local cart for guest users
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (user && token) {
      // Update on server for logged-in users
      setLoading(true);
      try {
        const response = await cartApi.updateCartItem(token, productId, { quantity: newQuantity });
        if (response.success) {
          await loadCartFromServer();
        } else {
          throw new Error(response.message || 'Failed to update cart');
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        // Fallback to local update
        updateLocalQuantity(productId, newQuantity);
      } finally {
        setLoading(false);
      }
    } else {
      // Update local cart for guest users
      updateLocalQuantity(productId, newQuantity);
    }
  };

  const updateLocalQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = async () => {
    // Clear local cart
    setCartItems([]);
    
    // Clear from localStorage
    if (user) {
      const userCartKey = getUserCartKey(user);
      console.log('Clearing cart for user:', user.name, 'key:', userCartKey);
      localStorage.removeItem(userCartKey);
    } else {
      console.log('Clearing guest cart');
      localStorage.removeItem('bubbleFlashCart');
    }
    
    if (user && token) {
      // Clear server cart for logged-in users
      setLoading(true);
      try {
        const response = await cartApi.clearCart(token);
        if (!response.success) {
          console.error('Failed to clear server cart:', response.message);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };



  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    syncCartToDatabase
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
