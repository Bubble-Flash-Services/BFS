import React from 'react';
import { X } from 'lucide-react';

function currency(n) {
  if (n === undefined || n === null || isNaN(n)) return '₹0';
  return `₹${Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const OrderDetailsModal = ({ open, onClose, order }) => {
  if (!open) return null;
  const items = order?.items || [];
  const pricing = order?.pricing || {};
  const getItemGroup = (it) => {
    const type = (it.type || '').toLowerCase();
    const label = ((it.serviceName || '') + ' ' + (it.vehicleType || '')).toLowerCase();
    if (type.includes('autofix')) return 'AutoFix';
    if (type.includes('car')) return 'Car';
    if (type.includes('bike')) return 'Bike';
    if (type.includes('helmet')) return 'Helmet';
    if (/hatch|sedan|suv|mid\s*-\s*suv|luxur/.test(label)) return 'Car';
    if (/scooter|motorbike|cruiser|bike/.test(label)) return 'Bike';
    if (/helmet/.test(label)) return 'Helmet';
    return 'Others';
  };
  const groupOrder = ['Car','Bike','Helmet','AutoFix','Others'];
  const grouped = groupOrder
    .map((g) => ({ key: g, items: items.filter((it) => getItemGroup(it) === g) }))
    .filter((g) => g.items.length);

  // Compute counts
  const itemsCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0) || items.length || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            {order?.orderNumber && (
              <p className="text-xs text-gray-500">Order No: {order.orderNumber}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {grouped.map((grp) => (
            <div key={grp.key}>
              <h3 className="text-base font-bold text-gray-800 mb-2">{grp.key}</h3>
              {grp.items.map((it, idx) => {
            const addOns = it.addOns || [];
            const laundryItems = it.laundryItems || [];
            const baseTotal = (it.price || 0) * (it.quantity || 1);
            const addOnsTotal = addOns.reduce((s, a) => s + (a.price || 0) * (a.quantity || 1), 0);
            const laundryTotal = laundryItems.reduce((s, l) => s + (l.pricePerItem || 0) * (l.quantity || 1), 0);
            const itemTotal = baseTotal + addOnsTotal + laundryTotal;
            return (
              <div key={idx} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{it.serviceName || it.packageName}</h3>
                    {it.vehicleType && <p className="text-sm text-gray-600">{it.vehicleType}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{currency(it.price)}</div>
                    <div className="text-xs text-gray-500">{it.quantity > 1 ? `${currency(it.price)} each` : `${currency(it.price)} each`}</div>
                  </div>
                </div>

                {/* Package Includes */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800">Package Includes</h4>
                  <div className="text-sm text-gray-700">
                    {it.packageName && (
                      <div className="flex justify-between">
                        <span>Base Service: {it.packageName}</span>
                        <span className="font-medium">{currency(it.price)}</span>
                      </div>
                    )}
                  </div>
                  {Array.isArray(it.includedFeatures) && it.includedFeatures.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">{(it.type||'')==='monthly_plan' ? 'Plan Features' : 'Included Features'}</h5>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {it.includedFeatures.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Full Monthly Plan details */}
                  {it.planDetails && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Array.isArray(it.planDetails.washIncludes) && it.planDetails.washIncludes.length > 0 && (
                        <div className="bg-white rounded p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Each Wash Includes</p>
                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                            {it.planDetails.washIncludes.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(it.planDetails.weeklyIncludes) && it.planDetails.weeklyIncludes.length > 0 && (
                        <div className="bg-white rounded p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Weekly Includes</p>
                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                            {it.planDetails.weeklyIncludes.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(it.planDetails.biWeeklyIncludes) && it.planDetails.biWeeklyIncludes.length > 0 && (
                        <div className="bg-white rounded p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Bi-Weekly Includes</p>
                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                            {it.planDetails.biWeeklyIncludes.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(it.planDetails.monthlyBonuses) && it.planDetails.monthlyBonuses.length > 0 && (
                        <div className="bg-white rounded p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Monthly Bonuses</p>
                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                            {it.planDetails.monthlyBonuses.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}
                      {Array.isArray(it.planDetails.platinumExtras) && it.planDetails.platinumExtras.length > 0 && (
                        <div className="bg-white rounded p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Premium Extras</p>
                          <ul className="list-disc ml-5 text-xs text-gray-600 space-y-1">
                            {it.planDetails.platinumExtras.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add-ons */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-800">Add-ons</h4>
                    {addOns.length === 0 ? (
                      <p className="text-sm text-gray-500">None</p>
                    ) : (
                      <div className="mt-2 space-y-1">
                        {addOns.map((a, ai) => (
                          <div key={ai} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span>+ {a.name}</span>
                              {a.quantity ? <span className="text-gray-500">× {a.quantity}</span> : null}
                            </div>
                            <span className="font-medium">{currency((a.price || 0) * (a.quantity || 1))}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="mt-3 text-sm text-gray-700">Quantity: <span className="font-medium">{it.quantity || 1}</span></div>

                  {/* Item Total */}
                  <div className="mt-2 flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-semibold">Item Total</span>
                    <span className="text-base font-bold">{currency(itemTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
            </div>
          ))}

          {/* Order Summary */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({itemsCount} {itemsCount > 1 ? 'items' : 'item'})</span>
                <span className="font-medium">{currency(pricing.subtotal || 0)}</span>
              </div>
              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount {pricing.couponCode ? `(${pricing.couponCode})` : ''}</span>
                  <span className="font-medium">- {currency(pricing.discountAmount)}</span>
                </div>
              )}
              {/* Service charge removed as per request */}
              <div className="flex justify-between pt-2 border-t text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{currency(pricing.totalAmount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
