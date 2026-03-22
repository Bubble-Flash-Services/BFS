import AsyncStorage from '@react-native-async-storage/async-storage';
import {post} from './api';

export const sendOTP = async (mobile) => {
  try {
    const response = await post('/auth/send-otp', {mobile});
    return {success: true, data: response.data};
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
    };
  }
};

export const verifyOTP = async (mobile, otp) => {
  try {
    const response = await post('/auth/verify-otp', {mobile, otp});
    const {token, user} = response.data;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return {success: true, data: {token, user}};
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid OTP. Please try again.',
    };
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    return {success: true};
  } catch (error) {
    return {success: false, message: 'Failed to logout.'};
  }
};

export const getStoredUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('authToken');
    if (userStr && token) {
      return {user: JSON.parse(userStr), token};
    }
    return null;
  } catch (error) {
    return null;
  }
};
