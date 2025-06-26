import React, { useState, useEffect } from 'react';

export default function ProfileModal({ user, onSave, onClose }) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAddress(user?.address || '');
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await onSave({ name, phone, address });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="border rounded p-2" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
          <input className="border rounded p-2" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" required />
          <input className="border rounded p-2" value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
