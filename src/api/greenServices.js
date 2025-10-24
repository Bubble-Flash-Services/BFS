// src/api/greenServices.js
import axios from "axios";

// Use Vite environment variable (fallback to localhost)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
});

// Fetch all services
export const fetchServices = async () => {
  const res = await API.get("/api/green/services", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data;
};

// Fetch single service by ID or slug
export const fetchServiceById = async (id) => {
  const res = await API.get(`/api/green/services/${id}`);
  return res.data;
};

// Create booking / order
export const createBooking = async (payload, token) => {
  const res = await API.post("/api/green/booking", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
