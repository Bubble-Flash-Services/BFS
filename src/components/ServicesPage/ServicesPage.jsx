import React, { useState } from "react";

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

export default function ServicesPage() {
	const [openIdx, setOpenIdx] = useState(0);
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
