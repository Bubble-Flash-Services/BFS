import React, { useState } from 'react';

export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequest = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const API = import.meta.env.VITE_API_URL || window.location.origin;
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Check your email for a reset code.');
        setStep('reset');
      } else {
        setError(data.message || 'Error sending reset email');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleReset = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const API = import.meta.env.VITE_API_URL || window.location.origin;
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetToken, password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password reset! You can now log in.');
        setTimeout(onClose, 2000);
      } else {
        setError(data.message || 'Error resetting password');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {step === 'request' ? (
          <form onSubmit={handleRequest} className="flex flex-col gap-4">
            <input className="border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Code'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <input className="border rounded p-2" value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder="Reset Code" required />
            <input className="border rounded p-2" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
