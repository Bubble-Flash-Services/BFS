import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Social media SVG icons
const InstagramIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#000" d="M10 6.667A3.333 3.333 0 1 0 10 13.333 3.333 3.333 0 0 0 10 6.667Zm0 5.5A2.167 2.167 0 1 1 10 7.833a2.167 2.167 0 0 1 0 4.334Zm4.25-5.583a.792.792 0 1 1-1.583 0 .792.792 0 0 1 1.583 0ZM17.5 5.417a4.167 4.167 0 0 0-4.167-4.167H6.667A4.167 4.167 0 0 0 2.5 5.417v6.666a4.167 4.167 0 0 0 4.167 4.167h6.666a4.167 4.167 0 0 0 4.167-4.167V5.417Zm-1.25 6.666a2.917 2.917 0 0 1-2.917 2.917H6.667a2.917 2.917 0 0 1-2.917-2.917V5.417a2.917 2.917 0 0 1 2.917-2.917h6.666a2.917 2.917 0 0 1 2.917 2.917v6.666Z"/></svg>
);
const LinkedinIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#0A66C2" d="M16.667 2.5H3.333A.833.833 0 0 0 2.5 3.333v13.334a.833.833 0 0 0 .833.833h13.334a.833.833 0 0 0 .833-.833V3.333a.833.833 0 0 0-.833-.833ZM6.25 15H4.167V8.333H6.25V15Zm-1.042-7.5a1.042 1.042 0 1 1 0-2.083 1.042 1.042 0 0 1 0 2.083Zm10.209 7.5h-2.083v-3.125c0-.744-.013-1.7-1.042-1.7-1.042 0-1.202.814-1.202 1.655V15h-2.083V8.333h2.001v.917h.028c.278-.527.957-1.084 1.97-1.084 2.106 0 2.5 1.387 2.5 3.192V15Z"/></svg>
);
const YoutubeIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FF6057"/><path fill="#fff" d="M8.333 7.5v5l4.167-2.5-4.167-2.5Z"/></svg>
);
const TwitterIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#B0B0B0" d="M17.316 6.246c.008.117.008.234.008.352 0 3.59-2.732 7.728-7.728 7.728-1.535 0-2.963-.45-4.167-1.225.213.025.418.034.638.034 1.273 0 2.447-.434 3.38-1.166a2.72 2.72 0 0 1-2.54-1.89c.168.025.336.042.512.042.247 0 .494-.034.724-.1a2.716 2.716 0 0 1-2.177-2.664v-.034c.364.202.78.324 1.222.338a2.713 2.713 0 0 1-.84-3.626 7.71 7.71 0 0 0 5.6 2.84 2.713 2.713 0 0 1 4.62-2.473 5.41 5.41 0 0 0 1.72-.656 2.72 2.72 0 0 1-1.192 1.5 5.44 5.44 0 0 0 1.56-.428 5.82 5.82 0 0 1-1.36 1.41Z"/></svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#1877F3" d="M20 10A10 10 0 1 0 10 20V12.5h-2V10h2V8.5c0-2 1.167-3.125 2.958-3.125.857 0 1.75.154 1.75.154v1.917h-.985c-.97 0-1.273.6-1.273 1.217V10h2.167l-.347 2.5h-1.82V20A10 10 0 0 0 20 10Z"/></svg>
);
const EmailIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#fff"/><path d="M4 8.5v7A2.5 2.5 0 0 0 6.5 18h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 17.5 6h-11A2.5 2.5 0 0 0 4 8.5Zm2.5-1h11A1.5 1.5 0 0 1 19 8.5v.379l-7 4.083-7-4.083V8.5A1.5 1.5 0 0 1 6.5 7.5Zm-1.5 3.13 6.646 3.876a.5.5 0 0 0 .508 0L19 10.63v4.87a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 15.5v-4.87Z" fill="#3B82F6"/></svg>
);
const CameraIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#000" d="M10 6.667A3.333 3.333 0 1 0 10 13.333 3.333 3.333 0 0 0 10 6.667Zm0 5.5A2.167 2.167 0 1 1 10 7.833a2.167 2.167 0 0 1 0 4.334Z"/><rect x="2" y="5" width="16" height="10" rx="2" stroke="#000" strokeWidth="1.5"/></svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (section) => {
    // If we're not on the homepage, navigate to homepage first, then scroll to section
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
    } else {
      // If we're on homepage, just scroll to the section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePageNavigation = (path) => {
    navigate(path);
  };
  return (
    <footer className="bg-white pt-16 pb-8 px-4 md:px-16 text-gray-800 border-t border-gray-200">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-0">
        {/* Left: Logo and FAQ heading */}
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-4 mb-6">
            <img src="/logo.jpg" alt="BFS Logo" className="w-16 h-16 object-contain rounded-full border-2 border-[#1F3C88]" />
            <h2 className="text-3xl font-serif font-semibold tracking-tight text-[#1F3C88]">BFS</h2>
          </div>
          <div className="text-gray-600 text-base mb-4">
            Premium car care services you can trust.<br/>
            Making your vehicle shine since 2020.
          </div>
          <div className="text-gray-500 text-sm mb-6">
            © 2025 BFS Bubble Flash Services.<br/>
            <button
              onClick={() => window.open('https://outlook.live.com/mail/0/deeplink/compose?to=web_bfsnow@oulook.com&subject=Inquiry%20from%20Bubble%20Flash%20Website', '_blank')}
              className="underline hover:text-[#1F3C88] transition-colors"
              type="button"
            >support@bubbleflashservices.in</button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open('https://outlook.live.com/mail/0/deeplink/compose?to=web_bfsnow@oulook.com&subject=Inquiry%20from%20Bubble%20Flash%20Website', '_blank')}
              aria-label="Email support@bubbleflashservices.in"
              className="bg-[#1F3C88] p-2 rounded-full hover:bg-[#2D5AA0] transition-colors duration-300 text-white"
              type="button"
            >
              <EmailIcon />
            </button>
          </div>
        </div>
        {/* Columns */}
        <div className="flex flex-1 flex-wrap justify-between gap-8 md:gap-0">
          {/* Solutions */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-4 text-[#1F3C88] text-lg">SOLUTIONS</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <button 
                  onClick={() => handleNavigation('home')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('aboutus')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  About us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('contact')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('testimonials')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  Customer reviews
                </button>
              </li>
            </ul>
          </div>
          {/* Services */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-4 text-[#1F3C88] text-lg">SERVICES</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <button 
                  onClick={() => handlePageNavigation('/cars')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  Car wash
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageNavigation('/bikes')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  Bike wash
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handlePageNavigation('/laundry')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  Laundry
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('services')} 
                  className="hover:text-[#1F3C88] transition-colors duration-300 bg-transparent border-none cursor-pointer text-left"
                >
                  Packages
                </button>
              </li>
            </ul>
          </div>
          {/* Follow Us */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-4 text-[#1F3C88] text-lg">FOLLOW US</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <a href="https://www.instagram.com/bubble_flash_service_karnataka?igsh=ZGg4dHZrYmMxeTFh" className="flex items-center gap-2 hover:text-[#1F3C88] transition-colors duration-300">
                  <CameraIcon /> Instagram
                </a>
              </li>
              <li className="flex items-center gap-2">
                <a href="https://www.linkedin.com/company/bubble-flash-services/" className="flex items-center gap-2 hover:text-[#1F3C88] transition-colors duration-300">
                  <LinkedinIcon /> LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <a href="#" className="flex items-center gap-2 hover:text-[#1F3C88] transition-colors duration-300">
                  <YoutubeIcon /> Youtube
                </a>
              </li>
              <li className="flex items-center gap-2">
                <a href="https://www.facebook.com/people/Bubble-Flash-Services/61580041413856/" className="flex items-center gap-2 hover:text-[#1F3C88] transition-colors duration-300">
                  <FacebookIcon /> Facebook
                </a>
              </li>
            </ul>
          </div>
          {/* Company */}
          <div className="min-w-[140px]">
            <h3 className="font-semibold mb-4 text-[#1F3C88] text-lg">COMPANY</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="/about" className="hover:text-[#1F3C88] transition-colors duration-300">About</a></li>
              <li><a href="/privacy" className="hover:text-[#1F3C88] transition-colors duration-300">Privacy</a></li>
              <li><a href="/terms" className="hover:text-[#1F3C88] transition-colors duration-300">Terms</a></li>
              <li><a href="/license" className="hover:text-[#1F3C88] transition-colors duration-300">License</a></li>
              <li><a href="/security" className="hover:text-[#1F3C88] transition-colors duration-300">Security</a></li>
              <li><a href="/shipping" className="hover:text-[#1F3C88] transition-colors duration-300">Shipping</a></li>
              <li><a href="/refund" className="hover:text-[#1F3C88] transition-colors duration-300">Refunds</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        © 2025 BFS Bubble Flash Services. All rights reserved. | Proudly serving premium car care in Bangalore
      </div>
    </footer>
  );
};

export default Footer;