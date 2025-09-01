import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAttendanceStatus } from '../api/employee';

const ProtectedEmployeeRoute = ({ children }) => {
  const employeeToken = localStorage.getItem('employeeToken');
  const employeeUser = localStorage.getItem('employeeUser');
  let employeeId = null;
  try { employeeId = JSON.parse(employeeUser)?.id || null; } catch {}
  const location = useLocation();
  const [checking, setChecking] = React.useState(true);
  const [allowed, setAllowed] = React.useState(false);

  if (!employeeToken || !employeeUser) {
    return <Navigate to="/employee/login" replace />;
  }

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      // Allow attendance page itself without check to avoid loops
      if (location.pathname === '/employee/attendance') {
        if (!cancelled) { setAllowed(true); setChecking(false); }
        return;
      }
      // Only gate the dashboard behind attendance
      const needsAttendance = location.pathname.startsWith('/employee/dashboard');
      if (!needsAttendance) {
        if (!cancelled) { setAllowed(true); setChecking(false); }
        return;
      }
      try {
        // Cache per-day to avoid repeated checks
  const todayKey = new Date().toISOString().slice(0,10);
  const cacheKey = `employeeAttendance:${employeeId || 'unknown'}:${todayKey}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached === 'done') {
          if (!cancelled) { setAllowed(true); setChecking(false); }
          return;
        }
        const res = await getAttendanceStatus();
        if (!cancelled) {
          if (res?.success && res?.doneToday) {
            sessionStorage.setItem(cacheKey, 'done');
            setAllowed(true);
          } else {
            setAllowed(false);
          }
          setChecking(false);
        }
      } catch {
        if (!cancelled) { setAllowed(false); setChecking(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [location.pathname]);

  if (checking) return null;
  if (!allowed) return <Navigate to="/employee/attendance" replace />;
  return children;
};

export default ProtectedEmployeeRoute;
