export const SERVICE_CATEGORIES = [
  {
    id: 'car-wash',
    name: 'Car Wash',
    icon: 'car-wash',
    color: '#0A1F44',
    bgColor: '#E8EEF8',
  },
  {
    id: 'bike-wash',
    name: 'Bike Wash',
    icon: 'motorbike',
    color: '#00D4FF',
    bgColor: '#E0FAFF',
  },
  {
    id: 'helmet-wash',
    name: 'Helmet Wash',
    icon: 'motorbike',
    color: '#FF7A00',
    bgColor: '#FFF0E5',
  },
  {
    id: 'puc',
    name: 'PUC Certificate',
    icon: 'file-certificate',
    color: '#10B981',
    bgColor: '#E6F9F4',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: 'shield-check',
    color: '#8B5CF6',
    bgColor: '#F0EBFF',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'wrench',
    color: '#F59E0B',
    bgColor: '#FEF9EC',
  },
];

export const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export const VEHICLE_TYPES = [
  {id: 'hatchback', label: 'Hatchback'},
  {id: 'sedan', label: 'Sedan'},
  {id: 'suv', label: 'SUV'},
  {id: 'bike', label: 'Bike'},
  {id: 'scooty', label: 'Scooty'},
];

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BANNERS = [
  {
    id: 1,
    title: 'Premium Car Wash',
    subtitle: 'Starting at ₹299',
    gradient: ['#0A1F44', '#1A4080'],
    tag: '20% OFF',
  },
  {
    id: 2,
    title: 'Bike Cleaning',
    subtitle: 'Deep clean & polish',
    gradient: ['#00D4FF', '#0090B0'],
    tag: 'Popular',
  },
  {
    id: 3,
    title: 'PUC Certificate',
    subtitle: 'Quick & Hassle-free',
    gradient: ['#FF7A00', '#CC5500'],
    tag: 'Fast',
  },
];

export const POPULAR_SERVICES = [
  {
    id: 's1',
    name: 'Premium Car Wash',
    category: 'Car Wash',
    price: 499,
    rating: 4.8,
    reviews: 234,
    duration: '45 min',
    image: null,
  },
  {
    id: 's2',
    name: 'Bike Deep Clean',
    category: 'Bike Wash',
    price: 199,
    rating: 4.7,
    reviews: 189,
    duration: '30 min',
    image: null,
  },
  {
    id: 's3',
    name: 'Helmet Sanitize',
    category: 'Helmet Wash',
    price: 99,
    rating: 4.6,
    reviews: 121,
    duration: '20 min',
    image: null,
  },
  {
    id: 's4',
    name: 'PUC Certificate',
    category: 'PUC',
    price: 149,
    rating: 4.9,
    reviews: 567,
    duration: '15 min',
    image: null,
  },
];
