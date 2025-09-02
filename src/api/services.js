// API helpers for services, packages, and add-ons
const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

// Service Categories
export async function getServiceCategories() {
  const res = await fetch(`${API}/api/services/categories`);
  return res.json();
}

// Services
export async function getAllServices() {
  const res = await fetch(`${API}/api/services`);
  return res.json();
}

export async function getServiceById(serviceId) {
  const res = await fetch(`${API}/api/services/${serviceId}`);
  return res.json();
}

export async function getServicesByCategory(categoryId) {
  const res = await fetch(`${API}/api/services/category/${categoryId}`);
  return res.json();
}

export async function searchServices(query) {
  const res = await fetch(`${API}/api/services/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

// Packages
export async function getAllPackages() {
  const res = await fetch(`${API}/api/services/packages/all`);
  return res.json();
}

export async function getPackageById(packageId) {
  const res = await fetch(`${API}/api/services/packages/${packageId}`);
  return res.json();
}

export async function getPackagesByService(serviceId) {
  const res = await fetch(`${API}/api/services/${serviceId}/packages`);
  return res.json();
}

// Add-ons
export async function getAddOns() {
  const res = await fetch(`${API}/api/services/addons`);
  return res.json();
}

export async function getAddOnById(addOnId) {
  const res = await fetch(`${API}/api/services/addons/${addOnId}`);
  return res.json();
}
