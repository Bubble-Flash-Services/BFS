import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Phone, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextGenerateEffect } from '../../components/ui/text-generate-effect';
import { SparklesText } from '../../components/ui/sparkles-text';
import MegaWinHeading from '../../components/ui/MegaWinHeading';
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
	const [openIdx, setOpenIdx] = useState(0);
	const [visibleCount, setVisibleCount] = useState(4);
	const [carousel, setCarousel] = useState(testimonials);
	const [accessorySlide, setAccessorySlide] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const accessorySliderRef = useRef(null);
	const startX = useRef(0);
	const isDragging = useRef(false);

	useEffect(() => {
		// Get current location using the new address API
		const getCurrentLocation = async () => {
			try {
				const result = await addressAPI.getCurrentAddress();
				if (result.success) {
					setFullAddress(result.data.fullAddress);
					setSelectedLocation(result.data.fullAddress);
					setAddressData(result.data);
				} else {
					console.log('Failed to get current location:', result.message);
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
		if (!isMobile) return;
		
		const autoSlide = setInterval(() => {
			setAccessorySlide((prev) => {
				const nextSlide = prev + 1;
				return nextSlide >= totalSlides ? 0 : nextSlide;
			});
		}, 2000);

		return () => clearInterval(autoSlide);
	}, [isMobile]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCarousel(prev => {
				const [first, ...rest] = prev;
				return [...rest, first];
			});
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const categories = ['Car Wash', 'Bike Wash', 'Laundry Service'];
	const locations = [fullAddress || 'Bengaluru, India', 'Chennai, India'];

	// Car wash accessories data
	const accessories = [
		{
			img: '/public/aboutus/car-spray.png',
			title: 'Hoora car spray',
			price: 99,
			oldPrice: 150,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 99 only',
		},
		{
			img: '/public/car/car2.png',
			title: 'Microfiber Towel',
			price: 120,
			oldPrice: 200,
			offer: '40%offer',
			stars: 3,
			tag: '₹ 120 only',
		},
		{
			img: '/public/car/car3.png',
			title: 'Car Shampoo',
			price: 80,
			oldPrice: 160,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 80 only',
		},
		{
			img: '/public/car/car1.png',
			title: 'Tyre Cleaner',
			price: 110,
			oldPrice: 220,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 110 only',
		},
		{
			img: '/public/car/car2.png',
			title: 'Glass Cleaner',
			price: 90,
			oldPrice: 180,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 90 only',
		},
		{
			img: '/public/car/car3.png',
			title: 'Dashboard Polish',
			price: 150,
			oldPrice: 300,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 150 only',
		},
		{
			img: '/public/car/car1.png',
			title: 'Foam Sprayer',
			price: 180,
			oldPrice: 360,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 180 only',
		},
		{
			img: '/public/car/car2.png',
			title: 'Wheel Brush',
			price: 70,
			oldPrice: 140,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 70 only',
		},
		{
			img: '/public/car/car3.png',
			title: 'Leather Cleaner',
			price: 200,
			oldPrice: 400,
			offer: '50%offer',
			stars: 3,
			tag: '₹ 200 only',
		},
	];

	const cardsPerSlide = 3;
	const totalSlides = Math.ceil(accessories.length / cardsPerSlide);
	
	const handleDotClick = idx => setAccessorySlide(idx);
	const handlePrev = () =>
		setAccessorySlide(s => (s - 1 + totalSlides) % totalSlides);
	const handleNext = () => setAccessorySlide(s => (s + 1) % totalSlides);

	// Touch handlers for mobile
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
			if (diffX > 0 && accessorySlide < totalSlides - 1) {
				setAccessorySlide(accessorySlide + 1);
			} else if (diffX < 0 && accessorySlide > 0) {
				setAccessorySlide(accessorySlide - 1);
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
			default:
				alert('Please select a valid service category');
		}
	};

	return (
		<>
			<section id="home" className="bg-gradient-to-br from-blue-50 to-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<MegaWinHeading className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight text-center">
						Professional Cleaning Services for Cars, Bikes & More
					</MegaWinHeading>
					<SparklesText
						text="Experience top-tier car wash, bike detailing, and laundry care – all under one roof in Bengaluru."
						className="text-xl text-gray-600 mb-8 leading-relaxed text-center"
					/>
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
								<h3 className="text-2xl font-semibold mb-6 text-gray-800">
									Book your Service
								</h3>
								<div className="space-y-4">
									<div className="relative">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Select category
										</label>
										<div className="relative">
											<select
												value={selectedCategory}
												onChange={e =>
													setSelectedCategory(e.target.value)
												}
												className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="">Choose a service</option>
												{categories.map(category => (
													<option key={category} value={category}>
														{category}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Pickup date
											</label>
											<div className="relative">
												<input
													type="date"
													value={pickupDate}
													onChange={e => setPickupDate(e.target.value)}
													className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											</div>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Phone number
											</label>
											<div className="relative">
												<input
													type="tel"
													value={phoneNumber}
													onChange={e => setPhoneNumber(e.target.value)}
													placeholder="Enter phone number"
													className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
												<Phone className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
											</div>
										</div>
									</div>
									<div className="relative">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Location
										</label>
										<AddressAutocomplete
											value={fullAddress}
											onChange={setFullAddress}
											onSelect={handleAddressSelect}
											placeholder="Enter your address or use current location"
											className="bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											showCurrentLocation={true}
										/>
									</div>
									<button 
										onClick={handleBookService}
										className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-6 rounded-lg font-medium transition-colors mt-6"
									>
										Book now
									</button>
								</div>
							</div>
						</div>
						<div className="flex justify-center lg:mb-36 md:mb-0">
							<div className="bg-blue-50 rounded-2xl p-8 max-w-md">
								<div className="text-4xl mb-4">💙</div>
								<TextGenerateEffect
									words={`Really impressed with the car wash service at Bubble Flash Car Wash! The team was professional, friendly, and detailed in their work. My car looked spotless afterward.`}
									className="text-gray-600 italic leading-relaxed"
									duration={2}
									filter={false}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
			<ServiceCategories />
			<section id="aboutus">
				{/* AboutPage content start */}
				<div className="bg-white min-h-screen pb-16">
					<div className="max-w-6xl mx-auto pt-12 px-4">
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
								<h2 className="text-2xl font-bold text-blue-500 mb-2">
									About us
								</h2>
								<p className="text-lg text-gray-800 mb-4">
									At Bubble Flash, we’re passionate about making your vehicles
									and wardrobe shine! Based in the heart of Bengaluru, we provide
									top-tier car washing, bike detailing, and laundry care services,
									all under one roof – because we believe convenience should
									never compromise quality.
								</p>
								<ul className="text-base text-black mb-2 space-y-1">
									<li>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-3 h-3 mr-2 align-middle"
										/>
										Over 2,00,000 cleans
									</li>
									<li>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-3 h-3 mr-2 align-middle"
										/>
										Combo plans & special program plans offered
									</li>
									<li>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-3 h-3 mr-2 align-middle"
										/>
										100 % Customer satisfaction
									</li>
									<li>
										<img
											src="/aboutus/circle-check.png"
											alt="check"
											className="inline w-3 h-3 mr-2 align-middle"
										/>
										Doorstep services available
									</li>
								</ul>
							</div>
						</div>
						<div className="flex justify-center mt-2 mb-6">
							<button className="bg-[#e6eafc] text-xs text-blue-500 px-4 py-1 rounded-full font-semibold tracking-wide">
								HOW IT WORK
							</button>
						</div>
						<h3 className="text-2xl font-semibold text-center mb-8">
							Book with following 3 working steps
						</h3>
						<div className="flex flex-row w-full mb-12">
							{/* Step 1 */}
							<div className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1">
								<div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3">
									<img src="/aboutus/location.png" alt="Choose location" className="w-7 h-7 md:w-10 md:h-10" />
								</div>
								<div className="font-semibold text-xs md:text-base text-center">Choose location</div>
								<div className="text-[10px] md:text-xs text-gray-500 text-center">Choose your and find your best car</div>
							</div>
							{/* Step 2 */}
							<div className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1">
								<div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3">
									<img src="/aboutus/pickup-date.png" alt="Pick-up date" className="w-7 h-7 md:w-10 md:h-10" />
								</div>
								<div className="font-semibold text-xs md:text-base text-center">Pick-up date</div>
								<div className="text-[10px] md:text-xs text-gray-500 text-center">Select your pick up date and time to book your car</div>
							</div>
							{/* Step 3 */}
							<div className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1">
								<div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3">
									<img src="/aboutus/bookyourwash.png" alt="Book your wash" className="w-7 h-7 md:w-10 md:h-10" />
								</div>
								<div className="font-semibold text-xs md:text-base text-center">Book your wash</div>
								<div className="text-[10px] md:text-xs text-gray-500 text-center">Book your car for doorstep service</div>
							</div>
							{/* Step 4 */}
							<div className="flex flex-col items-center flex-shrink-0 w-1/4 min-w-0 px-1">
								<div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 md:mb-3">
									<img src="/aboutus/expierencewash.png" alt="Experience wash" className="w-7 h-7 md:w-10 md:h-10" />
								</div>
								<div className="font-semibold text-xs md:text-base text-center">Experience wash</div>
								<div className="text-[10px] md:text-xs text-gray-500 text-center">Don't worry, we have many experienced professionals</div>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
							<div className="flex flex-col items-center">
								<img
									src="/laundry/laundry.gif"
									alt="Laundry"
									className="rounded-xl w-full h-[170px] object-cover mb-4"
								/>
								<div className="text-xl font-bold text-center">
									Wash & Fold
								</div>
							</div>
							<div className="flex flex-col items-center">
								<img
									src="/bike/bikewash.gif"
									alt="Bike"
									className="rounded-xl w-full h-[170px] object-cover mb-4"
								/>
								<div className="text-xl font-bold text-center">
									Bring Back the Shine
								</div>
							</div>
							<div className="flex flex-col items-center">
								<img
									src="/car/carwash.gif"
									alt="Car"
									className="rounded-xl w-full h-[170px] object-cover mb-4"
								/>
								<div className="text-xl font-bold text-center">Car Clean</div>
							</div>
						</div>
					</div>
				</div>

				
				{/* AboutPage content end */}
			</section>
			{/* Car wash Accessories Slider */}
			<div className="py-12 bg-white">
				<h2 className="text-3xl font-bold text-center mb-8">
					Car wash Accessories
				</h2>
				
				{/* Desktop Layout */}
				<div className="hidden md:flex items-center justify-center gap-4 max-w-7xl mx-auto">
					{/* Left arrow */}
					<button
						onClick={handlePrev}
						className="rounded-full bg-black text-white w-12 h-12 flex items-center justify-center shadow hover:bg-gray-800 focus:outline-none"
						aria-label="Previous"
					>
						<img src="/services/triangle-down.svg" alt="left" style={{ transform: 'rotate(90deg)', width: 28, height: 28 }} />
					</button>
					{/* Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 max-w-4xl">
						{accessories
							.slice(
								accessorySlide * cardsPerSlide,
								accessorySlide * cardsPerSlide + cardsPerSlide
							)
							.map((item, idx) => (
								<div
									key={idx}
									className="bg-white rounded-3xl shadow p-6 flex flex-col items-center min-h-[370px] max-w-xs mx-auto"
								>
									<div className="flex items-center w-full mb-2">
										<img
											src={item.img}
											alt={item.title}
											className="w-24 h-24 rounded-lg object-cover mr-4"
										/>
										<div className="flex-1">
											<div className="text-2xl font-serif font-semibold">
												{item.title}
											</div>
											<div className="flex items-center mt-2">
												{[...Array(item.stars)].map((_, i) => (
													<span
														key={i}
														className="text-yellow-400 text-2xl"
													>
														★
													</span>
												))}
											</div>
											<div className="text-gray-400 line-through text-lg">
												MRP : ₹{item.oldPrice}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2 w-full mb-4">
										<span className="text-red-600 text-lg font-bold">
											{item.tag}
										</span>
										<span className="bg-red-400 text-white px-3 py-1 rounded shadow text-sm font-semibold">
											{item.offer}
										</span>
									</div>
									<button 
										className="mt-auto bg-green-500 text-white px-8 py-2 rounded-lg font-bold text-lg shadow hover:bg-green-600 transition-all"
										onClick={() => handleAddToCart(item)}
									>
										Add to cart
									</button>
								</div>
							))}
					</div>
					{/* Right arrow */}
					<button
						onClick={handleNext}
						className="rounded-full bg-black text-white w-12 h-12 flex items-center justify-center shadow hover:bg-gray-800 focus:outline-none"
						aria-label="Next"
					>
						<img src="/services/triangle-down.svg" alt="right" style={{ transform: 'rotate(-90deg)', width: 28, height: 28 }} />
					</button>
				</div>

				{/* Mobile Slider Layout */}
				<div className="md:hidden relative overflow-hidden max-w-sm mx-auto">
					<div
						ref={accessorySliderRef}
						className="flex transition-transform duration-300 ease-in-out"
						style={{
							transform: `translateX(-${accessorySlide * 100}%)`,
						}}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						{accessories.map((item, idx) => (
							<div
								key={idx}
								className="flex-shrink-0 w-full px-4"
							>
								<div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center min-h-[370px] max-w-xs mx-auto">
									<div className="flex items-center w-full mb-2">
										<img
											src={item.img}
											alt={item.title}
											className="w-24 h-24 rounded-lg object-cover mr-4"
										/>
										<div className="flex-1">
											<div className="text-xl font-serif font-semibold">
												{item.title}
											</div>
											<div className="flex items-center mt-2">
												{[...Array(item.stars)].map((_, i) => (
													<span
														key={i}
														className="text-yellow-400 text-xl"
													>
														★
													</span>
												))}
											</div>
											<div className="text-gray-400 line-through text-sm">
												MRP : ₹{item.oldPrice}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2 w-full mb-4">
										<span className="text-red-600 text-lg font-bold">
											{item.tag}
										</span>
										<span className="bg-red-400 text-white px-3 py-1 rounded shadow text-sm font-semibold">
											{item.offer}
										</span>
									</div>
									<button 
										className="mt-auto bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-lg shadow hover:bg-green-600 transition-all"
										onClick={() => handleAddToCart(item)}
									>
										Add to cart
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Mobile Slide Indicators */}
					<div className="flex justify-center mt-6 space-x-2">
						{accessories.map((_, index) => (
							<button
								key={index}
								className={`w-3 h-3 rounded-full transition-colors ${
									index === accessorySlide ? 'bg-black' : 'bg-gray-300'
								}`}
								onClick={() => setAccessorySlide(index)}
							/>
						))}
					</div>
				</div>

				{/* Desktop Dots */}
				<div className="hidden md:flex justify-center gap-6 mt-8">
					{Array.from({ length: totalSlides }).map((_, idx) => (
						<button
							key={idx}
							onClick={() => handleDotClick(idx)}
							className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center transition-all ${
								accessorySlide === idx
									? 'bg-black text-white'
									: 'bg-white text-black'
							}`}
							aria-label={`Go to slide ${idx + 1}`}
						>
							<span className="text-2xl">•</span>
						</button>
					))}
				</div>
			</div>
			<section id="services">
				{/* ServicesPage content start */}
				<div className="max-w-6xl mx-auto pt-12 px-4 flex flex-col md:flex-row gap-8">
					{/* Left: Callback Form */}
					<div className="bg-white rounded-xl border border-black p-8 w-full md:w-[350px] flex flex-col items-center shadow-sm">
						<div className="flex items-center gap-2 mb-4">
							<img
								src="/services/callback.svg"
								alt="Callback"
								className="w-4 h-4"
							/>
							<span className="text-lg font-semibold">Request a callback</span>
						</div>
						<form className="w-full flex flex-col gap-4">
							<div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
								<span className="text-lg">
									<img
										src="/services/name.svg"
										alt="Callback"
										className="w-4 h-4"
									/>
								</span>
								<input
									className="bg-transparent outline-none flex-1"
									placeholder="Enter your name"
								/>
							</div>
							<div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
								<span className="text-lg">
									<img
										src="/services/phoneno.svg"
										alt="Callback"
										className="w-4 h-4"
									/>
								</span>
								<input
									className="bg-transparent outline-none flex-1"
									placeholder="Enter your mobile no"
								/>
							</div>
							<div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
								<span className="text-lg">
									<img
										src="/services/envelope.svg"
										alt="Callback"
										className="w-4 h-4"
									/>
								</span>
								<input
									className="bg-transparent outline-none flex-1"
									placeholder="Enter your email"
								/>
							</div>
							<textarea
								className="border rounded-xl px-3 py-2 bg-white min-h-[60px] outline-none"
								placeholder="Enter your message......"
							/>
							<div className="text-pink-600 text-sm">
								We are operating between 9 AM - 8 PM
							</div>
							<button
								type="submit"
								className="bg-[#d14fff] text-white rounded-xl px-2 py-2 font-semibold mt-2"
							>
								Call me
							</button>
						</form>
					</div>
					{/* Right: Info Cards */}
					<div className="flex-1 flex flex-col gap-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm cursor-pointer border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:border-gray-400 hover:-translate-y-1"
								onClick={() => {
									window.open('https://wa.me/919591572775', '_blank');
								}}
							>
								<div className="flex items-center gap-2 font-bold text-lg">
									<span className="text-lg">
										<img
											src="/services/whatsapp.svg"
											alt="Callback"
											className="w-4 h-4"
										/>
									</span>{' '}
									Ask us on Whatsapp
								</div>
								<div className="text-gray-500 text-sm">
									Get instant support and updates in whatsapp for our service
								</div>
								<div className="flex justify-end">
									<span className="text-2xl">&gt;</span>
								</div>
							</div>
							<div className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm cursor-pointer border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:border-gray-400 hover:-translate-y-1"
								onClick={() => {
									const faqSection = document.getElementById('faq-section');
									if (faqSection)
										faqSection.scrollIntoView({ behavior: 'smooth' });
								}}
							>
								<div className="flex items-center gap-2 font-bold text-lg">
									<span className="text-lg">
										<img
											src="/services/faq.svg"
											alt="Callback"
											className="w-4 h-4"
										/>
									</span>{' '}
									FAQ
								</div>
								<div className="text-gray-500 text-sm">
									Get instant support for our service via our FAQ section
								</div>
								<div className="flex justify-end">
									<span className="text-2xl">&gt;</span>
								</div>
							</div>
							<div className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm col-span-1 md:col-span-2 cursor-pointer border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:border-gray-400 hover:-translate-y-1"
								onClick={() => {
									window.open(
										'https://maps.app.goo.gl/mqVWff6HjLuDCcrD9',
										'_blank'
									);
								}}
							>
								<div className="flex items-center gap-2 font-bold text-lg">
									<span className="text-lg">
										<img
											src="/services/name.svg"
											alt="Callback"
											className="w-4 h-4"
										/>
									</span>{' '}
									Contact Information
								</div>
								<div className="flex flex-wrap gap-8 text-xs text-gray-700 mt-2">
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
								<div className="flex justify-end mt-2">
									<span className="text-2xl">&gt;</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Choose your package Section */}
				<div className="py-16 bg-white">
					<h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
						Choose your package
					</h2>
					<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
						{/* Quick shine car */}
						<div className="bg-white rounded-xl border shadow-sm p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-200 hover:shadow-2xl hover:z-10 relative">
							<div className="w-full flex-1 flex flex-col items-center gap-6">
								<div className="text-4xl font-serif font-bold mb-2 text-center">
									Quick shine car
								</div>
								<div className="text-3xl font-serif font-bold mb-6 text-center">
									₹199
								</div>
								<ul className="text-gray-700 text-xl font-serif mb-6 flex flex-col gap-2 text-center list-none p-0">
									<li>Exterior wash with high-pressure watergun</li>
									<li>Soft-touch mild soap</li>
									<li>Swirl-free clean</li>
									<li>Deep-cleaning of car mats</li>
								</ul>
							</div>
							<button 
								onClick={() => navigate('/cars')}
								className="bg-[#FFD600] text-black rounded-xl border border-black px-8 py-3 font-semibold text-lg font-mono shadow transition-colors duration-200 hover:bg-yellow-300 mx-auto mt-6"
							>
								Get Services
							</button>
						</div>
						{/* Bike wash */}
						<div className="bg-white rounded-xl border shadow-sm p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-200 hover:shadow-2xl hover:z-10 relative">
							<div className="w-full flex-1 flex flex-col items-center gap-6">
								<div className="text-4xl font-serif font-bold mb-2 text-center">
									Shine Bike wash
								</div>
								<div className="text-3xl font-serif font-bold mb-6 text-center">
									₹99
								</div>
								<ul className="text-gray-700 text-xl font-serif mb-6 flex flex-col gap-2 text-center list-none p-0">
									<li>Gentle exterior water wash</li>
									<li>Wheel cleaning with specialized wheel cleaner</li>
									<li>High-pressure tyre wash for spotless finish</li>
								</ul>
							</div>
							<button 
								onClick={() => navigate('/bikes')}
								className="bg-[#FFD600] text-black rounded-xl border border-black px-8 py-3 font-semibold text-lg font-mono shadow transition-colors duration-200 hover:bg-yellow-300 mx-auto mt-6"
							>
								Get Services
							</button>
						</div>
						{/* Laundry wash */}
						<div className="bg-white rounded-xl border shadow-sm p-8 min-h-[500px] flex flex-col justify-between items-center h-full transition-all duration-200 hover:shadow-2xl hover:z-10 relative">
							<div className="w-full flex-1 flex flex-col items-center gap-6">
								<div className="text-4xl font-serif font-bold mb-2 text-center">
									Laundry wash
								</div>
								<div className="text-3xl font-serif font-bold mb-6 text-center">
									₹99
								</div>
								<ul className="text-gray-700 text-xl font-serif mb-6 flex flex-col gap-2 text-center list-none p-0">
									<li>Gentle exterior water wash</li>
									<li>Wheel cleaning with specialized wheel cleaner</li>
									<li>High-pressure tyre wash for spotless finish</li>
								</ul>
							</div>
							<button 
								onClick={() => navigate('/laundry')}
								className="bg-[#FFD600] text-black rounded-xl border border-black px-8 py-3 font-semibold text-lg font-mono shadow transition-colors duration-200 hover:bg-yellow-300 mx-auto mt-6"
							>
								Get Services
							</button>
						</div>
					</div>
				</div>
				{/* What client says - true carousel */}
				<div className="mt-20 mb-8">
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
												<div className="font-bold">{t.name}</div>
												<div className="text-xs text-gray-500">
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
				<div className="mt-16 bg-white py-12">
					<h2
						id="faq-section"
						className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8"
					>
						Frequently Asked Questions
					</h2>
					<div className="max-w-4xl mx-auto flex flex-col gap-6 px-4">
						{FAQS.map((faq, i) => (
							<div
								key={i}
								className="bg-white border rounded-xl shadow-sm"
							>
								<button
									className="w-full flex justify-between items-center px-6 py-6 text-lg font-medium focus:outline-none"
									onClick={() =>
										setOpenIdx(openIdx === i ? -1 : i)
									}
								>
									<span>{faq.question}</span>
									<span className="text-2xl">
										<img
											src="/services/triangle-down.svg"
											alt="Toggle"
											className={
												openIdx === i
													? 'w-6 h-6 transform rotate-180 transition-transform duration-200 inline'
													: 'w-6 h-6 transition-transform duration-200 inline'
											}
											style={{
												display: 'inline-block',
												verticalAlign: 'middle',
											}}
										/>
									</span>
								</button>
								{openIdx === i && (
									<div className="px-6 pb-6 text-gray-600 text-base animate-fade-in">
										{faq.answer}
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
				<div className="bg-white rounded-t-3xl pb-2 px-4 md:px-16 ">
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