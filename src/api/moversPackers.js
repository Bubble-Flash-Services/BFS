import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const moversPackersAPI = axios.create({
  baseURL: `${API_URL}/movers-packers`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all movers & packers services
export const getMoversPackersServices = async () => {
  try {
    const response = await moversPackersAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching movers & packers services:', error);
    throw error;
  }
};

// Get service by ID
export const getMoversPackersServiceById = async (id) => {
  try {
    const response = await moversPackersAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

// Get services by item type
export const getServicesByItemType = async (itemType) => {
  try {
    const response = await moversPackersAPI.get(`/item-type/${itemType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services by item type:', error);
    throw error;
  }
};

// Calculate price based on distance
export const calculatePrice = async (serviceId, distance) => {
  try {
    const response = await moversPackersAPI.post('/calculate-price', {
      serviceId,
      distance
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating price:', error);
    throw error;
  }
};

export default {
  getMoversPackersServices,
  getMoversPackersServiceById,
  getServicesByItemType,
  calculatePrice
};
