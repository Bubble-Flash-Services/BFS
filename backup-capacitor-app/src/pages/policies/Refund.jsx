import React from 'react';

export default function Refund() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancellation &amp; Refund Policy</h1>
      <p className="text-gray-500 mb-8">Last updated on Aug 28 2025</p>
      <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
        <p>
          Bubble Flash Services believes in helping its customers as far as possible, and has therefore a
          liberal cancellation policy.
        </p>
        <ul>
          <li>Cancellations are considered only if requested within 7 days of placing the order.</li>
          <li>Cancellation may not be possible once the order has been handed over to the vendor/shipper.</li>
          <li>Perishables are generally non-cancellable; quality issues may be eligible for refund/replacement.</li>
          <li>Damaged/defective items must be reported within 7 days of receipt, subject to vendor verification.</li>
          <li>If a product varies significantly from its description, contact customer service within 7 days.</li>
          <li>Manufacturer-warranty items should be handled with the manufacturer directly.</li>
          <li>Approved refunds will be processed within 3-5 days.</li>
        </ul>
      </div>
    </div>
  );
}
