'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { 
  FaEdit, 
  FaSpinner, 
  FaLock, 
  FaExclamationCircle, 
  FaRegUser, 
  FaPhoneAlt, 
  FaRegEnvelope, 
  FaMapMarkerAlt,
  FaCheckCircle
} from 'react-icons/fa';

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading your order details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Order Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find your order data. It seems your session may have expired or the order wasn't saved properly.</p>
          <a href="/get-started" className="inline-flex items-center justify-center w-full bg-blue-600 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            Return to Form
          </a>
        </div>
      </div>
    );
  }

  const contactRows = [
    { label: 'Name', value: data.fullName, icon: <FaRegUser /> },
    { label: 'Phone', value: data.phone, icon: <FaPhoneAlt /> },
    { label: 'Email', value: data.email, icon: <FaRegEnvelope /> },
    { label: 'Address', value: [data.streetAddress, data.city].filter(Boolean).join(', '), icon: <FaMapMarkerAlt /> },
  ].filter((item) => item.value);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50/50 pb-20 pt-8">
        <div className="max-w-2xl mx-auto px-5">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Review Order</h1>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                <FaCheckCircle className="text-green-600" />
                Approved
              </span>
            </div>
            <p className="text-gray-500 font-medium">Order #{data.csn || 'Pending'}</p>
          </div>

          <div className="space-y-6">
            {/* Service Breakdown Card */}
            <div className="bg-white shadow-sm border border-gray-200/80 rounded-2xl p-6 md:p-8 transition-all hover:shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                Service Breakdown
              </h2>
              
              <div className="divide-y divide-gray-100">
                {data.lineItems?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between py-4 first:pt-0">
                    <div className="pr-4">
                      <p className="text-gray-800 font-medium">{item.label}</p>
                      {item.note && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.note}</p>}
                    </div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap">₦{item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-5 mt-2 border-t border-gray-200 bg-gray-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 pb-6 md:pb-8 rounded-b-2xl">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-2xl font-black text-blue-600 tracking-tight">
                  ₦{typeof data.total === 'number' ? data.total.toLocaleString() : data.total}
                </span>
              </div>
            </div>

            {/* Contact Information Card */}
            {contactRows.length > 0 && (
              <div className="bg-white shadow-sm border border-gray-200/80 rounded-2xl p-6 md:p-8 transition-all hover:shadow-md">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Contact Information</h2>
                <dl className="space-y-4">
                  {contactRows.map((row, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <dt className="flex items-center gap-3 text-sm font-medium text-gray-500">
                        <span className="text-gray-400 text-base">{row.icon}</span>
                        {row.label}
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900 text-right break-words max-w-[60%]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Order Journey — what happens after payment */}
            <div className="bg-white shadow-sm border border-gray-200/80 rounded-2xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-1">After you pay</h2>
              <p className="text-sm text-gray-600 mb-6">
                You&apos;ll get a tracking ID and can follow your order through these stages on the{' '}
                <span className="font-semibold text-gray-800">Track Your Order</span> page.
              </p>
              <ol className="flex flex-wrap items-center gap-y-4">
                {['Pending', 'In Progress', 'In Transit', 'Delivered', 'Completed'].map((step, i, arr) => (
                  <li key={step} className="flex items-center">
                    <div className="flex flex-col items-center text-center w-20">
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                          i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`text-xs mt-2 ${i === 0 ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>
                        {step}
                      </span>
                    </div>
                    {i < arr.length - 1 && <div className="w-6 h-0.5 bg-gray-200 -mt-6" />}
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-4 focus:ring-gray-100 outline-none"
              >
                <FaEdit className="text-gray-500" /> Edit Request
              </button>
              
              <button
                onClick={handlePay}
                disabled={paying}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-100 outline-none"
              >
                {paying ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" /> Redirecting...
                  </>
                ) : (
                  'Confirm & Pay'
                )}
              </button>
            </div>

            {/* Secure Payment Footer */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-6">
              <FaLock className="text-gray-400" />
              <p>Secure payment powered by <span className="font-semibold text-gray-700">Paystack</span></p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}