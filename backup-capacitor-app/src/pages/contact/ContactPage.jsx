import React from "react";

export default function ContactPage() {
  return (
    <div className="bg-white rounded-t-3xl  pb-2 px-4 md:px-16 ">
      <div className="max-w-6xl mx-auto">
        <div className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="text-lg"><img src="/services/name.svg" alt="Callback" className="w-4 h-4" /></span> Contact US
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-base text-gray-800 mt-2">
          <div>
            <div className="font-semibold">Address</div>
            <div>Bangalore, India</div>
          </div>
          <div>
            <div className="font-semibold">Phone</div>
            <div>+91 9980123452</div>
          </div>
          <div>
          <div className="font-semibold">Email</div>
          <div
            className="underline cursor-pointer"
            onClick={() => window.open('https://outlook.live.com/mail/0/deeplink/compose?to=web_bfsnow@oulook.com&subject=Inquiry%20from%20Bubble%20Flash%20Website', '_blank')}
          >Info@bubbleflashservices.in</div>
          </div>
          <div>
            <div className="font-semibold">Business Hours</div>
            <div>
              Monday - Saturday: 9:00 AM - 8:00 PM
              <br />
              Sunday: 10:00 AM - 6:00 PM
            </div>
          </div>
        </div>
        <div className="mt-8">
          <a
            href="https://maps.app.goo.gl/mqVWff6HjLuDCcrD9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline text-base font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.5-7.5 11.25-7.5 11.25S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            View on Google Maps
          </a>
        </div>
        <div className="mt-8 w-full flex justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.178643044415!2d77.54821629999999!3d12.8962318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fcbc3f34bfd%3A0xec982eb2135f8719!2sBubble%20Flash%20Services!5e0!3m2!1sen!2sin!4v1750524476198!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '1rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bubble Flash Services Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
