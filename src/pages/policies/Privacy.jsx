import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated on Aug 28 2025</p>

      <div className="prose prose-sm md:prose-base max-w-none text-gray-800">
        <p>
          Bubble Flash Services ("we", "us", "our") respects your privacy. This policy explains what
          information we collect, how we use it, and the choices you have. By using our website and
          services, you agree to this policy.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Account details (name, phone, email, addresses) to provide services and invoices.</li>
          <li>Order and payment metadata (amounts, status, timestamps). We do not store your card details.</li>
          <li>Device and usage info to improve performance and security.</li>
        </ul>

        <h2>Payments</h2>
        <p>
          Online payments are processed securely by our payment partner Razorpay. Your payment
          instruments are handled by Razorpay as per their policies and security standards. We receive
          a confirmation token/metadata and do not store full card or UPI credentials.
        </p>

        <h2>How we use your data</h2>
        <ul>
          <li>To fulfill bookings, customer support, and service notifications.</li>
          <li>To prevent fraud, ensure security, and comply with law.</li>
          <li>To improve our products, pricing, and user experience.</li>
        </ul>

        <h2>Data sharing</h2>
        <p>
          We share data only with service providers that help us run operations (for example: payment
          processing, analytics, cloud hosting). We do not sell your personal information.
        </p>

        <h2>Data retention</h2>
        <p>
          We keep your data for as long as needed to provide services and meet legal requirements. You
          can request deletion of your account subject to lawful retention obligations.
        </p>

        <h2>Your rights</h2>
        <ul>
          <li>Access, correct, or delete your personal information.</li>
          <li>Opt out of non-essential communications.</li>
          <li>Raise a complaint with us using the contacts below.</li>
        </ul>

        <h2>Contact</h2>
        <p>
          Address: 1, 129, Thukaram, Vasanthapura Main Road, Sri Ganesha Darshan Hotel, Subramanyapura,
          Bengaluru, Karnataka, 560061.
          <br />Email: support@bubbleflash.com, web_bfsnow@outlook.com
          <br />Phone: 9591572775
        </p>

        <h2>Related policies</h2>
        <ul>
          <li>
            Shipping Policy: <a className="text-blue-600 underline" href="https://merchant.razorpay.com/policy/RAlNnmaOW7xtwL/shipping" target="_blank" rel="noreferrer">View</a>
          </li>
          <li>
            Cancellation &amp; Refunds: <a className="text-blue-600 underline" href="https://merchant.razorpay.com/policy/RAlNnmaOW7xtwL/refund" target="_blank" rel="noreferrer">View</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
