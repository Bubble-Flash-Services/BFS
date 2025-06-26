import React, { useState } from 'react';
import { signup, sendOtp, verifyOtp } from '../../../api/auth';

export default function SignupModal({ onSuccess, onClose }) {
  const [step, setStep] = useState('choose'); // choose/email/mobile/otp
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleEmailSignup = async e => {
    e.preventDefault(); setLoading(true); setError('');
    const res = await signup(form);
    setLoading(false);
    if (res.token) { onSuccess(res); onClose(); }
    else setError(res.error || 'Signup failed');
  };

  const handleSendOtp = async e => {
    e.preventDefault(); setLoading(true); setError('');
    const res = await sendOtp({ phone: form.phone });
    setLoading(false);
    if (res.success) setStep('otp');
    else setError(res.error || 'Failed to send OTP');
  };

  const handleVerifyOtp = async e => {
    e.preventDefault(); setLoading(true); setError('');
    const res = await verifyOtp({ phone: form.phone, otp: form.otp });
    setLoading(false);
    if (res.token) { onSuccess(res); onClose(); }
    else setError(res.error || 'Invalid OTP');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        {step === 'choose' && (
          <div className="flex flex-col gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setStep('email')}>Sign up with Email</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => setStep('mobile')}>Sign up with Mobile</button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          </div>
        )}
        {step === 'email' && (
          <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
            <input name="name" className="border rounded p-2" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="email" className="border rounded p-2" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="password" type="password" className="border rounded p-2" value={form.password} onChange={handleChange} placeholder="Password" required />
            <input name="address" className="border rounded p-2" value={form.address} onChange={handleChange} placeholder="Address" />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setStep('choose')}>Back</button>
            </div>
          </form>
        )}
        {step === 'mobile' && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
            <input name="name" className="border rounded p-2" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="phone" className="border rounded p-2" value={form.phone} onChange={handleChange} placeholder="Mobile Number" required />
            <input name="address" className="border rounded p-2" value={form.address} onChange={handleChange} placeholder="Address" />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setStep('choose')}>Back</button>
            </div>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
            <input name="otp" className="border rounded p-2" value={form.otp} onChange={handleChange} placeholder="Enter OTP" required />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setStep('mobile')}>Back</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
