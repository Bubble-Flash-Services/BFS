import React from "react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="max-w-6xl mx-auto pt-12 px-4">
        {/* Top section: Image + About */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <video
            src="/car/home.mp4"
            
            className="rounded-xl w-full md:w-[350px] h-[260px] object-cover"
            controls
            autoPlay
            loop
            muted
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-500 mb-2">About us</h2>
            <p className="text-lg text-gray-800 mb-4">
              At Bubble Flash, we’re passionate about making your vehicles and wardrobe shine! Based in the heart of Bengaluru, we provide top-tier car washing, bike detailing, and laundry care services, all under one roof – because we believe convenience should never compromise quality.
            </p>
            <ul className="text-base text-black mb-2 space-y-1">
              <li><img src="/aboutus/circle-check.png" alt="check" className="inline w-3 h-3 mr-2 align-middle" />Over 2,00,000 cleans</li>
              <li><img src="/aboutus/circle-check.png" alt="check" className="inline w-3 h-3 mr-2 align-middle" />Combo plans & special program plans offered</li>
              <li><img src="/aboutus/circle-check.png" alt="check" className="inline w-3 h-3 mr-2 align-middle" />100 % Customer satisfaction</li>
              <li><img src="/aboutus/circle-check.png" alt="check" className="inline w-3 h-3 mr-2 align-middle" />Doorstep services available</li>
            </ul>
          </div>
        </div>
        {/* How it works */}
        <div className="flex justify-center mt-2 mb-6">
          <button className="bg-[#e6eafc] text-xs text-blue-500 px-4 py-1 rounded-full font-semibold tracking-wide">HOW IT WORK</button>
        </div>
        <h3 className="text-2xl font-semibold text-center mb-8">Book with following 3 working steps</h3>
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <img src="/aboutus/location.png" alt="Choose location" className="w-10 h-10" />
            </div>
            <div className="font-semibold">Choose location</div>
            <div className="text-xs text-gray-500 text-center">Choose your and find your best car</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <img src="/aboutus/pickup-date.png" alt="Pick-up date" className="w-10 h-10" />
            </div>
            <div className="font-semibold">Pick-up date</div>
            <div className="text-xs text-gray-500 text-center">Select your pick up date and time to book your car</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <img src="/aboutus/bookyourwash.png" alt="Book your wash" className="w-10 h-10" />
            </div>
            <div className="font-semibold">Book your wash</div>
            <div className="text-xs text-gray-500 text-center">Book your car for doorstep service</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-3">
              <img src="/aboutus/expierencewash.png" alt="Experience wash" className="w-10 h-10" />
            </div>
            <div className="font-semibold">Experience wash</div>
            <div className="text-xs text-gray-500 text-center">Don't worry, we have many experienced professionals</div>
          </div>
        </div>
        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center">
            <img src="/laundry/laundry.gif" alt="Laundry" className="rounded-xl w-full h-[170px] object-cover mb-4" />
            <div className="text-xl font-bold text-center">Wash & Fold</div>
          </div>
          <div className="flex flex-col items-center">
            <img src="/bike/bikewash.gif" alt="Bike" className="rounded-xl w-full h-[170px] object-cover mb-4" />
            <div className="text-xl font-bold text-center">Bring Back the Shine</div>
          </div>
          <div className="flex flex-col items-center">
            <img src="/car/carwash.gif" alt="Car" className="rounded-xl w-full h-[170px] object-cover mb-4" />
            <div className="text-xl font-bold text-center">Car Clean</div>
          </div>
        </div>
      </div>
    </div>
  );
}
