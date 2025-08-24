import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Phone, MapPin, ChevronDown, ArrowRight, Star, Shield, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCategories from './services/ServiceCategories';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { useAuth } from '../../components/AuthContext';
import { useCart } from '../../components/CartContext';
import { addressAPI } from '../../api/address';

const FAQS = [
	{
		question: 'How do I request a laundry pickup?',
		answer:
			'You can request a laundry pickup by filling out the callback form on this page or by contacting us via WhatsApp. Our team will schedule a convenient pickup time for you.',
	},
	{
		question: 'What services does Bubble Flash offer?',
		answer:
			'Bubble Flash offers laundry, car cleaning, and bike cleaning services. You can book any of these services online or by contacting our support team.',
	},
	{
		question: 'What are your operating hours?',
		answer:
			'We operate between 9 AM and 8 PM from Monday to Saturday, and 10 AM to 6 PM on Sundays.',
	},
];

const testimonials = [
	{
		name: 'Michael brown',
		img: 'https://randomuser.me/api/portraits/men/32.jpg',
		stars: 4,
		text: 'Really impressed with the car wash service at Bubble Flash Car Wash! The team was professional, friendly, and detailed in their work. My car looked spotless afterward.',
	},
	{
		name: 'Meera goyal',
		img: 'https://randomuser.me/api/portraits/women/44.jpg',
		stars: 5,
		text: 'Tried Bubble Flash Laundry for the first time and was genuinely impressed! My clothes came back fresh, neatly folded, and smelled amazing. The pickup and delivery were smooth and right on time.',
	},
	{
		name: 'Rahul Sharma',
		img: 'https://randomuser.me/api/portraits/men/45.jpg',
		stars: 5,
		text: 'Excellent bike cleaning! My bike looks brand new. Fast service and very convenient.',
	},
	{
		name: 'Priya Singh',
		img: 'https://randomuser.me/api/portraits/women/65.jpg',
		stars: 4,
		text: 'The laundry service is top-notch. Pickup and delivery were on time, and the clothes were perfectly cleaned.',
	},
	{
		name: 'Amit Verma',
		img: 'https://randomuser.me/api/portraits/men/77.jpg',
		stars: 5,
		text: 'Very happy with the car wash. Staff is polite and the process is hassle-free.',
	},
	{
		name: 'Sneha Patel',
		img: 'https://randomuser.me/api/portraits/women/32.jpg',
		stars: 5,
		text: 'Affordable and reliable laundry service. Highly recommended!',
	},
];

