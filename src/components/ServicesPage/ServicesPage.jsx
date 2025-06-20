import React, { useState, useEffect } from "react";

const FAQS = [
	{
		question: "How do I request a laundry pickup?",
		answer: "You can request a laundry pickup by filling out the callback form on this page or by contacting us via WhatsApp. Our team will schedule a convenient pickup time for you.",
	},
	{
		question: "What services does Bubble Flash offer?",
		answer: "Bubble Flash offers laundry, car cleaning, and bike cleaning services. You can book any of these services online or by contacting our support team.",
	},
	{
		question: "What are your operating hours?",
		answer: "We operate between 9 AM and 8 PM from Monday to Saturday, and 10 AM to 6 PM on Sundays.",
	},
];

const testimonials = [
	{
		name: "Michael brown",
		img: "https://randomuser.me/api/portraits/men/32.jpg",
		stars: 4,
		text: "Really impressed with the car wash service at Bubble Flash Car Wash! The team was professional, friendly, and detailed in their work. My car looked spotless afterward.",
	},
	{
		name: "Meera goyal",
		img: "https://randomuser.me/api/portraits/women/44.jpg",
		stars: 5,
		text: "Tried Bubble Flash Laundry for the first time and was genuinely impressed! My clothes came back fresh, neatly folded, and smelled amazing. The pickup and delivery were smooth and right on time.",
	},
	{
		name: "Rahul Sharma",
		img: "https://randomuser.me/api/portraits/men/45.jpg",
		stars: 5,
		text: "Excellent bike cleaning! My bike looks brand new. Fast service and very convenient.",
	},
	{
		name: "Priya Singh",
		img: "https://randomuser.me/api/portraits/women/65.jpg",
		stars: 4,
		text: "The laundry service is top-notch. Pickup and delivery were on time, and the clothes were perfectly cleaned.",
	},
	{
		name: "Amit Verma",
		img: "https://randomuser.me/api/portraits/men/77.jpg",
		stars: 5,
		text: "Very happy with the car wash. Staff is polite and the process is hassle-free.",
	},
	{
		name: "Sneha Patel",
		img: "https://randomuser.me/api/portraits/women/32.jpg",
		stars: 5,
		text: "Affordable and reliable laundry service. Highly recommended!",
	},
];

