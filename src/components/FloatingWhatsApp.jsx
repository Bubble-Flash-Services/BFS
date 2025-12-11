import React from "react";

const FloatingWhatsApp = () => {
  const phoneNumber = "919591572775"; // WhatsApp format without + or spaces
  const message = encodeURIComponent(
    "Hi! I would like to know more about your services."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>

        {/* Main WhatsApp button */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 0C7.163 0 0 7.163 0 16c0 2.825.738 5.488 2.038 7.8L0 32l8.4-2.025A15.933 15.933 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.55 0-4.95-.713-7-1.95l-.5-.3-5.188 1.25 1.263-5.038-.325-.513A13.27 13.27 0 0 1 2.667 16c0-7.363 5.971-13.333 13.333-13.333S29.333 8.637 29.333 16 23.363 29.333 16 29.333z"
              fill="currentColor"
            />
            <path
              d="M23.138 19.525c-.375-.188-2.213-1.088-2.563-1.213-.35-.125-.6-.188-.85.188-.25.375-1 1.213-1.225 1.463-.225.25-.45.275-.825.088-.375-.188-1.588-.588-3.025-1.875-1.113-.988-1.863-2.213-2.088-2.588-.225-.375-.025-.575.163-.763.175-.175.375-.45.563-.675.188-.225.25-.375.375-.625.125-.25.063-.475-.025-.663-.088-.188-.85-2.038-1.163-2.788-.313-.75-.625-.65-.85-.65h-.725c-.25 0-.65.088-1 .463-.35.375-1.338 1.3-1.338 3.175s1.375 3.688 1.563 3.938c.188.25 2.638 4.025 6.388 5.638.9.388 1.6.625 2.15.8.9.288 1.725.25 2.375.15.725-.113 2.213-.9 2.525-1.775.313-.875.313-1.625.225-1.775-.088-.15-.338-.238-.713-.425z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap">
          <div className="bg-gray-800 text-white text-sm py-2 px-3 rounded-lg shadow-lg">
            Chat with us on WhatsApp
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default FloatingWhatsApp;
