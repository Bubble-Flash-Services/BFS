import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' for immediate scroll to avoid jarring effect
      });
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(scrollToTop, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Also handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
}
