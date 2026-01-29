/**
 * Capacitor Native Features Service
 * Push Notifications and Secure Storage for BFS App
 */
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

/**
 * Push Notifications Service
 */
export class NotificationService {
  static isNative = Capacitor.isNativePlatform();

  /**
   * Initialize push notifications
   * Call this on app startup
   */
  static async initialize() {
    if (!this.isNative) {
      console.log('Push notifications only available on native platforms');
      return;
    }

    try {
      // Request permission
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('Push notification permission not granted');
        return;
      }

      // Register with FCM (Firebase Cloud Messaging)
      await PushNotifications.register();

      console.log('Push notifications initialized successfully');
      this.setupListeners();
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  /**
   * Setup push notification event listeners
   */
  static setupListeners() {
    // On registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token:', token.value);
      
      // Send token to backend for storing
      this.sendTokenToBackend(token.value);
    });

    // On registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    // On push notification received (app in foreground)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
      
      // Show in-app notification
      this.handleForegroundNotification(notification);
    });

    // On push notification tapped (app in background/closed)
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed:', notification);
      
      // Navigate to specific screen based on notification data
      this.handleNotificationTap(notification);
    });
  }

  /**
   * Send FCM token to backend
   */
  static async sendTokenToBackend(token) {
    try {
      // Import API client
      const { api } = await import('../api/capacitorApiClient');
      
      await api.user.updateProfile({
        fcmToken: token,
        platform: Capacitor.getPlatform(),
      });
      
      console.log('FCM token sent to backend');
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  /**
   * Handle foreground notification
   */
  static handleForegroundNotification(notification) {
    // You can use a toast/alert library here
    if (typeof window !== 'undefined') {
      // Example: show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title || 'BFS Notification', {
          body: notification.body,
          icon: '/icon.png',
          data: notification.data,
        });
      }
    }
  }

  /**
   * Handle notification tap
   */
  static handleNotificationTap(notification) {
    const data = notification.notification.data;
    
    // Navigate based on notification type
    if (data.type === 'order_update' && data.orderId) {
      window.location.href = `/orders/${data.orderId}`;
    } else if (data.type === 'booking_confirmed' && data.bookingId) {
      window.location.href = `/bookings/${data.bookingId}`;
    } else if (data.url) {
      window.location.href = data.url;
    }
  }

  /**
   * Get current push notification status
   */
  static async getStatus() {
    if (!this.isNative) {
      return { enabled: false, reason: 'Not a native platform' };
    }

    const permStatus = await PushNotifications.checkPermissions();
    return {
      enabled: permStatus.receive === 'granted',
      permission: permStatus.receive,
    };
  }

  /**
   * Remove all listeners (call on app cleanup)
   */
  static async cleanup() {
    if (!this.isNative) return;
    
    await PushNotifications.removeAllListeners();
  }
}

/**
 * Secure Storage Service using Capacitor Preferences
 * Stores data securely on device
 */
export class SecureStorageService {
  /**
   * Save data securely
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   */
  static async set(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await Preferences.set({ key, value: stringValue });
      console.log(`Stored: ${key}`);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve data securely
   * @param {string} key - Storage key
   * @param {boolean} parseJSON - Whether to parse as JSON (default: true)
   */
  static async get(key, parseJSON = true) {
    try {
      const { value } = await Preferences.get({ key });
      
      if (!value) return null;
      
      if (parseJSON) {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      
      return value;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data
   * @param {string} key - Storage key
   */
  static async remove(key) {
    try {
      await Preferences.remove({ key });
      console.log(`Removed: ${key}`);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  /**
   * Clear all stored data
   */
  static async clear() {
    try {
      await Preferences.clear();
      console.log('All preferences cleared');
    } catch (error) {
      console.error('Error clearing preferences:', error);
    }
  }

  /**
   * Get all keys
   */
  static async keys() {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  // Convenience methods for common use cases
  static async saveUserCredentials(credentials) {
    await this.set('user_credentials', credentials);
  }

  static async getUserCredentials() {
    return await this.get('user_credentials');
  }

  static async saveAuthToken(token) {
    await this.set('auth_token', token);
  }

  static async getAuthToken() {
    return await this.get('auth_token', false);
  }

  static async clearAuthData() {
    await this.remove('auth_token');
    await this.remove('user_credentials');
    await this.remove('user_profile');
  }

  static async saveUserSettings(settings) {
    await this.set('user_settings', settings);
  }

  static async getUserSettings() {
    return await this.get('user_settings');
  }
}

// Example: Initialize notifications on app start
export const initializeCapacitorFeatures = async () => {
  console.log('Initializing Capacitor features...');
  
  // Initialize push notifications
  await NotificationService.initialize();
  
  // Restore any saved auth token
  const savedToken = await SecureStorageService.getAuthToken();
  if (savedToken) {
    console.log('Restored auth token from secure storage');
    localStorage.setItem('token', savedToken);
  }
  
  console.log('Capacitor features initialized');
};

export default {
  NotificationService,
  SecureStorageService,
  initializeCapacitorFeatures,
};
