'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { FaEdit } from 'react-icons/fa';

export default function ReviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    try {
      // Paystack requires an email; fall back to a placeholder when the order has none.
      const email =
        data?.email ||
        `order-${(data?.csn || 'unknown').toString().replace(/[^a-z0-9]/gi, '').toLowerCase()}@submitar.app`;

      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: data.total,
          csn: data.csn,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.authorization_url) {
        throw new Error(result.error || 'Could not start payment');
      }
      window.location.href = result.authorization_url;
    } catch (err: any) {
      console.error('Payment error:', err);
      alert(err.message || 'Failed to start payment. Please try again.');
      setPaying(false);
    }
  };

  useEffect(() => {
    console.log('ReviewPage mounted, checking sessionStorage...');
    const saved = sessionStorage.getItem('orderReview');
    console.log('sessionStorage.orderReview:', saved);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Parsed order data:', parsed);
        setData(parsed);
      } catch (err) {
        console.error('Failed to parse orderReview:', err);
      }
    } else {
      console.warn('No orderReview found in sessionStorage');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading order review...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">No order data found</p>
          <p className="text-gray-600 mb-6">It seems your order wasn't saved properly.</p>
          <a href="/get-started" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Go back to form
          </a>
        </div>
      </div>
    );
  }

  const contactRows = [
    ['Name', data.fullName],
    ['Phone', data.phone],
    ['Email', data.email],
    ['Address', [data.streetAddress, data.city].filter(Boolean).join(', ')],
  ].filter(([, value]) => value);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-12 px-5">
          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Review your order</h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                Approved
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">Order {data.csn || 'Pending'}</p>
          </div>

          {/* Service breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Service breakdown</h2>
            <div className="divide-y divide-gray-100">
              {data.lineItems?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-3">
                  <div>
                    <p className="text-gray-800">{item.label}</p>
                    {item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
                  </div>
                  <p className="font-medium text-gray-900">₦{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₦{typeof data.total === 'number' ? data.total.toLocaleString() : data.total}
              </span>
            </div>
          </div>

          {/* Contact information */}
          {contactRows.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Contact information</h2>
              <dl className="space-y-3">
                {contactRows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-sm text-gray-600">{label}</dt>
                    <dd className="text-sm text-gray-900 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3.5 px-6 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              <FaEdit /> Edit request
            </button>
            <button
              onClick={handlePay}
              disabled={paying}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {paying ? 'Redirecting to Paystack…' : 'Confirm & Pay'}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">Secure payment powered by Paystack</p>
        </div>
      </div>
    </>
  );
}