export default function HeroSection() {
	const { user } = useAuth();
	const { addToCart } = useCart();
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [pickupDate, setPickupDate] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [fullAddress, setFullAddress] = useState('');
	const [addressData, setAddressData] = useState(null); // Store complete address data
	// Add state for FAQ and testimonials carousel
	const [openIdx, setOpenIdx] = useState(-1); // Changed from 0 to -1 so no FAQ is open by default
	const [visibleCount, setVisibleCount] = useState(4);
	const [carousel, setCarousel] = useState(testimonials);
	const [accessorySlide, setAccessorySlide] = useState(0);
	const [isDraggingState, setIsDraggingState] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const accessorySliderRef = useRef(null);
	const startX = useRef(0);
	const startTime = useRef(0);
	const isDragging = useRef(false);

	useEffect(() => {
		// Get current location using the new address API
		const getCurrentLocation = async () => {
			try {
				// Check if geolocation is available
				if (!navigator.geolocation) {
					console.warn('Geolocation is not supported by this browser');
					setFullAddress('Bengaluru, India');
					setSelectedLocation('Bengaluru, India');
					return;
				}

				// Check if we're on HTTPS (required for geolocation in production)
				if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
					console.warn('Geolocation requires HTTPS');
					setFullAddress('Bengaluru, India');
					setSelectedLocation('Bengaluru, India');
					return;
				}

				const result = await addressAPI.getCurrentAddress();
				if (result.success) {
					setFullAddress(result.data.fullAddress);
					setSelectedLocation(result.data.fullAddress);
					setAddressData(result.data);
				} else {
					console.log('Failed to get current location:', result.message);
					// Show user-friendly message for permission issues
					if (result.message && result.message.includes('denied')) {
						console.info('Location permission denied. Using default location.');
					}
					// Fallback to default location
					setFullAddress('Bengaluru, India');
					setSelectedLocation('Bengaluru, India');
				}
			} catch (error) {
				console.error('Error getting current location:', error);
				// Fallback to default location
				setFullAddress('Bengaluru, India');
				setSelectedLocation('Bengaluru, India');
			}
		};

		getCurrentLocation();
	}, []);

	// Responsive visibleCount for testimonials
	useEffect(() => {
		function handleResize() {
			const isMobileView = window.innerWidth < 768;
			setIsMobile(isMobileView);
			
			if (window.innerWidth < 640) {
				setVisibleCount(1);
			} else if (window.innerWidth < 1024) {
				setVisibleCount(2);
			} else {
				setVisibleCount(4);
			}
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Auto-slide functionality for accessories slider


	useEffect(() => {
		const interval = setInterval(() => {
			setCarousel(prev => {
				const [first, ...rest] = prev;
				return [...rest, first];
			});
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const categories = ['Car Wash', 'Bike Wash', 'Laundry Service', 'Helmet'];
	const locations = [fullAddress || 'Bengaluru, India', 'Chennai, India'];

	// Car wash accessories data
	const accessories = [
		{
			img: '/aboutus/car-spray.png',
			title: 'Hoora car spray',
			price: 99,
			oldPrice: 150,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 99 only',
		},
		{
			img: '/car/car2.png',
			title: 'Microfiber Towel',
			price: 120,
			oldPrice: 200,
			offer: '40%offer',
			stars: 3,
			tag: '₹ 120 only',
		},
		{
			img: '/car/car3.png',
			title: 'Car Shampoo',
			price: 80,
			oldPrice: 160,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 80 only',
		},
		{
			img: '/car/car1.png',
			title: 'Tyre Cleaner',
			price: 110,
			oldPrice: 220,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 110 only',
		},
		{
			img: '/car/car2.png',
			title: 'Glass Cleaner',
			price: 90,
			oldPrice: 180,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 90 only',
		},
		{
			img: '/car/car3.png',
			title: 'Dashboard Polish',
			price: 150,
			oldPrice: 300,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 150 only',
		},
		{
			img: '/car/car1.png',
			title: 'Foam Sprayer',
			price: 180,
			oldPrice: 360,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 180 only',
		},
		{
			img: '/car/car2.png',
			title: 'Wheel Brush',
			price: 70,
			oldPrice: 140,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 70 only',
		},
		{
			img: '/car/car3.png',
			title: 'Leather Cleaner',
			price: 200,
			oldPrice: 400,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 200 only',
		},
	];

	// Navigation for individual cards (mobile: 1 card, desktop: 3 cards)
	const cardsPerSlide = isMobile ? 1 : 3;
	const totalSlides = accessories.length; // Total number of individual items
	
	const handleDotClick = idx => setAccessorySlide(idx);
	const handlePrev = () =>
		setAccessorySlide(s => (s - 1 + totalSlides) % totalSlides);
	const handleNext = () => setAccessorySlide(s => (s + 1) % totalSlides);

	// Enhanced touch handlers for mobile dragging
	const handleTouchStart = (e) => {
		if (!isMobile) return;
		isDragging.current = true;
		setIsDraggingState(true);
		startX.current = e.touches[0].pageX;
		startTime.current = Date.now();
	};

	const handleTouchMove = (e) => {
		if (!isMobile || !isDragging.current) return;
		e.preventDefault();
		
		const currentX = e.touches[0].pageX;
		const diffX = startX.current - currentX;
		const movePercent = (diffX / window.innerWidth) * 100;
		
		// Apply temporary transform for visual feedback
		const container = e.currentTarget.querySelector('.slider-container');
		if (container) {
			const currentTransform = -accessorySlide * 100;
			container.style.transform = `translateX(${currentTransform - movePercent}%)`;
		}
	};

	const handleTouchEnd = (e) => {
		if (!isMobile || !isDragging.current) return;
		isDragging.current = false;
		setIsDraggingState(false);
		
		const endX = e.changedTouches[0].pageX;
		const diffX = startX.current - endX;
		const threshold = 50;
		const swipeSpeed = Math.abs(diffX) / (Date.now() - startTime.current);
		
		// Reset transform
		const container = e.currentTarget.querySelector('.slider-container');
		if (container) {
			container.style.transform = '';
		}
		
		// Determine direction and trigger slide change
		if (Math.abs(diffX) > threshold || swipeSpeed > 0.5) {
			if (diffX > 0) {
				// Swipe left - go to next (with infinite loop)
				handleNext();
			} else {
				// Swipe right - go to previous (with infinite loop)
				handlePrev();
			}
		}
	};

	const handleAddToCart = (item) => {
		if (!user) {
			alert('Please login to add items to cart');
			return;
		}
		
		const cartItem = {
			id: `accessory-${item.title}-${Date.now()}`,
			title: item.title,
			price: item.price,
			oldPrice: item.oldPrice,
			offer: item.offer,
			stars: item.stars,
			img: item.img
		};
		
		addToCart(cartItem);
		alert(`${item.title} added to cart!`);
	};

	// Handle address selection from autocomplete
	const handleAddressSelect = (selectedAddress) => {
		setFullAddress(selectedAddress.fullAddress);
		setSelectedLocation(selectedAddress.fullAddress);
		setAddressData(selectedAddress);
	};

	const handleBookService = () => {
		// Validate all required fields
		if (!selectedCategory) {
			alert('Please select a service category');
			return;
		}
		if (!pickupDate) {
			alert('Please select a pickup date');
			return;
		}
		if (!phoneNumber) {
			alert('Please enter your phone number');
			return;
		}
		if (!fullAddress || !selectedLocation) {
			alert('Please enter your location');
			return;
		}

		// Store booking data in localStorage for the service page to use
		const bookingData = {
			category: selectedCategory,
			pickupDate,
			phoneNumber,
			address: fullAddress,
			location: selectedLocation,
			addressData: addressData, // Include complete address data
			timestamp: Date.now()
		};
		localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

		// Navigate based on selected category
		switch (selectedCategory) {
			case 'Car Wash':
				navigate('/cars');
				break;
			case 'Bike Wash':
				navigate('/bikes');
				break;
			case 'Laundry Service':
				navigate('/laundry');
				break;
			case 'Helmet':
				navigate('/helmets');
				break;
			default:
				alert('Please select a valid service category');
		}
	};

	return (
		<>
			{/* Hero Section with Modern Design */}
			<section className="relative min-h-screen bg-gradient-to-br from-[#1F3C88] via-[#2952A3] to-[#1F3C88] overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0">
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
							rotate: [0, 5, 0],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute top-10 right-10 w-72 h-72 bg-[#FFB400] rounded-full opacity-10 blur-3xl"
					/>
					<motion.div
						animate={{
							scale: [1.1, 1, 1.1],
							rotate: [0, -5, 0],
						}}
						transition={{
							duration: 15,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute bottom-10 left-10 w-96 h-96 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
					/>
				</div>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
					<div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
						
						{/* Left Column - Hero Content */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							className="text-white space-y-8"
						>
							{/* Badge */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.6 }}
								className="inline-flex items-center px-4 py-2 bg-[#FFB400] bg-opacity-20 backdrop-blur-sm rounded-full border border-[#FFB400] border-opacity-30"
							>
								<Star className="w-4 h-4 text-[#FFB400] mr-2" />
								<span className="text-sm font-medium text-[#FFB400]">
									Trusted by 2000+ customers
								</span>
							</motion.div>

							{/* Main Heading */}
							<motion.h1
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.8 }}
								className="text-4xl md:text-6xl font-bold leading-tight"
							>
								Professional
								<span className="block text-[#FFB400]">Cleaning Services</span>
								<span className="block text-3xl md:text-4xl font-normal text-gray-200">
									for Cars, Bikes & More
								</span>
							</motion.h1>

							{/* Subtitle */}
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.8 }}
								className="text-xl text-gray-200 leading-relaxed max-w-xl"
							>
								Experience top-tier car wash, bike detailing, and laundry care – all under one roof in Bengaluru. Quality service, every time.
							</motion.p>

							{/* CTA Buttons */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8, duration: 0.8 }}
								className="flex flex-col sm:flex-row gap-4"
							>
								<motion.button
									whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 180, 0, 0.3)" }}
									whileTap={{ scale: 0.95 }}
									className="px-8 py-4 bg-[#FFB400] text-[#1F3C88] font-bold rounded-2xl shadow-lg hover:bg-[#e0a000] transition-colors flex items-center justify-center gap-2"
								>
									View Services
									<ArrowRight className="w-5 h-5" />
								</motion.button>
								{/* <motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="px-8 py-4 border-2 border-white border-opacity-30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white hover:bg-opacity-10 transition-colors"
								>
									View Services
								</motion.button> */}
							</motion.div>

							{/* Stats */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1, duration: 0.8 }}
								className="grid grid-cols-3 gap-8 pt-8"
							>
								<div>
									<div className="text-2xl font-bold text-[#FFB400]">200K+</div>
									<div className="text-sm text-gray-300">Happy Customers</div>
								</div>
								<div>
									<div className="text-2xl font-bold text-[#FFB400]">24/7</div>
									<div className="text-sm text-gray-300">Service Available</div>
								</div>
								<div>
									<div className="text-2xl font-bold text-[#FFB400]">100%</div>
									<div className="text-sm text-gray-300">Satisfaction</div>
								</div>
							</motion.div>
						</motion.div>

						{/* Right Column - Booking Form */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4, duration: 0.8 }}
							className="relative"
						>
							<div className="bg-white rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-gray-200">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6, duration: 0.6 }}
								>
									<h3 className="text-2xl font-bold text-[#1F3C88] mb-2 text-center">
										Book Your Service
									</h3>
									<p className="text-gray-600 text-center mb-8">
										Quick & Easy booking in 3 steps
									</p>
								</motion.div>

								<div className="space-y-6">
									{/* Service Category */}
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.8, duration: 0.6 }}
									>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Select Service
										</label>
										<div className="relative">
											<select
												value={selectedCategory}
												onChange={(e) => setSelectedCategory(e.target.value)}
												className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none transition-colors bg-white text-gray-700 font-medium"
											>
												<option value="">Choose your service</option>
												{categories.map((category) => (
													<option key={category} value={category}>
														{category}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										</div>
									</motion.div>

									{/* Location */}
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.9, duration: 0.6 }}
									>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Your Location
										</label>
										<div className="relative">
											<div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-[#FFB400] transition-colors">
												<MapPin className="ml-4 w-5 h-5 text-gray-400" />
												<div className="flex-1">
													<AddressAutocomplete
														onAddressSelect={handleAddressSelect}
														placeholder="Enter your location"
														initialValue={fullAddress}
													/>
												</div>
											</div>
										</div>
									</motion.div>

									{/* Pickup Date */}
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 1, duration: 0.6 }}
									>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Pickup Date
										</label>
										<div className="relative">
											<Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
											<input
												type="date"
												value={pickupDate}
												onChange={(e) => setPickupDate(e.target.value)}
												className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none transition-colors"
												min={new Date().toISOString().split('T')[0]}
											/>
										</div>
									</motion.div>

									{/* Phone Number */}
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 1.1, duration: 0.6 }}
									>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Phone Number
										</label>
										<div className="relative">
											<Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
											<input
												type="tel"
												value={phoneNumber}
												onChange={(e) => setPhoneNumber(e.target.value)}
												placeholder="Enter your phone number"
												className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FFB400] focus:outline-none transition-colors"
											/>
										</div>
									</motion.div>

									{/* Book Button */}
									<motion.button
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.2, duration: 0.6 }}
										whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255, 180, 0, 0.3)" }}
										whileTap={{ scale: 0.98 }}
										onClick={handleBookService}
										className="w-full py-4 bg-gradient-to-r from-[#FFB400] to-[#e0a000] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
									>
										Book Your Service
									</motion.button>

									{/* Service Info */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.3, duration: 0.6 }}
										className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4"
									>
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4 text-[#FFB400]" />
											<span>Quick Service</span>
										</div>
										<div className="flex items-center gap-2">
											<Shield className="w-4 h-4 text-[#FFB400]" />
											<span>100% Safe</span>
										</div>
									</motion.div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h2 className="text-4xl font-bold text-[#1F3C88] mb-4">
							Why Choose Bubble Flash?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							We deliver exceptional service quality with modern convenience
						</p>
					</motion.div>

					<div className="grid md:grid-cols-4 gap-8">
						{[
							{
								icon: Shield,
								title: "100% Safe & Secure",
								description: "Your safety is our priority with verified professionals"
							},
							{
								icon: Clock,
								title: "Fast & Reliable",
								description: "Quick turnaround time without compromising quality"
							},
							{
								icon: Star,
								title: "Premium Quality",
								description: "Top-tier service that exceeds expectations"
							},
							{
								icon: Award,
								title: "Trusted Service",
								description: "200,000+ satisfied customers across Bengaluru"
							}
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.6 }}
								whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(31, 60, 136, 0.1)" }}
								className="bg-white p-8 rounded-2xl text-center hover:shadow-lg transition-all duration-300"
							>
								<div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFB400] bg-opacity-10 rounded-2xl mb-6">
									<feature.icon className="w-8 h-8 text-[#FFB400]" />
								</div>
								<h3 className="text-xl font-bold text-[#1F3C88] mb-3">
									{feature.title}
								</h3>
								<p className="text-gray-600">
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Modern Service Categories */}
			<div className="bg-gradient-to-br from-[#1F3C88] via-[#2952A3] to-[#1F3C88] relative overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0">
					<motion.div
						animate={{
							scale: [1, 1.3, 1],
							rotate: [0, 15, 0],
						}}
						transition={{
							duration: 30,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute top-32 right-32 w-96 h-96 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
					/>
					<motion.div
						animate={{
							scale: [1.3, 1, 1.3],
							rotate: [0, -15, 0],
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute bottom-32 left-32 w-80 h-80 bg-[#FFB400] rounded-full opacity-3 blur-3xl"
					/>
				</div>

				<ServiceCategories />
			</div>

			{/* About Us Section with Light Theme */}
			<div className="bg-gray-50">
				<section id="aboutus" className="py-20">
					{/* AboutPage content start */}
					<div className="min-h-screen pb-8 md:pb-4 lg:pb-8 xl:pb-16">
						<div className="max-w-6xl mx-auto pt-12 px-4">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="flex flex-col md:flex-row gap-8 items-start"
						>
							<motion.video
								initial={{ opacity: 0, x: -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2, duration: 0.8 }}
								src="/car/home.mp4"
								className="rounded-xl w-full md:w-[350px] h-[260px] object-cover shadow-lg"
								controls
								autoPlay
								loop
								muted
							/>
							<motion.div
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.4, duration: 0.8 }}
								className="flex-1"
							>
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.6, duration: 0.6 }}
									className="text-2xl font-bold text-[#1F3C88] mb-2"
								>
									About us
								</motion.h2>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.8, duration: 0.6 }}
									className="text-lg text-gray-600 mb-4 leading-relaxed"
								>
									At Bubble Flash, we’re passionate about making your vehicles
									and wardrobe shine! Based in the heart of Bengaluru, we provide
									top-tier car washing, bike detailing, and laundry care services,
									all under one roof – because we believe convenience should
									never compromise quality.
								</motion.p>
								<motion.ul
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 1, duration: 0.6 }}
									className="text-base text-gray-600 mb-2 space-y-2"
								>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 1.2, duration: 0.4 }}
										className="flex items-center"
									>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-4 h-4 mr-3 align-middle"
										/>
										Over 2,00,000 cleans
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 1.4, duration: 0.4 }}
										className="flex items-center"
									>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-4 h-4 mr-3 align-middle"
										/>
										Combo plans & special program plans offered
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 1.6, duration: 0.4 }}
										className="flex items-center"
									>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-4 h-4 mr-3 align-middle"
										/>
										100 % Customer satisfaction
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 1.8, duration: 0.4 }}
										className="flex items-center"
									>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-4 h-4 mr-3 align-middle"
										/>
										Doorstep services available
									</motion.li>
								</motion.ul>
							</motion.div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.6, duration: 0.8 }}
							className="flex justify-center mt-8 mb-6"
						>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="bg-[#FFB400] bg-opacity-20 backdrop-blur-sm border border-[#FFB400] border-opacity-30 text-xs text-[#FFB400] px-6 py-2 rounded-full font-semibold tracking-wide hover:bg-opacity-30 transition-all"
							>
								HOW IT WORK
							</motion.button>
						</motion.div>
						<motion.h3
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.8, duration: 0.6 }}
							className="text-2xl font-bold text-[#1F3C88] text-center mb-8"
						>
							Book with following 3 working steps
						</motion.h3>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 1, duration: 0.8 }}
							className="flex flex-row w-full mb-12"
						>
							{/* Step 1 */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.2, duration: 0.6 }}
								className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
							>
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
								>
									<img src="/aboutus/location.png" alt="Choose location" className="w-7 h-7 md:w-10 md:h-10" />
								</motion.div>
								<div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">Choose location</div>
								<div className="text-[10px] md:text-xs text-gray-600 text-center">Choose your and find your best car</div>
							</motion.div>
							{/* Step 2 */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.4, duration: 0.6 }}
								className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
							>
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
								>
									<img src="/aboutus/pickup-date.png" alt="Pick-up date" className="w-7 h-7 md:w-10 md:h-10" />
								</motion.div>
								<div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">Pick-up date</div>
								<div className="text-[10px] md:text-xs text-gray-600 text-center">Select your pick up date and time to book your car</div>
							</motion.div>
							{/* Step 3 */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.6, duration: 0.6 }}
								className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
							>
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
								>
									<img src="/aboutus/bookyourwash.png" alt="Book your wash" className="w-7 h-7 md:w-10 md:h-10" />
								</motion.div>
								<div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">Book your wash</div>
								<div className="text-[10px] md:text-xs text-gray-600 text-center">Book your car for doorstep service</div>
							</motion.div>
							{/* Step 4 */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.8, duration: 0.6 }}
								className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1"
							>
								<motion.div
									whileHover={{ scale: 1.1, rotate: 5 }}
									className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3 shadow-lg"
								>
									<img src="/aboutus/expierencewash.png" alt="Experience wash" className="w-7 h-7 md:w-10 md:h-10" />
								</motion.div>
								<div className="font-semibold text-xs md:text-base text-center text-[#1F3C88]">Experience wash</div>
								<div className="text-[10px] md:text-xs text-gray-600 text-center">Don't worry, we have many experienced professionals</div>
							</motion.div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 1.2, duration: 0.8 }}
							className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
						>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.4, duration: 0.6 }}
								whileHover={{ y: -10, scale: 1.02 }}
								className="flex flex-col items-center"
							>
								<motion.img
									whileHover={{ scale: 1.05 }}
									src="/laundry/laundry.gif"
									alt="Laundry"
									className="rounded-xl w-full h-[170px] object-cover mb-4 shadow-lg"
								/>
								<div className="text-xl font-bold text-center text-[#1F3C88]">
									Wash & Fold
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.6, duration: 0.6 }}
								whileHover={{ y: -10, scale: 1.02 }}
								className="flex flex-col items-center"
							>
								<motion.img
									whileHover={{ scale: 1.05 }}
									src="/bike/bikewash.gif"
									alt="Bike"
									className="rounded-xl w-full h-[170px] object-cover mb-4 shadow-lg"
								/>
								<div className="text-xl font-bold text-center text-[#1F3C88]">
									Bring Back the Shine
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.8, duration: 0.6 }}
								whileHover={{ y: -10, scale: 1.02 }}
								className="flex flex-col items-center"
							>
								<motion.img
									whileHover={{ scale: 1.05 }}
									src="/car/carwash.gif"
									alt="Car"
									className="rounded-xl w-full h-[170px] object-cover mb-4 shadow-lg"
								/>
								<div className="text-xl font-bold text-center text-[#1F3C88]">Car Clean</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
				{/* AboutPage content end */}
				</section>
			</div>
			{/* Car wash Accessories Section - Matching ServiceCategories Style */}
			<section className="py-20 bg-gradient-to-br from-[#1F3C88] via-[#2952A3] to-[#1F3C88] relative overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0">
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							rotate: [0, 10, 0],
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute top-20 right-20 w-96 h-96 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
					/>
					<motion.div
						animate={{
							scale: [1.2, 1, 1.2],
							rotate: [0, -10, 0],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute bottom-20 left-20 w-80 h-80 bg-[#FFB400] rounded-full opacity-3 blur-3xl"
					/>
				</div>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="inline-flex items-center px-6 py-3 bg-[#FFB400] bg-opacity-20 backdrop-blur-sm rounded-full border border-[#FFB400] border-opacity-30 mb-6"
						>
							<span className="text-[#FFB400] font-semibold text-sm">Our Products</span>
						</motion.div>
						
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3, duration: 0.8 }}
							className="text-4xl md:text-5xl font-bold text-white mb-4"
						>
							Car wash <span className="text-[#FFB400]">Accessories</span>
						</motion.h2>
						
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.4, duration: 0.8 }}
							className="text-xl text-gray-200 max-w-2xl mx-auto"
						>
							Premium car care accessories for the perfect wash
						</motion.p>
					</motion.div>
					
					{/* Desktop and Mobile Slider Layout with Arrows */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ 
							opacity: 1,
							transition: {
								staggerChildren: 0.1,
								delayChildren: 0.1
							}
						}}
						viewport={{ once: true }}
						className="relative"
					>
						{/* Slider Container */}
						<div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
							{/* Left Arrow */}
							<button
								onClick={handlePrev}
								className="rounded-full bg-[#FFB400] text-[#1F3C88] w-12 h-12 flex items-center justify-center shadow-lg hover:bg-[#e0a000] focus:outline-none transition-all duration-300 flex-shrink-0 z-10"
								aria-label="Previous"
							>
								<ArrowRight className="w-6 h-6 rotate-180" />
							</button>

							{/* Cards Container */}
							<div className="overflow-hidden flex-1 max-w-5xl"
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
							>
								<motion.div
									className={`flex gap-3 md:gap-4 slider-container ${isDraggingState ? 'transition-none' : 'transition-transform duration-500 ease-out'}`}
									style={{
										transform: isMobile 
											? `translateX(-${accessorySlide * 100}%)` 
											: `translateX(-${Math.floor(accessorySlide / 3) * 100}%)`,
										touchAction: 'pan-y pinch-zoom',
									}}
								>
									{accessories.map((item, index) => (
										<motion.div
											key={index}
											initial={{ 
												opacity: 0, 
												y: 50,
												scale: 0.9
											}}
											whileInView={{ 
												opacity: 1, 
												y: 0,
												scale: 1,
												transition: {
													type: "spring",
													stiffness: 100,
													damping: 15,
													delay: index * 0.1
												}
											}}
											viewport={{ once: true }}
											whileHover={{ 
												scale: 1.05,
												y: -10,
												transition: { type: "spring", stiffness: 300, damping: 20 }
											}}
											whileTap={{ scale: 0.95 }}
											onClick={() => handleAddToCart(item)}
											className="relative bg-white rounded-2xl p-4 md:p-6 cursor-pointer shadow-lg backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group overflow-hidden flex-shrink-0 w-full min-w-full md:min-w-0 md:w-1/3 lg:w-1/3"
										>
											{/* Gradient Overlay on Hover */}
											<motion.div
												initial={{ opacity: 0 }}
												whileHover={{ opacity: 0.1 }}
												transition={{ duration: 0.3 }}
												className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl"
											/>

											{/* Content */}
											<div className="relative z-10">
												{/* Icon/Image Container - Smaller */}
												<motion.div
													initial={{ scale: 0, rotate: -180 }}
													whileInView={{ 
														scale: 1, 
														rotate: 0,
														transition: {
															type: "spring",
															stiffness: 200,
															damping: 10,
															delay: 0.3 + index * 0.1
														}
													}}
													viewport={{ once: true }}
													className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4"
												>
													<div className="w-full h-full bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
														<img
															src={item.img}
															alt={item.title}
															className="w-16 h-16 md:w-20 md:h-20 object-contain"
														/>
													</div>
													
													{/* Floating Animation Ring */}
													<motion.div
														animate={{ 
															rotate: 360,
														}}
														whileHover={{ scale: 1.2 }}
														transition={{ 
															rotate: { duration: 8, repeat: Infinity, ease: "linear" },
															scale: { duration: 0.3 }
														}}
														className="absolute inset-0 border-2 border-dashed border-[#FFB400] border-opacity-30 rounded-xl"
													/>
												</motion.div>

												{/* Title */}
												<motion.h3
													initial={{ opacity: 0, y: 10 }}
													whileInView={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.4 + index * 0.1 }}
													className="text-base md:text-lg font-bold text-[#1F3C88] mb-2 text-center group-hover:text-[#FFB400] transition-colors duration-300"
												>
													{item.title}
												</motion.h3>

												{/* Rating */}
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													whileInView={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.5 + index * 0.1 }}
													className="flex justify-center items-center mb-3"
												>
													{[...Array(item.stars)].map((_, i) => (
														<span key={i} className="text-[#FFB400] text-sm md:text-base">★</span>
													))}
												</motion.div>

												{/* Price */}
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													whileInView={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.5 + index * 0.1 }}
													className="text-center mb-4"
												>
													<div className="text-gray-400 line-through text-xs mb-1">MRP: ₹{item.oldPrice}</div>
													<div className="text-red-600 text-base md:text-lg font-bold mb-2">{item.tag}</div>
													<div className="bg-red-400 text-white px-2 py-1 rounded-full text-xs font-semibold inline-block">
														{item.offer}
													</div>
												</motion.div>

												{/* CTA Button */}
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													whileInView={{ opacity: 1, y: 0 }}
													transition={{ delay: 0.6 + index * 0.1 }}
													className="text-center"
												>
													<motion.button
														whileHover={{ scale: 1.05 }}
														whileTap={{ scale: 0.95 }}
														className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1F3C88] to-[#2952A3] text-white px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold hover:from-[#FFB400] hover:to-[#e0a000] transition-all duration-300 shadow-md hover:shadow-lg text-xs md:text-sm"
													>
														Add to Cart
														<motion.div
															whileHover={{ x: 5 }}
															transition={{ duration: 0.3 }}
														>
															<ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
														</motion.div>
													</motion.button>
												</motion.div>
											</div>
										</motion.div>
									))}
								</motion.div>
							</div>

							{/* Right Arrow */}
							<button
								onClick={handleNext}
								className="rounded-full bg-[#FFB400] text-[#1F3C88] w-12 h-12 flex items-center justify-center shadow-lg hover:bg-[#e0a000] focus:outline-none transition-all duration-300 flex-shrink-0 z-10"
								aria-label="Next"
							>
								<ArrowRight className="w-6 h-6" />
							</button>
						</div>
					</motion.div>
				</div>
			</section>
			<section id="services" className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0">
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
							rotate: [0, 5, 0],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute top-10 right-10 w-72 h-72 bg-[#FFB400] rounded-full opacity-5 blur-3xl"
					/>
					<motion.div
						animate={{
							scale: [1.1, 1, 1.1],
							rotate: [0, -5, 0],
						}}
						transition={{
							duration: 15,
							repeat: Infinity,
							ease: "easeInOut"
						}}
						className="absolute bottom-10 left-10 w-96 h-96  rounded-full opacity-3 blur-3xl"
					/>
				</div>
				
				{/* ServicesPage content start */}
				<div className="relative mx-auto pt-12 px-4 flex flex-col md:flex-row gap-8">
					{/* Left: Callback Form */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl border-2 border-[#FFB400] border-opacity-30 p-8 w-full md:w-[350px] flex flex-col items-center shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="flex items-center gap-2 mb-4"
						>
							<motion.img
								whileHover={{ scale: 1.1, rotate: 5 }}
								src="/services/callback.svg"
								alt="Callback"
								className="w-4 h-4"
							/>
							<span className="text-lg font-semibold bg-gradient-to-r from-[#1F3C88] to-[#FFB400] bg-clip-text text-transparent">Request a callback</span>
						</motion.div>
						<form className="w-full flex flex-col gap-4">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.4, duration: 0.6 }}
								className="flex items-center gap-2 border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white hover:border-opacity-60 focus-within:border-opacity-80 transition-all duration-300"
							>
								<span className="text-lg">
									<motion.img
										whileHover={{ scale: 1.1 }}
										src="/services/name.svg"
										alt="Name"
										className="w-4 h-4"
									/>
								</span>
								<input
									className="bg-transparent outline-none flex-1 placeholder:text-gray-400"
									placeholder="Enter your name"
								/>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.5, duration: 0.6 }}
								className="flex items-center gap-2 border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white hover:border-opacity-60 focus-within:border-opacity-80 transition-all duration-300"
							>
								<span className="text-lg">
									<motion.img
										whileHover={{ scale: 1.1 }}
										src="/services/phoneno.svg"
										alt="Phone"
										className="w-4 h-4"
									/>
								</span>
								<input
									className="bg-transparent outline-none flex-1 placeholder:text-gray-400"
									placeholder="Enter your mobile no"
								/>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.6, duration: 0.6 }}
								className="flex items-center gap-2 border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white hover:border-opacity-60 focus-within:border-opacity-80 transition-all duration-300"
							>
								<span className="text-lg">
									<motion.img
										whileHover={{ scale: 1.1 }}
										src="/services/envelope.svg"
										alt="Email"
										className="w-4 h-4"
									/>
								</span>
								<input
									className="bg-transparent outline-none flex-1 placeholder:text-gray-400"
									placeholder="Enter your email"
								/>
							</motion.div>
							<motion.textarea
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.7, duration: 0.6 }}
								className="border-2 border-[#FFB400] border-opacity-30 rounded-xl px-3 py-2 bg-white min-h-[60px] outline-none placeholder:text-gray-400 hover:border-opacity-60 focus:border-opacity-80 transition-all duration-300"
								placeholder="Enter your message......"
							/>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.8, duration: 0.6 }}
								className="text-pink-600 text-sm"
							>
								We are operating between 9 AM - 8 PM
							</motion.div>
							<motion.button
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.9, duration: 0.6 }}
								whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(209, 79, 255, 0.3)" }}
								whileTap={{ scale: 0.95 }}
								type="submit"
								className="bg-gradient-to-r from-[#d14fff] to-[#9333ea] text-white rounded-xl px-2 py-2 font-semibold mt-2 shadow-lg hover:shadow-xl transition-all duration-300"
							>
								Call me
							</motion.button>
						</form>
					</motion.div>
					{/* Right: Info Cards */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="flex-1 flex flex-col gap-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2, duration: 0.6 }}
								whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(37, 211, 102, 0.2)" }}
								className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl p-6 flex flex-col gap-2 shadow-lg cursor-pointer border-2 border-green-200 border-opacity-50 transition-all duration-300 hover:border-opacity-80"
								onClick={() => {
									window.open('https://wa.me/919591572775', '_blank');
								}}
							>
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.4, duration: 0.6 }}
									className="flex items-center gap-2 font-serif font-bold text-lg"
								>
									<span className="text-lg">
										<motion.img
											whileHover={{ scale: 1.2, rotate: 5 }}
											src="/services/whatsapp.svg"
											alt="WhatsApp"
											className="w-4 h-4"
										/>
									</span>
									<span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Ask us on Whatsapp</span>
								</motion.div>
								<div className="text-gray-600 text-sm">
									Get instant support and updates in whatsapp for our service
								</div>
								<div className="flex justify-end">
									<motion.span
										whileHover={{ x: 5 }}
										className="text-2xl text-green-600"
									>
										&gt;
									</motion.span>
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3, duration: 0.6 }}
								whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)" }}
								className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl p-6 flex flex-col gap-2 shadow-lg cursor-pointer border-2 border-blue-200 border-opacity-50 transition-all duration-300 hover:border-opacity-80"
								onClick={() => {
									const faqSection = document.getElementById('faq-section');
									if (faqSection)
										faqSection.scrollIntoView({ behavior: 'smooth' });
								}}
							>
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.5, duration: 0.6 }}
									className="flex items-center gap-2 font-bold text-lg"
								>
									<span className="text-lg">
										<motion.img
											whileHover={{ scale: 1.2, rotate: 5 }}
											src="/services/faq.svg"
											alt="FAQ"
											className="w-4 h-4"
										/>
									</span>
									<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FAQ</span>
								</motion.div>
								<div className="text-gray-600 text-sm">
									Get instant support for our service via our FAQ section
								</div>
								<div className="flex justify-end">
									<motion.span
										whileHover={{ x: 5 }}
										className="text-2xl text-blue-600"
									>
										&gt;
									</motion.span>
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.4, duration: 0.6 }}
								whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)" }}
								className="bg-gradient-to-br from-white via-purple-50 to-violet-50 rounded-2xl p-6 flex flex-col gap-2 shadow-lg col-span-1 md:col-span-2 cursor-pointer border-2 border-purple-200 border-opacity-50 transition-all duration-300 hover:border-opacity-80"
								onClick={() => {
									window.open(
										'https://maps.app.goo.gl/mqVWff6HjLuDCcrD9',
										'_blank'
									);
								}}
							>
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.6, duration: 0.6 }}
									className="flex items-center gap-2 font-bold text-lg"
								>
									<span className="text-lg">
										<motion.img
											whileHover={{ scale: 1.2, rotate: 5 }}
											src="/services/name.svg"
											alt="Contact"
											className="w-4 h-4"
										/>
									</span>
									<span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Contact Information</span>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.7, duration: 0.6 }}
									className="flex flex-wrap gap-8 text-xs text-gray-700 mt-2"
								>
									<div>
										<div className="font-semibold text-purple-700">Address</div>
										<div>Bangalore, India</div>
									</div>
									<div>
										<div className="font-semibold text-purple-700">Phone</div>
										<div>+91 9980123452</div>
									</div>
									<div>
										<div className="font-semibold text-purple-700">Email</div>
										<div>hello@bubbleflash.in</div>
									</div>
									<div>
										<div className="font-semibold text-purple-700">Business Hours</div>
										<div>
											Monday - Saturday: 9:00 AM - 8:00 PM
											<br />
											Sunday: 10:00 AM - 6:00 PM
										</div>
									</div>
								</motion.div>
								<div className="flex justify-end mt-2">
									<motion.span
										whileHover={{ x: 5 }}
										className="text-2xl text-purple-600"
									>
										&gt;
									</motion.span>
								</div>
							</motion.div>
						</div>
					</motion.div>
				</div>
				{/* Choose your package Section */}
				<div className="py-16 relative">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#1F3C88] to-[#FFB400] bg-clip-text text-transparent"
					>
						Choose your package
					</motion.h2>
					<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
						{/* Quick shine car */}
						<motion.div
							initial={{ opacity: 0, y: 50, scale: 0.9 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1, duration: 0.8 }}
							whileHover={{ 
								y: -15, 
								scale: 1.05, 
								boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)",
								transition: { type: "spring", stiffness: 300, damping: 20 }
							}}
							className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-2xl border-2 border-blue-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
						>
							{/* Floating Elements */}
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
								className="absolute top-4 right-4 w-12 h-12 bg-blue-400 bg-opacity-20 rounded-full blur-sm"
							/>
							<motion.div
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
								className="absolute bottom-4 left-4 w-8 h-8 bg-indigo-400 bg-opacity-20 rounded-full blur-sm"
							/>
							
							<div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
								<motion.div
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.3, duration: 0.6 }}
									className="text-4xl font-bold mb-2 text-center text-gray-800"
								>
									Quick shine car
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.4, duration: 0.6 }}
									className="text-3xl font-bold mb-6 text-center text-green-600"
								>
									₹199
								</motion.div>
								<motion.ul
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.5, duration: 0.8 }}
									className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
								>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.6, duration: 0.4 }}
									>
										Exterior wash with high-pressure watergun
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.7, duration: 0.4 }}
									>
										Soft-touch mild soap
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.8, duration: 0.4 }}
									>
										Swirl-free clean
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.9, duration: 0.4 }}
									>
										Deep-cleaning of car mats
									</motion.li>
								</motion.ul>
							</div>
							<motion.button
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1, duration: 0.6 }}
								whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 214, 0, 0.4)" }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate('/cars')}
								className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-yellow-500 px-8 py-3 font-serif font-semibold text-lg shadow-lg transition-all duration-300 hover:border-yellow-600 mx-auto mt-6"
							>
								Get Services
							</motion.button>
						</motion.div>
						{/* Bike wash */}
						<motion.div
							initial={{ opacity: 0, y: 50, scale: 0.9 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2, duration: 0.8 }}
							whileHover={{ 
								y: -15, 
								scale: 1.05, 
								boxShadow: "0 25px 50px rgba(34, 197, 94, 0.3)",
								transition: { type: "spring", stiffness: 300, damping: 20 }
							}}
							className="bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-2xl border-2 border-green-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
						>
							{/* Floating Elements */}
							<motion.div
								animate={{ rotate: -360 }}
								transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
								className="absolute top-4 right-4 w-12 h-12 bg-green-400 bg-opacity-20 rounded-full blur-sm"
							/>
							<motion.div
								animate={{ scale: [1, 1.3, 1] }}
								transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
								className="absolute bottom-4 left-4 w-8 h-8 bg-emerald-400 bg-opacity-20 rounded-full blur-sm"
							/>
							
							<div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
								<motion.div
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.4, duration: 0.6 }}
									className="text-4xl font-bold mb-2 text-center text-gray-800"
								>
									Shine Bike wash
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.5, duration: 0.6 }}
									className="text-3xl font-bold mb-6 text-center text-green-600"
								>
									₹99
								</motion.div>
								<motion.ul
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.6, duration: 0.8 }}
									className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
								>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.7, duration: 0.4 }}
									>
										Gentle exterior water wash
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.8, duration: 0.4 }}
									>
										Wheel cleaning with specialized wheel cleaner
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.9, duration: 0.4 }}
									>
										High-pressure tyre wash for spotless finish
									</motion.li>
								</motion.ul>
							</div>
							<motion.button
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.1, duration: 0.6 }}
								whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)" }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate('/bikes')}
								className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-green-500 px-8 py-3 font-serif font-semibold text-lg shadow-lg transition-all duration-300 hover:border-green-600 mx-auto mt-6"
							>
								Get Services
							</motion.button>
						</motion.div>
						{/* Laundry wash */}
						<motion.div
							initial={{ opacity: 0, y: 50, scale: 0.9 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3, duration: 0.8 }}
							whileHover={{ 
								y: -15, 
								scale: 1.05, 
								boxShadow: "0 25px 50px rgba(168, 85, 247, 0.3)",
								transition: { type: "spring", stiffness: 300, damping: 20 }
							}}
							className="bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100 rounded-2xl border-2 border-purple-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
						>
							{/* Floating Elements */}
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
								className="absolute top-4 right-4 w-12 h-12 bg-purple-400 bg-opacity-20 rounded-full blur-sm"
							/>
							<motion.div
								animate={{ scale: [1, 1.4, 1] }}
								transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
								className="absolute bottom-4 left-4 w-8 h-8 bg-violet-400 bg-opacity-20 rounded-full blur-sm"
							/>
							
							<div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
								<motion.div
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.5, duration: 0.6 }}
									className="text-4xl font-bold mb-2 text-center text-gray-800"
								>
									Laundry wash
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.6, duration: 0.6 }}
									className="text-3xl font-bold mb-6 text-center text-purple-600"
								>
									₹99
								</motion.div>
								<motion.ul
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.7, duration: 0.8 }}
									className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
								>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.8, duration: 0.4 }}
									>
										Professional wash & fold service
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.9, duration: 0.4 }}
									>
										Eco-friendly detergents
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 1.0, duration: 0.4 }}
									>
										Same-day pickup & delivery
									</motion.li>
								</motion.ul>
							</div>
							<motion.button
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.2, duration: 0.6 }}
								whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(168, 85, 247, 0.4)" }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate('/laundry')}
								className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-purple-500 px-8 py-3 font-serif font-semibold text-lg shadow-lg transition-all duration-300 hover:border-purple-600 mx-auto mt-6"
							>
								Get Services
							</motion.button>
						</motion.div>
						{/* Helmet Deals */}
						<motion.div
							initial={{ opacity: 0, y: 50, scale: 0.9 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true }}
							transition={{ delay: 0.4, duration: 0.8 }}
							whileHover={{ 
								y: -15, 
								scale: 1.05, 
								boxShadow: "0 25px 50px rgba(239, 68, 68, 0.3)",
								transition: { type: "spring", stiffness: 300, damping: 20 }
							}}
							className="bg-gradient-to-br from-red-100 via-red-50 to-orange-100 rounded-2xl border-2 border-red-300 border-opacity-50 shadow-xl p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-300 hover:border-opacity-80 relative overflow-hidden"
						>
							{/* Floating Elements */}
							<motion.div
								animate={{ rotate: -360 }}
								transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
								className="absolute top-4 right-4 w-12 h-12 bg-red-400 bg-opacity-20 rounded-full blur-sm"
							/>
							<motion.div
								animate={{ scale: [1, 1.5, 1] }}
								transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
								className="absolute bottom-4 left-4 w-8 h-8 bg-orange-400 bg-opacity-20 rounded-full blur-sm"
							/>
							
							<div className="w-full flex-1 flex flex-col items-center gap-6 relative z-10">
								<motion.div
									initial={{ opacity: 0, scale: 0.5 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.6, duration: 0.6 }}
									className="text-4xl font-bold mb-2 text-center text-gray-800"
								>
									Helmet Deals
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.7, duration: 0.6 }}
									className="text-3xl font-bold mb-6 text-center text-red-600"
								>
									₹99
								</motion.div>
								<motion.ul
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.8, duration: 0.8 }}
									className="text-gray-700 text-xl mb-6 flex flex-col gap-2 text-center list-none p-0"
								>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 0.9, duration: 0.4 }}
									>
										Premium quality helmets
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 1.0, duration: 0.4 }}
									>
										ISI certified safety standards
									</motion.li>
									<motion.li
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: 1.1, duration: 0.4 }}
									>
										Multiple styles and sizes available
									</motion.li>
								</motion.ul>
							</div>
							<motion.button
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 1.3, duration: 0.6 }}
								whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)" }}
								whileTap={{ scale: 0.95 }}
								onClick={() => navigate('/helmets')}
								className="bg-gradient-to-r from-[#FFD600] to-[#FFA000] text-black rounded-xl border-2 border-red-500 px-8 py-3 font-semibold text-lg shadow-lg transition-all duration-300 hover:border-red-600 mx-auto mt-6"
							>
								Get services
							</motion.button>
						</motion.div>
					</div>
				</div>
				{/* What client says - true carousel */}
				<div className="mt-20 mb-8 py-12">
					<h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
						What client says
					</h2>
					<div className="overflow-hidden w-full flex justify-center">
						<div
							className="flex gap-4 sm:gap-6 md:gap-8 transition-all duration-700"
							style={{ width: 'max-content' }}
						>
							{carousel
								.slice(0, visibleCount)
								.map((t, idx) => (
									<div
										key={idx}
										className="bg-white rounded-xl border shadow-sm p-4 sm:p-5 md:p-6 min-w-[220px] sm:min-w-[280px] md:min-w-[340px] max-w-[380px] flex flex-col"
									>
										<div className="flex items-center gap-3 mb-2">
											<img
												src={t.img}
												alt={t.name}
												className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
											/>
											<div>
												<div className="font-serif font-bold">{t.name}</div>
												<div className="text-xs font-serif text-gray-500">
													{t.name}
												</div>
											</div>
											<div className="flex ml-auto gap-1">
												{[...Array(t.stars)].map((_, i) => (
													<span
														key={i}
														className="text-yellow-400 text-lg"
													>
														★
													</span>
												))}
											</div>
										</div>
										<div className="text-gray-700 text-base mt-2">
											“{t.text}”
										</div>
									</div>
								))}
						</div>
					</div>
				</div>
				{/* FAQ Section */}
				<div className="mt-16 py-12 bg-white">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						id="faq-section"
						className="text-2xl md:text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-[#1F3C88] to-[#FFB400] bg-clip-text text-transparent"
					>
						Frequently Asked Questions
					</motion.h2>
					<div className="max-w-4xl mx-auto flex flex-col gap-4 px-4">
						{FAQS.map((faq, i) => (
							<div
								key={i}
								className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
							>
								<button
									className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium focus:outline-none hover:bg-gray-50 transition-colors duration-200 text-left"
									onClick={() =>
										setOpenIdx(openIdx === i ? -1 : i)
									}
								>
									<span className="text-gray-800 pr-4">{faq.question}</span>
									<div className="flex-shrink-0">
										<svg
											className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
												openIdx === i ? 'rotate-180' : 'rotate-0'
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>
								</button>
								{openIdx === i && (
									<div className="px-6 pb-4 text-gray-600 text-base leading-relaxed border-t border-gray-100">
										<div className="pt-4">
											{faq.answer}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
				{/* ServicesPage content end */}
			</section>
			<section id="contact">
				{/* ContactPage content start */}
				<div className="rounded-t-3xl pb-10 px-4 md:px-16 ">
					<div className="max-w-6xl mx-auto">
						<div className="font-bold text-lg mb-4 flex items-center gap-2">
							<span className="text-lg">
								<img
									src="/services/name.svg"
									alt="Callback"
									className="w-4 h-4"
								/>
							</span>{' '}
							Contact US
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
								<div>hello@bubbleflash.in</div>
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
				{/* ContactPage content end */}
			</section>
		</>
	);
}