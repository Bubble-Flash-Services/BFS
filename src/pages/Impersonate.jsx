import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getProfile, updateProfile } from '../api/auth';
import { getLastOrder } from '../api/orders';

export default function Impersonate() {
  const navigate = useNavigate();
  const { updateAuth } = useAuth();
  const [needsDetails, setNeedsDetails] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    // Store token then fetch profile to determine if we need details
    localStorage.setItem('token', token);
    (async () => {
      try {
        const profile = await getProfile(token);
        if (profile && !profile.error) {
          const hasPhone = typeof profile.phone === 'string' && profile.phone.trim().length >= 8;
          const hasAddress = typeof profile.address === 'string' && profile.address.trim().length >= 5;
          if (!hasPhone || !hasAddress) {
            // Try to auto-fill from last order
            try {
              const lo = await getLastOrder(token);
              const order = lo?.data?.orders?.[0];
              const phoneFromOrder = order?.serviceAddress?.phone || order?.paymentDetails?.contact;
              const addrFromOrder = order?.serviceAddress?.fullAddress;
              const phoneOkay = typeof phoneFromOrder === 'string' && phoneFromOrder.trim().length >= 8;
              const addrOkay = typeof addrFromOrder === 'string' && addrFromOrder.trim().length >= 5;
              if (phoneOkay || addrOkay) {
                const updated = await updateProfile(token, {
                  ...(phoneOkay ? { phone: phoneFromOrder } : {}),
                  ...(addrOkay ? { address: addrFromOrder } : {})
                });
                updateAuth(token, updated);
                navigate('/', { replace: true });
                return;
              }
            } catch (e) {
              // ignore and fall back to prompt
            }
            setNeedsDetails(true);
            return;
          }
          updateAuth(token, profile);
          navigate('/', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (e) {
        navigate('/', { replace: true });
      }
    })();
  }, [navigate, updateAuth]);

  if (needsDetails) {
    const token = localStorage.getItem('token');
    const save = async (e) => {
      e.preventDefault();
      if (!phone.trim() || !address.trim()) return;
      try {
        const updated = await updateProfile(token, { phone, address });
        updateAuth(token, updated);
        navigate('/', { replace: true });
      } catch {
        // soft-fail, stay on the form
      }
    };
    return (
      <>
        {createPortal(<div className="fixed inset-0 z-[9998] bg-black/0" />, document.body)}
        {createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <form onSubmit={save} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
              <h1 className="text-xl font-bold">Complete profile for impersonated user</h1>
              <p className="text-sm text-gray-600">Phone and address are required to proceed.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input className="w-full border rounded-md px-3 py-2" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Enter phone" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea className="w-full border rounded-md px-3 py-2" rows="3" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Enter address" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 font-semibold">Save & Continue</button>
            </form>
          </div>, document.body
        )}
      </>
    );
  }

  return <div className="p-6">Switching account...</div>;
}
