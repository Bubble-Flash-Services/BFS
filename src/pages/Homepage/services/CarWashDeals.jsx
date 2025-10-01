import React, { useState, useRef, useEffect } from 'react';
import FullBodyCheckup from '../../../components/FullBodyCheckup';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../../../components/CartContext';
import { useAuth } from '../../../components/AuthContext';
import SigninModal from '../signin/SigninModal';

const carWashPackages = {
  hatchbacks: {
    title: "Hatchback Car Wash Packages",
    packages: [
      {
        id: 1,
        name: "Quick Shine",
        image: "/car/hatchback/car1.png",
        price: "₹249",
        originalPrice: null,
        description: "Get a professional-grade car wash with high-quality cleaning solutions — ideal for everyday shine and instant freshness.",
        features: [
          "Exterior Wash using high-pressure water gun",
          "Foam Wash (Normal Foam included)",
          "Tyre Cleaning"
        ],
        foamUpgrades: [
          { name: "Green Foam", description: "Mild, eco-friendly cleaning foam", price: 69 },
          { name: "Royal Red Foam", description: "Deep cleaning + color-enhanced shine", price: 129 },
          { name: "Diamond Foam", description: "Glossy shine with wax-based formula", price: 199 }
        ]
      },
      {
        id: 2,
        name: "Deluxe Car Wash",
        image: "/car/hatchback/aiease_1755725753769.png",
        price: "₹399",
        originalPrice: null,
        description: "A fast and efficient wash that gives your car a clean look and a fresh feel — all at a pocket-friendly price.",
        features: [
          "Exterior Wash using high-pressure water gun",
          "Foam Wash (Standard foam included)",
          "Tyre Cleaning",
          "Interior Vacuum Cleaning (Seats, floors, corners)",
          "Car Mats Cleaning",
          "Dashboard Cleaning & Wipe Down"
        ],
        foamUpgrades: [
          { name: "Green Foam", description: "Mild, eco-friendly foam", price: 69 },
          { name: "Royal Red Foam", description: "Rich foam with deeper cleaning", price: 129 },
          { name: "Diamond Foam", description: "Glossy finish with wax-based formula", price: 199 }
        ]
      },
      {
        id: 3,
        name: "Premium Car Wash",
        image: "/car/hatchback/aiease_1755725753769.png",
        price: "₹599",
        originalPrice: null,
        description: "Perfect for daily drivers — a quick professional wash using premium foam and detailing essentials to refresh your ride in no time. A full-service cleaning designed for those who want a clean, fresh, and polished car — inside and out — without spending too much time or money.",
        features: [
          "Exterior Wash using high-pressure water gun",
          "Red Foam Wash (Standard in this package – rich lather & better shine)",
          "Tyre & Rim Cleaning + Polishing",
          "Interior Vacuum Cleaning (Seats, floors, corners)",
          "Car Mats Cleaning",
          "Dashboard Cleaning & Wipe Down",
          "Free Car Air Freshener (Fragrance of your choice – included)"
        ]
      }
    ],
    monthlyPlans: [
      {
        id: 'silver',
        name: "Silver Plan",
        price: "₹999/month",
        description: "For light users who want basic care — just enough to keep the car looking clean and fresh.",
        features: [
          "4 washes/month (1 wash per week)",
          "Interior mat and vacuum cleaning once every 15 days"
        ],
        weeklyIncludes: [
          "Exterior wash with high-pressure water gun",
          "Normal foam wash (standard white foam)",
          "Tyre cleaning",
        ],
        biWeeklyIncludes: [
          "Interior vacuum cleaning (Seats + Corners)",
          "Inside mat cleaning"
        ]
      },
      {
        id: 'gold',
        name: "Gold Plan",
        price: "₹1,599/month",
        description: "Perfect for regular drivers who need complete maintenance. Keep your car clean, fresh, and polished — inside and out — with premium care.",
        features: [
          "4 washes/month (1 wash per week)"
        ],
        washIncludes: [
          "Exterior wash using high-pressure water",
          "Foam Wash (deeper clean with vibrant shine)",
          "Tyre & rim cleaning",
          "Interior vacuum cleaning (seats, floor, corners)",
          "Car mats cleaning",
          "Dashboard cleaning"
        ],
        monthlyBonuses: [
          "1 Free Premium Air Freshener",
          "1 Complete Detailing Service (once a month) which includes:",
          "• Diamond Foam Wash",
          "• Wax Body Polishing",
          "• Dashboard Polishing",
          "• Tyre Polishing"
        ]
      },
      {
        id: 'platinum',
        name: "Platinum Plan",
        price: "₹2,399/month",
        description: "For premium users who want their car always showroom-ready. Ultimate monthly care with premium detailing, free products, and exclusive perks — ideal for those who expect the best.",
        features: [
          "4 washes/month (1 wash per week)",
          "1 Diamond Foam Wash per week (premium glossy foam with wax effect)",
          "1 Tyre Polishing per week",
          "1 Dashboard Polishing per week",
          "1 Body Wax Polishing per week (max 4 times/month)"
        ],
        washIncludes: [
          "Exterior wash using high-pressure water gun",
          "Foam Wash (Diamond Foam used once per week)",
          "Tyre & rim cleaning (with polishing once per week)",
          "Interior vacuum cleaning (seats, floor, corners)",
          "Car mats cleaning",
          "Dashboard cleaning (plus dashboard polishing once per week)"
        ],
        platinumExtras: [
          "Premium Air Freshener",
          "Tissue Box",
          "Car Cover Cleaning – 2 times/month (We clean and return it to the customer)"
        ]
      }
    ]
  },
  "sedans": {
    title: "Sedan Car Wash Packages",
    subtitle: "Bigger Car, Deeper Clean — Designed for Long Body Vehicles (Dzire, City, Verna, etc.)",
    packages: [
      {
        id: 1,
        name: "Quick Shine",
        image: "/car/sedan/sedansimage.jpg",
        price: "₹299",
        originalPrice: null,
        description: "Clean Look. Fresh Feel. Fast and efficient exterior wash using premium products for a fresh look.",
        features: [
          "Exterior wash with high-pressure water",
          "Foam wash (normal white foam)",
          "Tyre cleaning"
        ]
      },
      {
        id: 2,
        name: "Deluxe Car Wash",
        image: "/car/sedan/sedansimage.jpg",
        price: "₹499",
        originalPrice: null,
        description: "More Than Just a Wash. Interior + exterior care for regular weekly maintenance.",
        features: [
          "All Quick Shine services",
          "Interior vacuum cleaning",
          "Dashboard cleaning",
          "Windshield water spot removal",
          "Tyre & rim polishing",
          "Car mats cleaning"
        ]
      },
      {
        id: 3,
        name: "Premium Car Wash",
        image: "/car/sedan/sedansimage.jpg",
        price: "₹699",
        originalPrice: null,
        description: "Showroom Finish. Deep clean and polish for both body and interior — perfect for travel, events, or gifting.",
        features: [
          "Diamond foam wash (included)",
          "Tyre & rim cleaning & polishing",
          "Interior vacuuming",
          "Car mats + seat cleaning",
          "Dashboard polishing",
          "Windshield polishing",
          "Free Premium Air Freshener",
          "Car paper mats free",
          "Car under body cleaning"
        ]
      }
    ],
    monthlyPlans: [
      {
        id: 'silver',
        name: "Silver Plan",
        price: "₹1199/month",
        description: "For light users who want basic monthly care.",
        features: [
          "4 washes/month (1 per week)",
          "Interior vacuum & mat cleaning – once every 15 days"
        ],
        weeklyIncludes: [
          "Exterior wash with high-pressure water",
          "Normal foam wash",
          "Tyre cleaning",
          "Car mats cleaning"
          
        ]
      },
      {
        id: 'gold',
        name: "Gold Plan",
        price: "₹1,999/month",
        description: "For regular drivers who need inside-out cleaning.",
        features: [
          "4 washes/month (1 per week)",
          "1 Free Premium Air Freshener/month",
          "1 Full Detailing Session/month"
        ],
        washIncludes: [
          "Exterior wash with high-pressure water",
          "Red foam wash",
          "Tyre & rim cleaning",
          "Interior vacuum cleaning",
          "Dashboard cleaning",
          "Car mats cleaning",
        ],
        monthlyBonuses: [
          "1 Full Detailing Session includes:",
          "• Diamond foam wash",
          "• Wax body polish",
          "• Dashboard polish",
          "• Tyre polish"
        ]
      },
      {
        id: 'platinum',
        name: "Platinum Plan",
        price: "₹2,999/month",
        description: "For luxury-focused customers who want a showroom finish every week.",
        features: [
          "4 washes/month (1 wash per week)",
          "1 Wax + Tyre + Dashboard Polishing every week"
        ],
        washIncludes: [
          "Exterior wash with high-pressure water",
          "Diamond foam wash (once/week)",
          "Tyre & rim cleaning & polishing",
          "Interior vacuum (seats, floor, corners)",
          "Dashboard cleaning & polishing",
          "Car mats + seat cleaning",
          "Windshield cleaning"
        ],
        platinumExtras: [
          "Free Air Freshener + Tissue Box/month",
          "Car cover washed 2 times/month & returned to customer"
        ]
      }
    ]
  },
  midsuv: {
  title: "MID-SUV Car Wash Packages",
    subtitle: "Tough Body. Bigger Space. Deeper Clean. Perfectly designed for your SUV's size and detailing needs.",
    packages: [
      {
        id: 1,
        name: "Quick Shine",
        image: "/car/suv/pexels-eng_hk-2153621871-33018219.png",
        price: "₹399",
        originalPrice: null,
        description: "Fast Exterior Refresh - Ideal for a quick shine after travel or city driving.",
        features: [
          "Exterior wash using high-pressure water gun",
          "Foam wash (normal white foam)",
          "Tyre cleaning"
          
        ]
      },
      {
        id: 2,
  name: "Deluxe MID-SUV Wash",
        image: "/car/suv/pexels-eng_hk-2153621871-33018219.png",
        price: "₹599",
        originalPrice: null,
        description: "Complete Regular Cleaning – Inside + Outside. All Quick Shine services plus enhanced interior care.",
        features: [
          "All Quick Shine services",
          "Red Foam Wash",
          "Tyre & Rim polishing",
          "Interior vacuum cleaning (seats, floor, boot)",
          "Dashboard cleaning",
          "Windshield cleaning + water spot removal",
          "Car mats cleaning"
        ]
      },
      {
        id: 3,
  name: "Premium MID-SUV Wash",
        image: "/car/suv/pexels-eng_hk-2153621871-33018219.png",
        price: "₹899",
        originalPrice: null,
        description: "Showroom-Style Deep Clean & Shine. Best before long drives, resale, or monthly detailing.",
        features: [
          "Diamond Foam Wash (glossy wax-rich foam)",
          "Tyre & rim cleaning + polishing",
          "Full interior vacuuming",
          "Seat & mat cleaning",
          "Dashboard cleaning",
          "Windshield polishing",
          "Car paper mats free",
          "Free Premium Air Freshener"
        ]
      }
    ],
    monthlyPlans: [
      {
        id: 'silver',
        name: "Silver Plan",
        price: "₹1,599/month",
        description: "For light SUV users who want basic care.",
        features: [
          "4 washes/month (1 wash per week)",
          "Interior mat & vacuum cleaning – 1 time/month"
        ],
        weeklyIncludes: [
          "Exterior wash using high-pressure water",
          "Normal foam wash",
          "Tyre cleaning",
          "Car mats cleaning"
        ]
      },
      {
        id: 'gold',
        name: "Gold Plan",
        price: "₹2,399/month",
        description: "For regular SUV users who need proper maintenance inside and out.",
        features: [
          "4 washes/month (1 wash per week)",
          "1 Free Premium Air Freshener/month",
          "1 Complete Premium Service/month"
        ],
        washIncludes: [
          "Exterior wash",
          "Red foam wash",
          "Tyre & rim cleaning",
          "Interior vacuum cleaning",
          "Car mats cleaning",
          "Dashboard cleaning"
        ],
        monthlyBonuses: [
          "1 Complete Premium Service includes:",
          "• Diamond foam wash",
          "• Wax polish",
          "• Dashboard polish",
          "• Tyre polish"
        ]
      },
      {
        id: 'platinum',
        name: "Platinum Plan",
        price: "₹3,599/month",
        description: "For premium users who want their SUV always showroom-ready.",
        features: [
          "4 washes/month (1 wash per week)",
          "Weekly Polishing Package: Diamond Foam + Wax + Tyre + Dashboard Polish"
        ],
        washIncludes: [
          "High-pressure exterior wash",
          "Diamond foam wash (once/week)",
          "Tyre & rim cleaning + polishing",
          "Interior vacuum cleaning (including boot)",
          "Dashboard + seat cleaning & polishing",
          "Windshield water spot removal"
        ],
        platinumExtras: [
          "Free Tissue Box + Premium Perfume",
          "Car Cover Cleaning – 2 times/month (returned after wash)"
        ]
      }
    ]
  },
  suv: {
    title: "SUV Car Wash Packages",
    subtitle: "Tough Body. Bigger Space. Deeper Clean. Perfectly designed for your SUV's size and detailing needs.",
    packages: [
      {
        id: 1,
        name: "Quick Shine",
        image: "/car/suv/suvimages.png",
        price: "₹499",
        originalPrice: null,
        description: "Fast Exterior Refresh - Ideal for a quick shine after travel or city driving.",
        features: [
          "Exterior wash using high-pressure water gun",
          "Foam wash (normal white foam)",
          "Tyre cleaning"
          
        ]
      },
      {
        id: 2,
        name: "Deluxe SUV Wash",
        image: "/car/suv/suvimages.png",
        price: "₹699",
        originalPrice: null,
        description: "Complete Regular Cleaning – Inside + Outside. All Quick Shine services plus enhanced interior care.",
        features: [
          "All Quick Shine services",
          "Red Foam Wash",
          "Tyre & Rim polishing",
          "Interior vacuum cleaning (seats, floor, boot)",
          "Dashboard cleaning",
          "Windshield cleaning + water spot removal",
          "Car mats cleaning"
        ]
      },
      {
        id: 3,
        name: "Premium SUV Wash",
        image: "/car/suv/luxury_suv2.png",
        price: "₹899",
        originalPrice: null,
        description: "Showroom-Style Deep Clean & Shine. Best before long drives, resale, or monthly detailing.",
        features: [
          "Diamond Foam Wash (glossy wax-rich foam)",
          "Tyre & rim cleaning + polishing",
          "Full interior vacuuming",
          "Seat & mat cleaning",
          "Dashboard cleaning",
          "Windshield polishing",
          "Car paper mats free",
          "Free Premium Air Freshener"
        ]
      }
    ],
    monthlyPlans: [
      {
        id: 'silver',
        name: "Silver Plan",
        price: "₹1,999/month",
        description: "For light SUV users who want basic care.",
        features: [
          "4 washes/month (1 wash per week)",
          "Interior mat & vacuum cleaning – 1 time/month"
        ],
        weeklyIncludes: [
          "Exterior wash using high-pressure water",
          "Normal foam wash",
          "Tyre cleaning",
          "Car mats cleaning",
        ]
      },
      {
        id: 'gold',
        name: "Gold Plan",
        price: "₹2,399/month",
        description: "For regular SUV users who need proper maintenance inside and out.",
        features: [
          "4 washes/month (1 wash per week)",
          "1 Free Premium Air Freshener/month",
          "1 Complete Premium Service/month"
        ],
        washIncludes: [
          "Exterior wash",
          "Red foam wash",
          "Tyre & rim cleaning",
          "Interior vacuum cleaning",
          "Car mats cleaning",
          "Dashboard cleaning"
        ],
        monthlyBonuses: [
          "1 Complete Premium Service includes:",
          "• Diamond foam wash",
          "• Wax polish",
          "• Dashboard polish",
          "• Tyre polish"
        ]
      },
      {
        id: 'platinum',
        name: "Platinum Plan",
        price: "₹3,499/month",
        description: "For premium users who want their SUV always showroom-ready.",
        features: [
          "4 washes/month (1 wash per week)",
          "Weekly Polishing Package: Diamond Foam + Wax + Tyre + Dashboard Polish"
        ],
        washIncludes: [
          "High-pressure exterior wash",
          "Diamond foam wash (once/week)",
          "Tyre & rim cleaning + polishing",
          "Interior vacuum cleaning (including boot)",
          "Dashboard + seat cleaning & polishing",
          "Windshield water spot removal"
        ],
        platinumExtras: [
          "Free Tissue Box + Premium Perfume",
          "Car Cover Cleaning – 2 times/month (returned after wash)"
        ]
      }
    ]
  },
  
  "luxuries": {
    title: "Luxury Car Wash Packages",
    subtitle: "Designed for Premium Cars – Extra Protection. Extra Shine.",
    packages: [
      {
        id: 1,
        name: "Quick Shine",
        image: "/car/sedan/luxury_sedan.png",
        price: "₹699",
        originalPrice: null,
        description: "Fast Premium Exterior Wash",
        features: [
          "Exterior wash using soft-pressure water gun",
          "pH-balanced foam wash (normal white foam)",
          "Tyre cleaning (scratch-free tools)",
          "Alloy-safe wheel rinse",
          "Paper mats cleaning",
          "Soft microfiber drying only"
        ]
      },
      {
        id: 2,
        name: "Deluxe Luxury Wash",
        image: "/car/suv/luxury_suv.png",
        price: "₹899",
        originalPrice: null,
        description: "Premium Clean with Interior Refresh",
        features: [
          "All Quick Shine services",
          "Red foam wash (safe on ceramic/clear coat)",
          "Interior vacuum cleaning",
          "Dashboard dusting + microfiber wipe",
          "Tyre & rim cleaning",
          "Windshield water spot removal",
          "Free Premium Air Freshener"
        ]
      },
      {
        id: 3,
        name: "Luxury Premium Spa",
        image: "/car/suv/luxury_suv.png",
        price: "₹1,299",
        originalPrice: null,
        description: "Detailing-Focused Deep Clean & Shine",
        features: [
          "Diamond foam wash (wax-rich foam)",
          "Wax body polish (machine/buffer-safe)",
          "Tyre & rim polishing",
          "Full interior vacuum + roof/boot cleaning",
          "Dashboard & leather surface polishing",
          "Windshield glass polish + stain removal",
          "Car mats & seats cleaned",
          "Free Tissue Box + Luxury Perfume Spray"
        ]
      }
    ],
    monthlyPlans: [
      {
        id: 'silver',
        name: "Silver Plan",
        price: "₹2,799/month",
        description: "For occasional users who need gentle, regular exterior care.",
        features: [
          "4 washes/month (1 per week)",
          "1 Interior vacuum cleaning/month"
        ],
        weeklyIncludes: [
          "Exterior wash using soft-pressure water",
          "pH-balanced white foam wash",
          "Tyre & alloy cleaning",
          "Car mats cleaning",
          "Microfiber towel drying"
        ]
      },
      {
        id: 'gold',
        name: "Gold Plan",
        price: "₹3,599/month",
        description: "For regular premium drivers who expect a clean interior & shine every week.",
        features: [
          "4 washes/month (1 wash per week)",
          "1 Diamond Foam Wash/month",
          "1 Premium Wax Polish/month",
          "1 Air Freshener/month"
        ],
        washIncludes: [
          "Exterior wash with red foam",
          "Tyre & rim cleaning",
          "Interior vacuuming",
          "Dashboard cleaning",
          "Car mats cleaning",
          "Windshield spot removal"
        ]
      },
      {
        id: 'platinum',
        name: "Platinum Plan",
        price: "₹5,199/month",
        description: "For luxury owners who want a showroom finish—always.",
        features: [
          "4 washes/month (1 wash per week)",
          "Weekly Detailing: Diamond Foam Wash + Wax Polish + Dashboard & Tyre Polishing"
        ],
        washIncludes: [
          "Soft water wash + Diamond Foam",
          "Tyre & rim polishing",
          "Full interior vacuum",
          "Dashboard, leather & trim polish",
          "Roof & boot cleaning",
          "Windshield polish",
          "Seat + mat cleaning"
        ],
        platinumExtras: [
          "Tissue Box + Luxury Perfume Spray",
          "Car Cover Wash – 2 times/month"
        ]
      }
    ]
  }
};

