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
          {items.map((it, idx) => {
            const addOns = it.addOns || [];
            const baseTotal = (it.price || 0) * (it.quantity || 1);
            const addOnsTotal = addOns.reduce((s, a) => s + (a.price || 0) * (a.quantity || 1), 0);
            const itemTotal = baseTotal + addOnsTotal;
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
                      <h5 className="text-sm font-medium text-gray-700">Included Features</h5>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {it.includedFeatures.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Plan details (if subscription) */}
                  {it.planDetails && (it.planDetails.weeklyIncludes?.length || it.planDetails.washIncludes?.length) && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">Plan Details</h5>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {(it.planDetails.washIncludes || it.planDetails.weeklyIncludes || []).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
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
              <div className="flex justify-between">
                <span>Service charge</span>
                <span className="font-medium">{pricing.serviceCharge ? currency(pricing.serviceCharge) : 'FREE'}</span>
              </div>
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
