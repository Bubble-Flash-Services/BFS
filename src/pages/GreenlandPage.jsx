import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function GreenlandPage() {
  const [form, setForm] = useState({ name: '', phone: '', location: '', service: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return alert('Please fill your name and mobile number');
    try {
      setSubmitting(true);
      // Reuse callback endpoint if available
      const res = await fetch((import.meta.env.VITE_API_URL || window.location.origin) + '/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: `Greenland Request | Service: ${form.service || '-'} | Location: ${form.location || '-'}`,
          source: 'greenland'
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data?.success || true)) {
        setSubmitted(true);
      } else {
        alert(data?.message || 'Failed to submit. Please call us directly.');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F3C88] via-[#234A9A] to-[#1F3C88]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1 rounded-full text-sm">
            <span className="text-[#FFB400]">✨</span>
            <span className="font-semibold">From Your Home to Office — Fresh, Quick, and Affordable Services</span>
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold">Book trusted home services instantly across Bangalore.</h1>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <a href="#callback" className="px-6 py-3 rounded-xl font-semibold bg-[#FFB400] text-[#1F3C88] hover:brightness-105">📩 Request a Call Back</a>
            <a href="tel:+919591572775" className="px-6 py-3 rounded-xl font-semibold border-2 border-white/70 text-white hover:bg-white/10">📞 Call Us Directly</a>
          </div>
        </motion.div>

        {/* Callback form */}
        <div id="callback" className="mt-10 grid md:grid-cols-2 gap-8">
          <motion.form onSubmit={handleSubmit} className="bg-white/95 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-[#1F3C88] mb-4">Request a Call Back</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="10-digit mobile" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location / Pincode</label>
                <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Area or Pincode" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
                <select name="service" value={form.service} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select a service</option>
                  <option>Home Deep Cleaning</option>
                  <option>Sofa & Carpet Cleaning</option>
                  <option>Bathroom & Kitchen Cleaning</option>
                  <option>Office & Workspace Cleaning</option>
                </select>
              </div>
              <button type="submit" disabled={submitting} className="mt-2 px-5 py-3 rounded-xl font-semibold bg-[#1F3C88] text-[#FFB400] hover:brightness-110 disabled:opacity-70">
                {submitting ? 'Submitting...' : 'Request Call Back'}
              </button>
              {submitted && <div className="text-green-700 font-medium">Thank you! We will call you within 30 minutes.</div>}
            </div>
          </motion.form>

          {/* 4 service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Home Deep Cleaning', desc: 'Full home cleaning with eco-friendly products.' },
              { title: 'Sofa & Carpet Cleaning', desc: 'Stain removal & fresh feel for your furniture.' },
              { title: 'Bathroom & Kitchen Cleaning', desc: 'Deep sanitization of tiles, sinks & fittings.' },
              { title: 'Office & Workspace Cleaning', desc: 'Professional cleaning for offices & co-working spaces.' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white/95 rounded-2xl p-5 shadow-xl border border-[#1F3C88]/10">
                <div className="text-[#1F3C88] font-bold text-lg">{c.title}</div>
                <div className="text-gray-600 mt-1 text-sm">{c.desc}</div>
                {/* Trust line removed per request */}
              </motion.div>
            ))}
            <div className="sm:col-span-2 text-center text-white/90 mt-2">🌍 Serving all of Bangalore.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