export default function ServicesPage() {
	const [openIdx, setOpenIdx] = useState(0);
	const [visibleCount, setVisibleCount] = useState(4);
	const [carousel, setCarousel] = useState(testimonials);

	// Responsive visibleCount
	useEffect(() => {
		function handleResize() {
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

	useEffect(() => {
		const interval = setInterval(() => {
			setCarousel((prev) => {
				const [first, ...rest] = prev;
				return [...rest, first];
			});
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-[#f7f7f7] min-h-screen pb-16">
			<div className="max-w-6xl mx-auto pt-12 px-4 flex flex-col md:flex-row gap-8">
				{/* Left: Callback Form */}
				<div className="bg-white rounded-xl border border-black p-8 w-full md:w-[350px] flex flex-col items-center shadow-sm">
					<div className="flex items-center gap-2 mb-4">
						<span className="text-lg font-semibold">Request a callback</span>
					</div>
					<form className="w-full flex flex-col gap-4">
						<div className="flex items-center gap-2 border rounded px-3 py-2 bg-[#f7f7f7]">
							<span className="text-lg">👤</span>
							<input
								className="bg-transparent outline-none flex-1"
								placeholder="Enter your name"
							/>
						</div>
						<div className="flex items-center gap-2 border rounded px-3 py-2 bg-[#f7f7f7]">
							<span className="text-lg">📞</span>
							<input
								className="bg-transparent outline-none flex-1"
								placeholder="Enter your mobile no"
							/>
						</div>
						<div className="flex items-center gap-2 border rounded px-3 py-2 bg-[#f7f7f7]">
							<span className="text-lg">✉️</span>
							<input
								className="bg-transparent outline-none flex-1"
								placeholder="Enter your email"
							/>
						</div>
						<textarea
							className="border rounded px-3 py-2 bg-[#f7f7f7] min-h-[60px] outline-none"
							placeholder="Enter your message......"
						/>
						<div className="text-pink-600 text-sm">
							We are operating between 9 AM - 8 PM
						</div>
						<button
							type="submit"
							className="bg-[#d14fff] text-white rounded px-6 py-2 font-semibold mt-2"
						>
							Call me
						</button>
					</form>
				</div>
				{/* Right: Info Cards */}
				<div className="flex-1 flex flex-col gap-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div
							className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm cursor-pointer"
							onClick={() => {
								window.open('https://wa.me/919980123452', '_blank');
							}}
						>
							<div className="flex items-center gap-2 font-bold text-lg">
								📞 Ask us on Whatsapp
							</div>
							<div className="text-gray-500 text-sm">
								Get instant support and updates in whatsapp for our service
							</div>
							<div className="flex justify-end">
								<span className="text-2xl">&gt;</span>
							</div>
						</div>
						<div
							className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm cursor-pointer"
							onClick={() => {
								const faqSection = document.getElementById("faq-section");
								if (faqSection)
									faqSection.scrollIntoView({ behavior: "smooth" });
							}}
						>
							<div className="flex items-center gap-2 font-bold text-lg">
								❓ FAQ
							</div>
							<div className="text-gray-500 text-sm">
								Get instant support for our service via our FAQ section
							</div>
							<div className="flex justify-end">
								<span className="text-2xl">&gt;</span>
							</div>
						</div>
						<div
							className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm col-span-1 md:col-span-2 cursor-pointer"
							onClick={() => {
								window.open('https://maps.app.goo.gl/mqVWff6HjLuDCcrD9', '_blank');
							}}
						>
							<div className="flex items-center gap-2 font-bold text-lg">
								📍 Contact Information
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
				<h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">Choose your package</h2>
				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
					{/* Quick shine car */}
					<div className="bg-white rounded-xl border shadow-sm p-8 flex flex-col items-center gap-4 transition-all duration-200 hover:shadow-2xl hover:z-10 relative">
						<div className="text-2xl font-bold mb-2">Quick shine car</div>
						<div className="text-xl font-semibold mb-2">₹199</div>
						<ul className="text-gray-700 text-base mb-4 list-disc list-inside">
							<li>Exterior wash with high-pressure watergun</li>
							<li>Soft-touch mild soap</li>
							<li>Swirl-free clean</li>
							<li>Deep-cleaning of car mats</li>
						</ul>
						<button className="bg-[#FFD600] text-black rounded-lg border border-black px-5 py-1.5 font-semibold text-base transition-colors duration-200 hover:bg-yellow-300 mx-auto">Get Services</button>
					</div>
					{/* Bike wash */}
					<div className="bg-white rounded-xl border shadow-sm p-8 flex flex-col items-center gap-4 transition-all duration-200 hover:shadow-2xl hover:z-10 relative">
						<div className="text-2xl font-bold mb-2">Bike wash</div>
						<div className="text-xl font-semibold mb-2">₹99</div>
						<ul className="text-gray-700 text-base mb-4 list-disc list-inside">
							<li>Gentle exterior water wash</li>
							<li>Wheel cleaning with specialized wheel cleaner</li>
							<li>High-pressure tyre wash for spotless finish</li>
						</ul>
						<button className="bg-[#FFD600] text-black rounded-lg border border-black px-5 py-1.5 font-semibold text-base transition-colors duration-200 hover:bg-yellow-300 mx-auto">Get Services</button>
					</div>
					{/* Laundry wash */}
					<div className="bg-white rounded-xl border shadow-sm p-8 flex flex-col items-center gap-4 transition-all duration-200 hover:shadow-2xl hover:z-10 relative">
						<div className="text-2xl font-bold mb-2">Laundry wash</div>
						<div className="text-xl font-semibold mb-2">₹99</div>
						<ul className="text-gray-700 text-base mb-4 list-disc list-inside">
							<li>Gentle exterior water wash</li>
							<li>Wheel cleaning with specialized wheel cleaner</li>
							<li>High-pressure tyre wash for spotless finish</li>
						</ul>
						<button className="bg-[#FFD600] text-black rounded-lg border border-black px-5 py-1.5 font-semibold text-base transition-colors duration-200 hover:bg-yellow-300 mx-auto">Get Services</button>
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
						style={{ width: "max-content" }}
					>
						{carousel.slice(0, visibleCount).map((t, idx) => (
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
			<div className="mt-16 bg-[#f7f7f7] py-12">
				<h2
					id="faq-section"
					className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8"
				>
					Frequently Asked Questions
				</h2>
				<div className="max-w-4xl mx-auto flex flex-col gap-6 px-4">
					{FAQS.map((faq, i) => (
						<div key={i} className="bg-white border rounded-xl shadow-sm">
							<button
								className="w-full flex justify-between items-center px-6 py-6 text-lg font-medium focus:outline-none"
								onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
							>
								<span>{faq.question}</span>
								<span className="text-2xl">
									{openIdx === i ? "▲" : "▼"}
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
		</div>
	);
}
