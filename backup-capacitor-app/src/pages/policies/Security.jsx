import React from 'react';

export default function Security() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Security</h1>
      <p className="text-gray-500 mb-8">Last updated on Aug 28 2025</p>

      <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
        <h2>Data Security</h2>
        <ul>
          <li>All communication with our site uses HTTPS.</li>
          <li>Payment processing is handled by Razorpay; we do not store card numbers or CVV.</li>
          <li>Access to customer information is restricted to authorized staff on a need-to-know basis.</li>
        </ul>

        <h2>Operational Security</h2>
        <ul>
          <li>Employee devices follow basic hardening and sign-in controls.</li>
          <li>Before/after service images are stored securely and used for quality assurance.</li>
          <li>Audit logs are maintained for critical actions when available.</li>
        </ul>

        <h2>Responsible Disclosure</h2>
        <p>
          If you believe you have found a security issue, please contact us at support@bubbleflashservices.in
          with details. Do not publicly disclose issues until we have had a chance to investigate.
        </p>
      </div>
    </div>
  );
}
