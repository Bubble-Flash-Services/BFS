export const formatPrice = (amount, currency = '₹') => {
  if (amount === null || amount === undefined) {
    return `${currency}0`;
  }
  return `${currency}${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) {
    return '';
  }
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minute} ${ampm}`;
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

export const getStatusColor = (status) => {
  const statusColors = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    'in-progress': '#8B5CF6',
    completed: '#10B981',
    cancelled: '#EF4444',
  };
  return statusColors[status] || '#6B7280';
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const validateMobile = (mobile) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(mobile);
};

export const validateOTP = (otp) => {
  return otp.length === 6 && /^\d+$/.test(otp);
};
