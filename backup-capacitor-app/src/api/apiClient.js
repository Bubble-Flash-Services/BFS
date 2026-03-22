// API client with automatic token expiration handling
const API = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');

// Track if we're already redirecting to avoid multiple redirects
let isRedirecting = false;

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API}${endpoint}`, {
      ...options,
      headers,
    });

    // Check for 401 Unauthorized
    if (response.status === 401 && !isRedirecting) {
      console.log('Received 401, token expired or invalid');
      isRedirecting = true;
      
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page
      window.location.href = '/';
      
      // Reset flag after a delay
      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
      
      return { error: true, message: 'Session expired. Please login again.' };
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export default apiRequest;