export default function CarWashDeals() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  const [pricingType, setPricingType] = useState('basic');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [modalStartX, setModalStartX] = useState(0);
  const [modalIsDragging, setModalIsDragging] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [monthlyPlansSlide, setMonthlyPlansSlide] = useState(0);
  const sliderRef = useRef(null);
  const monthlyPlansRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  let categoryKey = category?.toLowerCase().replace(/\s+/g, '-').replace('&', '');
  // Normalize common aliases
  if (categoryKey === 'mid-suv') categoryKey = 'midsuv';
  const dealData = carWashPackages[categoryKey] || carWashPackages.hatchbacks;
  const isLuxury = categoryKey === 'luxuries';

  // Helper to pick a representative image per category (used for monthly plans)
  const getCategoryBaseImage = () => {
    switch (categoryKey) {
      case 'sedans':
        return '/car/sedan/sedansimage.jpg';
      case 'suv':
        return '/car/suv/suvimages.png';
      case 'midsuv':
        return '/car/suv/pexels-eng_hk-2153621871-33018219.png';
      case 'luxuries':
        return '/car/sedan/luxury_sedan.png';
      case 'hatchbacks':
      default:
        return '/car/hatchback/car1.png';
    }
  };

  // Car wash details for booking modal
  const carWashDetails = {
    slides: [
      {
        id: 0,
        title: "Exterior Wash",
        image: "/car/exterior-wash.png",
        description: "Complete exterior cleaning with high-pressure water and premium soap"
      },
      {
        id: 1,
        title: "Interior Wash", 
        image: "/car/interior-wash.png",
        description: "Deep cleaning of seats, dashboard, and interior surfaces"
      },
      {
        id: 2,
        title: "Features",
        image: "/car/features.png", 
        description: "Advanced cleaning techniques and premium equipment"
      },
      {
        id: 3,
        title: "Highlights",
        image: "/car/highlights.png",
        description: "Special attention to detail and finishing touches"
      },
      {
        id: 4,
        title: "Tyre Wash",
        image: "/car/tyre-wash.png",
        description: "Professional tyre cleaning and shine treatment"
      }
    ]
  };

  const addons = [
    {
      id: 1,
      name: "Green Foam Upgrade",
      price: 69,
      description: "Mild, eco-friendly cleaning foam upgrade",
      icon: ""
    },
    {
      id: 2,
      name: "Royal Red Foam Upgrade", 
      price: 129,
      description: "Deep cleaning + color-enhanced shine foam",
      icon: ""
    },
    {
      id: 3,
      name: "Diamond Foam Upgrade",
      price: categoryKey === 'suv' ? 299 : categoryKey === 'sedans' ? 229 : 199,
      description: "Glossy shine with wax-based formula foam",
      icon: ""
    },
    {
      id: 4,
      name: "Dashboard Polishing",
      price: categoryKey === 'suv' ? 199 : categoryKey === 'sedans' ? 149 : 99,
      description: "Professional dashboard cleaning and polishing",
      icon: ""
    },
    {
      id: 5,
      name: "Tyre Cleaning & Polishing",
      price: categoryKey === 'suv' ? 199 : categoryKey === 'sedans' ? 249 : 189,
      description: "Complete tyre cleaning and polishing service",
      icon: ""
    },
    {
      id: 6,
      name: "Windshield Cleaning + Water Spot Removal",
      price: categoryKey === 'sedans' ? 239 : 129,
      description: "Crystal clear windshield with water spot removal",
      icon: ""
    },
    {
      id: 7,
      name: "Vacuum Interior Cleaning",
      price: categoryKey === 'sedans' ? 179 : 229,
      description: "Deep vacuum cleaning of interior surfaces",
      icon: ""
    },
    {
      id: 8,
      name: "Car Roof/Ceiling Cleaning",
      price: categoryKey === 'suv' ? 399 : categoryKey === 'sedans' ? 249 : 149,
      description: "Specialized roof and ceiling cleaning service",
      icon: ""
    },
    {
      id: 9,
      name: "Leather Seat Polishing (Per Seat)",
      price: categoryKey === 'suv' ? 119 : categoryKey === 'sedans' ? 99 : 69,
      description: `Professional leather seat polishing (₹${categoryKey === 'suv' ? 119 : categoryKey === 'sedans' ? 99 : 69} per seat)`,
      icon: ""
    },
    {
      id: 10,
      name: "Wax Body Polishing",
      price: categoryKey === 'suv' ? 249 : categoryKey === 'sedans' ? 199 : 149,
      description: "Premium wax coating for body protection",
      icon: ""
    },
    {
      id: 11,
      name: "Leather Dashboard/Interior Polishing",
      price: categoryKey === 'sedans' ? 249 : 199,
      description: "Complete leather dashboard and interior polishing",
      icon: ""
    },
    {
      id: 12,
      name: "Car Welcome Mats Cover (Set)",
      price: 50,
      description: "Set of welcome mats for your car",
      icon: ""
    },
    ...(categoryKey === 'suv' ? [
      {
        id: 13,
        name: "Red Foam Upgrade",
        price: 199,
        description: "Red foam upgrade for enhanced cleaning",
        icon: ""
      },
      {
        id: 14,
        name: "Perfume Spray (Premium)",
        price: 349,
        description: "Premium perfume spray application",
        icon: ""
      },
      {
        id: 15,
        name: "Car Cover (SUV size)",
        price: 1999,
        description: "Premium car cover designed for SUVs",
        icon: ""
      }
    ] : []),
    ...(categoryKey === 'sedans' ? [
      {
        id: 16,
        name: "Red Foam Wash",
        price: 199,
        description: "Premium red foam wash upgrade",
        icon: ""
      },
      {
        id: 17,
        name: "Premium Perfume Spray",
        price: 349,
        description: "Premium perfume spray application",
        icon: ""
      },
      {
        id: 18,
        name: "Tissue Box (Premium)",
        price: 200,
        description: "Premium tissue box for your car",
        icon: ""
      },
      {
        id: 19,
        name: "Car Air Freshener (Clip/Can Type)",
        price: 99,
        description: "Premium car air freshener",
        icon: ""
      },
      {
        id: 20,
        name: "Car Cover (Standard Size – Sedan)",
        price: 1449,
        description: "Premium car cover designed for sedans",
        icon: ""
      }
    ] : []),
    ...(categoryKey === 'luxuries' ? [
      {
        id: 21,
        name: "Red Foam Upgrade",
        price: 249,
        description: "Premium red foam upgrade for luxury cars",
        icon: ""
      },
      {
        id: 22,
        name: "Diamond Foam Upgrade",
        price: 349,
        description: "Premium diamond foam upgrade for luxury cars",
        icon: ""
      },
      {
        id: 23,
        name: "Wax Body Polishing",
        price: 399,
        description: "Premium wax body polishing for luxury cars",
        icon: ""
      },
      {
        id: 24,
        name: "Leather Seat Polishing (Per Seat)",
        price: 199,
        description: "Premium leather seat polishing for luxury cars",
        icon: ""
      },
      {
        id: 25,
        name: "Dashboard Leather Conditioning",
        price: 199,
        description: "Premium dashboard leather conditioning",
        icon: ""
      },
      {
        id: 26,
        name: "Tyre & Rim Polishing",
        price: 299,
        description: "Premium tyre and rim polishing service",
        icon: ""
      },
      {
        id: 27,
        name: "Windshield Polish & Protection",
        price: 249,
        description: "Premium windshield polish and protection",
        icon: ""
      },
      {
        id: 28,
        name: "Car Cover Wash (Large)",
        price: 3999,
        description: "Premium car cover wash for luxury vehicles",
        icon: ""
      }
    ] : [])
  ];

  // Service Availability Information
  const serviceInfo = {
    availability: "Free within 5 km radius",
    extraCharges: [
      { distance: "5–10 km", charge: "₹50" },
      { distance: "10–15 km", charge: "₹100" }
    ]
  };

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev => {
      const isSelected = prev.find(item => item.id === addon.id);
      if (isSelected) {
        return prev.filter(item => item.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const calculateTotal = () => {
    let packagePrice = 0;
    
    if (selectedPackage?.price) {
      // Handle monthly plans price format (e.g., "₹1,499/month")
      if (selectedPackage.price.includes('/month')) {
        const priceString = selectedPackage.price.replace('₹', '').replace('/month', '').replace(',', '');
        packagePrice = parseInt(priceString);
      } else {
        // Handle regular package price format (e.g., "₹199")
        packagePrice = parseInt(selectedPackage.price.replace('₹', '').replace(',', ''));
      }
    } else {
      packagePrice = 199; // Default price
    }
    
    const addonsTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
    return packagePrice + addonsTotal;
  };

  const getAddonsTotal = () => {
    return selectedAddons.reduce((total, addon) => total + addon.price, 0);
  };

  const getCategoryDisplayName = () => {
    switch(categoryKey) {
      case 'hatchbacks': return 'Hatchbacks';
      case 'suv': return 'SUV';
      case 'sedans': return 'Sedans';
      case 'luxuries': return 'Luxuries';
  case 'midsuv': return 'MID-SUV';
      default: return 'Hatchbacks';
    }
  };

  const checkAuthAndExecute = (callback) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    callback();
  };

  const createCartItem = () => {
    let packagePrice = 0;
    
    if (selectedPackage?.price) {
      // Handle monthly plans price format (e.g., "₹1,499/month")
      if (selectedPackage.price.includes('/month')) {
        const priceString = selectedPackage.price.replace('₹', '').replace('/month', '').replace(',', '');
        packagePrice = parseInt(priceString);
      } else {
        // Handle regular package price format (e.g., "₹199")
        packagePrice = parseInt(selectedPackage.price.replace('₹', '').replace(',', ''));
      }
    } else {
      packagePrice = 199; // Default price
    }
    
    const addonsTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
    const totalPrice = packagePrice + addonsTotal;

    return {
      id: `carwash-${selectedPackage.id}-${Date.now()}`,
      serviceId: `carwash-${selectedPackage.id}`,
      name: selectedPackage.name,
      serviceName: selectedPackage.name,
  packageName: selectedPackage.name,
  image: selectedPackage.image || getCategoryBaseImage(),
      price: totalPrice,
      category: getCategoryDisplayName(),
      type: selectedPackage.type || 'car-wash',
      vehicleType: category || 'hatchbacks',
  // Do not send numeric packageId to backend (not a valid ObjectId)
  // packageId intentionally omitted unless backed by DB
      addOns: selectedAddons, // Use addOns instead of addons
    packageDetails: {
        basePrice: packagePrice,
  addons: selectedAddons, // Keep this for display purposes
  addonsTotal: addonsTotal,
  features: selectedPackage.features,
  // Monthly plan details if present on selected package
  weeklyIncludes: selectedPackage.weeklyIncludes || [],
  washIncludes: selectedPackage.washIncludes || [],
  biWeeklyIncludes: selectedPackage.biWeeklyIncludes || [],
  monthlyBonuses: selectedPackage.monthlyBonuses || [],
  platinumExtras: selectedPackage.platinumExtras || []
      },
      quantity: 1
    };
  };

  const handleAddToCart = () => {
    checkAuthAndExecute(() => {
      const cartItem = createCartItem();
      addToCart(cartItem);
      setShowBookingModal(false);
      // You can add a toast notification here if needed
      alert('Item added to cart successfully!');
    });
  };

  const handleBuyNow = () => {
    checkAuthAndExecute(() => {
      const cartItem = createCartItem();
      addToCart(cartItem);
      setShowBookingModal(false);
      navigate('/cart');
    });
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // You can optionally auto-execute the pending action here
  };

  const handleBookNow = (pkg) => {
    setSelectedPackage({
      ...pkg,
      price: getPrice(pkg.price)
    });
    setSelectedAddons([]);
    setModalCurrentSlide(0);
    setShowBookingModal(true);
  };

  // Touch/swipe handlers for modal image slider
  const handleModalTouchStart = (e) => {
    const startX = e.touches[0].pageX;
    setModalStartX(startX);
    setModalIsDragging(true);
  };

  const handleModalTouchMove = (e) => {
    if (!modalIsDragging) return;
    e.preventDefault();
  };

  const handleModalTouchEnd = (e) => {
    if (!modalIsDragging) return;
    setModalIsDragging(false);
    
    const endX = e.changedTouches[0].pageX;
    const diffX = modalStartX - endX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && modalCurrentSlide < carWashDetails.slides.length - 1) {
        setModalCurrentSlide(modalCurrentSlide + 1);
      } else if (diffX < 0 && modalCurrentSlide > 0) {
        setModalCurrentSlide(modalCurrentSlide - 1);
      }
    }
  };

  // Mouse event handlers for desktop interaction
  const handleModalMouseDown = (e) => {
    e.preventDefault();
    const startX = e.pageX;
    setModalStartX(startX);
    setModalIsDragging(true);
  };

  const handleModalMouseMove = (e) => {
    if (!modalIsDragging) return;
    e.preventDefault();
  };

  const handleModalMouseUp = (e) => {
    if (!modalIsDragging) return;
    setModalIsDragging(false);
    
    const endX = e.pageX;
    const diffX = modalStartX - endX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && modalCurrentSlide < carWashDetails.slides.length - 1) {
        setModalCurrentSlide(modalCurrentSlide + 1);
      } else if (diffX < 0 && modalCurrentSlide > 0) {
        setModalCurrentSlide(modalCurrentSlide - 1);
      }
    }
  };

  // Function to get adjusted price based on pricing type
  const getPrice = (basePrice) => {
    if (pricingType === 'monthly') {
      const numericPrice = parseInt(basePrice.replace('₹', ''));
      return `₹${numericPrice - 100}`;
    }
    return basePrice;
  };

  // Advertisement data
  const adBanners = [
    {
      id: 1,
      title: "50% OFF on Premium Packages",
      subtitle: "Limited Time Offer - Book Now!",
      bgColor: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Free Car Mats Cleaning",
      subtitle: "With Every Exterior Wash Package",
      bgColor: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      title: "Weekend Special Deals",
      subtitle: "Extra 20% Off on Saturday & Sunday",
      bgColor: "from-orange-500 to-red-500"
    },
    {
      id: 4,
      title: "Refer & Earn ₹100",
      subtitle: "For Every Successful Referral",
      bgColor: "from-purple-500 to-pink-500"
    }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Navigation functions for arrow controls
  const goToPrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < dealData.packages.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Navigation functions for monthly plans slider
  const goToPreviousMonthlyPlan = () => {
    if (monthlyPlansSlide > 0) {
      setMonthlyPlansSlide(monthlyPlansSlide - 1);
    }
  };

  const goToNextMonthlyPlan = () => {
    if (dealData.monthlyPlans && monthlyPlansSlide < dealData.monthlyPlans.length - 1) {
      setMonthlyPlansSlide(monthlyPlansSlide + 1);
    }
  };

  // Auto-slide functionality for advertisements
  useEffect(() => {
    const adAutoSlide = setInterval(() => {
      setAdSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= adBanners.length ? 0 : nextSlide;
      });
    }, 2500); // Different timing for ads

    return () => clearInterval(adAutoSlide);
  }, []);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !isDragging.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !isDragging.current) return;
    isDragging.current = false;
    
    const endX = e.changedTouches[0].pageX;
    const diffX = startX.current - endX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentSlide < dealData.packages.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (diffX < 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  // Touch handlers for monthly plans slider
  const handleMonthlyPlansTouch = {
    start: (e) => {
      if (!isMobile) return;
      isDragging.current = true;
      startX.current = e.touches[0].pageX;
    },
    move: (e) => {
      if (!isMobile || !isDragging.current) return;
      e.preventDefault();
    },
    end: (e) => {
      if (!isMobile || !isDragging.current) return;
      isDragging.current = false;
      
      const endX = e.changedTouches[0].pageX;
      const diffX = startX.current - endX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold && dealData.monthlyPlans) {
        if (diffX > 0 && monthlyPlansSlide < dealData.monthlyPlans.length - 1) {
          setMonthlyPlansSlide(monthlyPlansSlide + 1);
        } else if (diffX < 0 && monthlyPlansSlide > 0) {
          setMonthlyPlansSlide(monthlyPlansSlide - 1);
        }
      }
    }
  };

  return (
    <section
      className={
        isLuxury
          ? "py-16 min-h-screen bg-[#0a0a0a] text-white"
          : "py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen"
      }
      style={isLuxury ? { fontFamily: 'Montserrat, ui-sans-serif, system-ui' } : undefined}
    >
      <div className="container mx-auto px-4">
        {/* Advertisement Banner */}
        <div className={`relative mb-12 h-48 rounded-2xl overflow-hidden ${isLuxury ? 'bg-black/60 ring-1 ring-[#d4af37]/30' : ''}`}>
          <div 
            className={`flex h-full transition-transform duration-500 ease-in-out ${isLuxury ? 'bg-gradient-to-r from-black/60 to-black/30' : ''}`}
            style={{
              transform: `translateX(-${adSlide * 100}%)`,
            }}
          >
            {adBanners.map((ad) => (
              <div
                key={ad.id}
                className={`flex-shrink-0 w-full h-full ${isLuxury ? 'bg-black' : 'bg-gradient-to-r ' + ad.bgColor} flex items-center justify-center ${isLuxury ? 'text-[#d4af37]' : 'text-white'} relative`}
              >
                <div className="text-center px-6">
                  <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isLuxury ? 'font-[\'Playfair Display\'] text-[#d4af37]' : ''}`}>
                    {ad.title}
                  </h2>
                  <p className={`text-lg md:text-xl opacity-90 ${isLuxury ? 'text-white/80' : ''}`}>
                    {ad.subtitle}
                  </p>
                </div>
              </div>
            ))}
            </div>
            
            {/* Ad Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {adBanners.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === adSlide ? (isLuxury ? 'bg-[#d4af37]' : 'bg-white shadow-lg') : (isLuxury ? 'bg-white/30 hover:bg-white/50' : 'bg-white/50 hover:bg-white/70')}`}
                  onClick={() => setAdSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          {!isLuxury && (
            <div className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
              CAR WASH COMBOS
            </div>
          )}
          
          <h1
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : "text-gray-800"
            }`}
          >
            {dealData.title}
          </h1>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {dealData.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={
                isLuxury
                  ? "rounded-2xl overflow-hidden h-full bg-black/60 border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                  : "bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full"
              }
            >
              <div className="p-6 h-full flex flex-col">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className={`w-full h-48 object-cover rounded-lg mb-4 ${isLuxury ? 'ring-1 ring-[#d4af37]/30' : ''}`}
                />
                <h3 className={`text-xl font-bold mb-3 min-h-[3rem] ${isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : 'text-gray-800'}`}>
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className={`${isLuxury ? 'text-white/80 italic' : 'text-gray-600'} text-sm mb-4 italic`}>
                    {pkg.description}
                  </p>
                )}
                <div className="mb-4">
                  <h4 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Included Services:</h4>
                  <ul className="space-y-2 mb-4 flex-grow">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-500'} mr-2 text-lg leading-none mt-1`}>•</span>
                        <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(feature) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {pkg.foamUpgrades && (
                  <div className={`mb-4 p-3 rounded-lg ${isLuxury ? 'bg-black/50 border border-[#d4af37]/20' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold mb-2 text-sm ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Foam Upgrade Options:</h4>
                    <div className="space-y-1">
                      {pkg.foamUpgrades.map((foam, index) => (
                        <div key={index} className={`text-xs ${isLuxury ? 'text-white/80' : 'text-gray-600'}`}>
                          <span className={`font-medium ${isLuxury ? 'text-[#d4af37]' : ''}`}>{foam.name}</span> - ₹{foam.price}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-center mt-auto">
                  <div className={`text-2xl font-bold mb-4 ${isLuxury ? 'text-[#d4af37]' : 'text-blue-500'}`}>
                    {getPrice(pkg.price)}
                  </div>
                  <button
                    onClick={() => handleBookNow(pkg)}
                    className={
                      isLuxury
                        ? "w-full bg-black border border-[#d4af37] text-[#d4af37] font-semibold py-3 px-6 rounded-lg hover:bg-[#0f0f0f] hover:shadow-[0_0_10px_rgba(212,175,55,0.4)] transition"
                        : "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    }
                  >
                    Book Now
                  </button>
                  {isLuxury && (
                    <div className="mt-3 text-center">
                      <span className="inline-block text-sm italic font-semibold text-[#d4af37] underline">
                        🎁 FREE: Premium Air Freshener
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider Layout */}
        <div className="md:hidden relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            disabled={currentSlide === 0}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
              currentSlide === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:shadow-xl'
            }`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            disabled={currentSlide === dealData.packages.length - 1}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
              currentSlide === dealData.packages.length - 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:shadow-xl'
            }`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden px-12">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {dealData.packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="flex-shrink-0 w-full px-4"
                >
                  <div className={`${isLuxury ? 'bg-black/60 border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-white shadow-lg'} rounded-2xl overflow-hidden max-w-sm mx-auto h-full`}>
                    <div className="p-6 h-full flex flex-col">
                      <div className={`w-full h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden ${isLuxury ? 'ring-1 ring-[#d4af37]/30 bg-black/30' : 'bg-gray-50'}`}>
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <h3 className={`text-xl font-bold mb-4 min-h-[3rem] ${isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : 'text-gray-800'}`}>
                        {pkg.name}
                      </h3>
                      <ul className="space-y-2 mb-6 flex-grow">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-500'} mr-2 text-lg leading-none`}>•</span>
                            <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(feature) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-center mt-auto">
                        <div className={`text-2xl font-bold mb-4 ${isLuxury ? 'text-[#d4af37]' : 'text-blue-500'}`}>
                          {getPrice(pkg.price)}
                        </div>
                        <button
                          onClick={() => handleBookNow(pkg)}
                          className={
                            isLuxury
                              ? "w-full bg-black border border-[#d4af37] text-[#d4af37] font-semibold py-3 px-6 rounded-lg hover:bg-[#0f0f0f] hover:shadow-[0_0_10px_rgba(212,175,55,0.4)] transition"
                              : "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                          }
                        >
                          Book Now
                        </button>
                        {isLuxury && (
                          <div className="mt-3 text-center">
                            <span className="inline-block text-sm italic font-semibold text-[#d4af37] underline">
                              🎁 FREE: Premium Air Freshener
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Availability Section */}
        <div className={`mt-12 rounded-2xl p-6 ${isLuxury ? 'bg-black/60 border border-[#d4af37]/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
            <h3 className={`text-xl font-bold mb-4 text-center ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-800'}`}>Service Availability</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${isLuxury ? 'bg-black border border-[#d4af37]/40' : 'bg-green-100'}`}>
                  <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-600'} font-bold`}>✓</span>
                </div>
                <h4 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37]" : 'text-gray-700'}`}>Free Service</h4>
                <p className={`${isLuxury ? 'text-white/80' : 'text-gray-600'}`}>{serviceInfo.availability}</p>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${isLuxury ? 'bg-black border border-[#d4af37]/40' : 'bg-blue-100'}`}>
                  <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-blue-600'} font-bold`}>₹</span>
                </div>
                <h4 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37]" : 'text-gray-700'}`}>Extra Charges</h4>
                <div className="space-y-1">
                  {serviceInfo.extraCharges.map((charge, index) => (
                    <p key={index} className={`${isLuxury ? 'text-white/80' : 'text-gray-600'} text-sm`}>
                      {charge.distance} → {charge.charge}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

        {/* Requirements Notice (water & power) */}
        <div className="mt-8">
          <p className={`${isLuxury ? 'text-[#d4af37] italic font-semibold text-center' : 'text-red-600 text-center font-semibold'}`}>
            Note: For every wash, please ensure 2 buckets of water and a power supply are available at the service location.
          </p>
        </div>

        {/* Monthly Plans Section */}
        {dealData.monthlyPlans && (
          <div className="mt-12">
            <h3 className={`text-2xl font-bold text-center mb-8 ${isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : 'text-gray-800'}`}>
              Monthly Car Wash Plans – {getCategoryDisplayName()}
            </h3>
            <p className={`text-center mb-8 ${isLuxury ? 'text-white/80' : 'text-gray-600'}`}>
              Maintain Your Car's Shine – All Month Long! Affordable and convenient subscription packages with premium service quality.
            </p>
            
            {/* Desktop Grid Layout */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
              {dealData.monthlyPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl overflow-hidden relative h-full flex flex-col ${
                    isLuxury
                      ? 'bg-black/60 border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'bg-white shadow-lg hover:shadow-xl transition-shadow'
                  } ${plan.id === 'gold' && !isLuxury ? 'ring-2 ring-yellow-400' : ''} ${
                    isLuxury && plan.id === 'gold' ? 'ring-1 ring-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.25)]' : ''
                  } ${isLuxury && plan.id === 'platinum' ? 'ring-2 ring-[#d4af37] outline outline-1 outline-[#d4af37]/50' : ''}`}
                >
                  {plan.id === 'gold' && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${isLuxury ? 'bg-[#d4af37] text-black' : 'bg-yellow-400 text-yellow-900'}`}>
                      POPULAR
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <h4 className={`text-xl font-bold mb-2 ${isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : 'text-gray-800'}`}>{plan.name}</h4>
                      <div className={`text-3xl font-bold mb-2 ${isLuxury ? 'text-[#d4af37]' : 'text-blue-500'}`}>{plan.price}</div>
                      <p className={`${isLuxury ? 'text-white/80' : 'text-gray-600'} text-sm`}>{plan.description}</p>
                    </div>

                    <div className="space-y-4 flex-1">
                      {/* Plan Features */}
                      <div>
                        <h5 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Plan Features:</h5>
                        <ul className="space-y-1">
              {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-500'} mr-2 text-sm`}>•</span>
                <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(feature) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Each Wash Includes */}
                      {((Array.isArray(plan.washIncludes) && plan.washIncludes.length > 0) ||
                        (Array.isArray(plan.weeklyIncludes) && plan.weeklyIncludes.length > 0)) && (
                        <div>
                          <h5 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Each Wash Includes:</h5>
                          <ul className="space-y-1">
              {(Array.isArray(plan.washIncludes) ? plan.washIncludes : plan.weeklyIncludes).map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-blue-500'} mr-2 text-sm`}>•</span>
                <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(item) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Additional Services */}
                      {Array.isArray(plan.biWeeklyIncludes) && plan.biWeeklyIncludes.length > 0 && (
                        <div>
          <h5 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Additional Services:</h5>
                          <ul className="space-y-1">
                            {plan.biWeeklyIncludes.map((item, index) => (
                              <li key={index} className="flex items-start">
            <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-purple-500'} mr-2 text-sm`}>•</span>
            <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(item) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Monthly Bonuses */}
                      {Array.isArray(plan.monthlyBonuses) && plan.monthlyBonuses.length > 0 && (
                        <div>
          <h5 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Monthly Bonuses:</h5>
                          <ul className="space-y-1">
                            {plan.monthlyBonuses.map((bonus, index) => (
                              <li key={index} className="flex items-start">
            <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-yellow-500'} mr-2 text-sm`}>•</span>
            <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(bonus) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{bonus}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Premium Extras */}
                      {Array.isArray(plan.platinumExtras) && plan.platinumExtras.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Premium Extras:</h5>
                          <ul className="space-y-1">
              {plan.platinumExtras.map((extra, index) => (
                              <li key={index} className="flex items-start">
                <span className="text-purple-500 mr-2 text-sm">•</span>
                <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(extra) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{extra}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Button and Terms - Fixed at bottom */}
                    <div className="mt-6">
                      <button 
                        onClick={() => {
                          // Handle monthly plan booking
                          const planPackage = {
                            id: plan.id,
                            name: plan.name,
                            price: plan.price,
                            features: plan.features,
                            // Include all monthly plan detail sections so they reach cart/order
                            washIncludes: plan.washIncludes || [],
                            weeklyIncludes: plan.weeklyIncludes || [],
                            biWeeklyIncludes: plan.biWeeklyIncludes || [],
                            monthlyBonuses: plan.monthlyBonuses || [],
                            platinumExtras: plan.platinumExtras || [],
                            type: 'monthly_plan',
                            // Use category specific representative image (avoid always showing hatchback)
                            image: getCategoryBaseImage()
                          };
                          handleBookNow(planPackage);
                        }}
                        className={
                          isLuxury
                            ? 'w-full font-semibold py-3 px-6 rounded-lg border border-[#d4af37] text-[#d4af37] bg-black hover:bg-[#0f0f0f] hover:shadow-[0_0_10px_rgba(212,175,55,0.4)] transition'
                            : `w-full font-bold py-3 px-6 rounded-lg transition-colors ${
                                plan.id === 'gold' 
                                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                  : plan.id === 'platinum'
                                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                  : 'bg-gray-500 hover:bg-gray-600 text-white'
                              }`
                        }
                      >
                        Subscribe to {plan.name}
                      </button>
                    </div>

                    <div className="mt-3 text-center">
                      <p className={`text-xs ${isLuxury ? 'text-white/60' : 'text-gray-500'}`}>
                        Valid for 30 days from date of first wash
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Slider Layout */}
            <div className="md:hidden relative">
              {/* Left Arrow */}
              <button
                onClick={goToPreviousMonthlyPlan}
                disabled={monthlyPlansSlide === 0}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                  monthlyPlansSlide === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={goToNextMonthlyPlan}
                disabled={monthlyPlansSlide === dealData.monthlyPlans.length - 1}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                  monthlyPlansSlide === dealData.monthlyPlans.length - 1 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="overflow-hidden px-12">
                <div
                  ref={monthlyPlansRef}
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${monthlyPlansSlide * 100}%)`,
                  }}
                  onTouchStart={handleMonthlyPlansTouch.start}
                  onTouchMove={handleMonthlyPlansTouch.move}
                  onTouchEnd={handleMonthlyPlansTouch.end}
                >
                  {dealData.monthlyPlans.map((plan, index) => (
                    <div
                      key={plan.id}
                      className="flex-shrink-0 w-full px-4"
                    >
                      <div className={`rounded-2xl overflow-hidden max-w-sm mx-auto h-full relative ${
                        isLuxury
                          ? 'bg-black/60 border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                          : 'bg-white shadow-lg'
                      } ${plan.id === 'gold' && !isLuxury ? 'ring-2 ring-yellow-400' : ''}`}>
                        {plan.id === 'gold' && (
                          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${isLuxury ? 'bg-[#d4af37] text-black' : 'bg-yellow-400 text-yellow-900'}`}>
                            POPULAR
                          </div>
                        )}
                        
                        <div className="p-6 h-full flex flex-col">
                          <div className="text-center mb-6">
                            <h4 className={`text-xl font-bold mb-2 ${isLuxury ? "text-[#d4af37] font-['Playfair Display',serif]" : 'text-gray-800'}`}>{plan.name}</h4>
                            <div className={`text-3xl font-bold mb-2 ${isLuxury ? 'text-[#d4af37]' : 'text-blue-500'}`}>{plan.price}</div>
                            <p className={`${isLuxury ? 'text-white/80' : 'text-gray-600'} text-sm`}>{plan.description}</p>
                          </div>

                          <div className="space-y-4 flex-1">
                            {/* Plan Features */}
                            <div>
                              <h5 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Plan Features:</h5>
                              <ul className="space-y-1">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-green-500'} mr-2 text-sm`}>•</span>
                                    <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(feature) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Each Wash Includes */}
                            {((Array.isArray(plan.washIncludes) && plan.washIncludes.length > 0) ||
                              (Array.isArray(plan.weeklyIncludes) && plan.weeklyIncludes.length > 0)) && (
                              <div>
                                <h5 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Each Wash Includes:</h5>
                                <ul className="space-y-1">
                                  {(Array.isArray(plan.washIncludes) ? plan.washIncludes : plan.weeklyIncludes).map((item, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-blue-500'} mr-2 text-sm`}>•</span>
                                      <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(item) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Show bonuses if available */}
                            {Array.isArray(plan.monthlyBonuses) && plan.monthlyBonuses.length > 0 && (
                              <div>
                                <h5 className={`font-semibold mb-2 ${isLuxury ? "text-[#d4af37] font-['Cinzel',serif]" : 'text-gray-700'}`}>Monthly Bonuses:</h5>
                                <ul className="space-y-1">
                                  {plan.monthlyBonuses.map((bonus, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className={`${isLuxury ? 'text-[#d4af37]' : 'text-yellow-500'} mr-2 text-sm`}>•</span>
                                      <span className={`${isLuxury ? 'text-white/90' : (/free/i.test(bonus) ? 'text-[#d4af37] italic font-semibold' : 'text-gray-600')} text-sm`}>{bonus}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Button and Terms - Fixed at bottom */}
                          <div className="mt-6">
                            <button 
                              onClick={() => {
                                // Handle monthly plan booking
                                const planPackage = {
                                  id: plan.id,
                                  name: plan.name,
                                  price: plan.price,
                                  features: plan.features,
                                  // Include all monthly plan detail sections so they reach cart/order
                                  washIncludes: plan.washIncludes || [],
                                  weeklyIncludes: plan.weeklyIncludes || [],
                                  biWeeklyIncludes: plan.biWeeklyIncludes || [],
                                  monthlyBonuses: plan.monthlyBonuses || [],
                                  platinumExtras: plan.platinumExtras || [],
                                  type: 'monthly_plan',
                                  // Use category specific representative image
                                  image: getCategoryBaseImage()
                                };
                                handleBookNow(planPackage);
                              }}
                              className={
                                isLuxury
                                  ? 'w-full font-semibold py-3 px-6 rounded-lg border border-[#d4af37] text-[#d4af37] bg-black hover:bg-[#0f0f0f] hover:shadow-[0_0_10px_rgba(212,175,55,0.4)] transition'
                                  : `w-full font-bold py-3 px-6 rounded-lg transition-colors ${
                                      plan.id === 'gold' 
                                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                        : plan.id === 'platinum'
                                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                                    }`
                              }
                            >
                              Subscribe to {plan.name}
                            </button>
                          </div>

                          <div className="mt-3 text-center">
                            <p className={`text-xs ${isLuxury ? 'text-white/60' : 'text-gray-500'}`}>
                              Valid for 30 days from date of first wash
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator for Mobile */}
              <div className="flex justify-center mt-6 space-x-2">
                {dealData.monthlyPlans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setMonthlyPlansSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === monthlyPlansSlide ? (isLuxury ? 'bg-[#d4af37] scale-125' : 'bg-blue-600 scale-125') : (isLuxury ? 'bg-white/30 hover:bg-white/50' : 'bg-gray-400 hover:bg-gray-500')}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className={`${isLuxury ? 'text-white/70' : 'text-gray-600'} text-sm`}>
                <strong>Terms:</strong> Valid for 30 days from date of first wash • Advance booking preferred • Add-on services available at discounted rates for members
              </p>
            </div>
          </div>
        )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-lg font-semibold">{getCategoryDisplayName()}</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Car Image Slider */}
            <div className="relative bg-gray-100 h-80 overflow-hidden">
              {/* Left Arrow */}
              <button
                onClick={() => modalCurrentSlide > 0 && setModalCurrentSlide(modalCurrentSlide - 1)}
                disabled={modalCurrentSlide === 0}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                  modalCurrentSlide === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => modalCurrentSlide < carWashDetails.slides.length - 1 && setModalCurrentSlide(modalCurrentSlide + 1)}
                disabled={modalCurrentSlide === carWashDetails.slides.length - 1}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                  modalCurrentSlide === carWashDetails.slides.length - 1 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div 
                className="flex h-full transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translateX(-${modalCurrentSlide * 100}%)`,
                }}
                onTouchStart={handleModalTouchStart}
                onTouchMove={handleModalTouchMove}
                onTouchEnd={handleModalTouchEnd}
                onMouseDown={handleModalMouseDown}
                onMouseMove={handleModalMouseMove}
                onMouseUp={handleModalMouseUp}
                onMouseLeave={handleModalMouseUp}
              >
                {carWashDetails.slides.map((slide, index) => (
                  <div key={slide.id} className="flex-shrink-0 w-full h-full flex items-center justify-center p-8">
                    <img 
                      src={selectedPackage?.image || getCategoryBaseImage()} 
                      alt={slide.title}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {carWashDetails.slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setModalCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === modalCurrentSlide 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-gray-400 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Service Types Display */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                {carWashDetails.slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setModalCurrentSlide(index)}
                    className={`transition-colors duration-200 hover:text-blue-500 cursor-pointer ${
                      index === modalCurrentSlide ? 'text-blue-600 font-semibold' : ''
                    }`}
                  >
                    {slide.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Great Cars Deserve Great Care
              </h1>
              
              <div className="flex space-x-3 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  100% Stain removal
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Efficient
                </span>
              </div>

              {/* Car Overview */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Car Overview</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    Kindly note that water will be provided by owner.
                  </p>
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Explore Add-ons</h2>
                <div className="space-y-3">
                  {addons.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`addon-${addon.id}`}
                          checked={Boolean(selectedAddons.find(item => item.id === addon.id))}
                          onChange={() => handleAddonToggle(addon)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`addon-${addon.id}`} className="ml-3 text-gray-800 font-medium">
                          {addon.name}
                        </label>
                      </div>
                      <span className="font-semibold text-gray-800">₹{addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Package</span>
                  <span className="text-gray-800">{selectedPackage?.price || '₹199'}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Add-ons</span>
                  <span className="text-gray-800">₹{getAddonsTotal()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-600">Total</span>
                    <span className="text-xl font-bold text-blue-600">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <SigninModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSuccess}
        />
      )}
      {/* Full Body Checkup (Car) */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-blue-50 py-16 px-4 md:px-10 mt-16 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif bg-gradient-to-r from-blue-700 to-amber-500 bg-clip-text text-transparent mb-4">BFS Full Body Car Checkup</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">Complimentary visual health assessment done alongside selected wash packages. Helps you stay ahead on safety &amp; maintenance.</p>
          </div>
          <FullBodyCheckup type="car" />
          <div className="mt-10 text-center text-xs text-gray-500">Disclaimer: Visual inspection only. For mechanical faults please consult an authorized service center.</div>
        </div>
      </section>
    </section>
  );
}
