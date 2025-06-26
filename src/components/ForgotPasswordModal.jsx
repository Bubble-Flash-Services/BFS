import React, { useState } from 'react';

export default function ForgotPasswordModal({ onSubmit, onClose }) {
  const [mode, setMode] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let ok;
      if (mode === 'email') {
        ok = await onSubmit({ email });
      } else {
        ok = await onSubmit({ phone });
      }
      if (ok?.success) setSent(true);
    } catch (e) { setError('Failed to send reset link/OTP'); }
    setLoading(false);
  };

  const handleReset = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'email') {
        await onSubmit({ email, resetToken, password: newPassword });
      } else {
        await onSubmit({ phone, otp, password: newPassword });
      }
      setSent(false);
      setResetToken('');
      setOtp('');
      setNewPassword('');
      onClose();
    } catch (e) { setError('Failed to reset password'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <div className="flex gap-2 mb-4">
          <button className={`px-3 py-1 rounded-full text-sm font-bold ${mode==='email' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'}`} onClick={()=>setMode('email')}>Email</button>
          <button className={`px-3 py-1 rounded-full text-sm font-bold ${mode==='phone' ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'}`} onClick={()=>setMode('phone')}>Mobile</button>
        </div>
        {!sent ? (
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            {mode === 'email' ? (
              <input className="border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            ) : (
              <input className="border rounded p-2" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile Number" required />
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? (mode==='email' ? 'Sending...' : 'Sending OTP...') : (mode==='email' ? 'Send Reset Link' : 'Send OTP')}</button>
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            {mode === 'email' ? (
              <input className="border rounded p-2" value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder="Reset Token" required />
            ) : (
              <input className="border rounded p-2" value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" required />
            )}
            <input className="border rounded p-2" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required />
            {error && <div className="text-red-500 text-sm">{error}</div>}
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
