const API_BASE_URL = '/api/adminNew';

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get current customers
export const getCurrentCustomers = async () => {
  try {
  const token = localStorage.getItem('adminToken');
  // This endpoint doesn't exist under adminNew; keep legacy path under /api/admin
  const response = await fetch(`/api/admin/dashboard/current-customers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch current customers');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching current customers:', error);
    throw error;
  }
};

// Get monthly sales and revenue data
export const getMonthlyData = async () => {
  try {
  const token = localStorage.getItem('adminToken');
  // This endpoint doesn't exist under adminNew; keep legacy path under /api/admin
  const response = await fetch(`/api/admin/dashboard/monthly-data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch monthly data');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    throw error;
  }
};
