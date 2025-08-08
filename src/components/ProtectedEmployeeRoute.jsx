import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedEmployeeRoute = ({ children }) => {
  const employeeToken = localStorage.getItem('employeeToken');
  const employeeUser = localStorage.getItem('employeeUser');

  if (!employeeToken || !employeeUser) {
    return <Navigate to="/employee/login" replace />;
  }

  // You can add additional token validation here if needed
  return children;
};

export default ProtectedEmployeeRoute;
