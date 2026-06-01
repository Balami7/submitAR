'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { FaDownload, FaEdit } from 'react-icons/fa';

export default function ReviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-6xl mx-auto py-12 px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold text-white">Order Summary</h1>
              <p className="text-green-400 font-medium text-lg mt-2">CSN-{data.csn || 'PENDING'}</p>
            </div>
            <span className="px-6 py-2 bg-green-500 text-white rounded-full font-medium text-lg">Approved</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left - Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-white">Service Breakdown</h2>
                <div className="space-y-5">
                  {data.lineItems?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between border-b border-gray-700 pb-4">
                      <div>
                        <p className="font-medium text-gray-200">{item.label}</p>
                        {item.note && <p className="text-xs text-green-400 mt-0.5">{item.note}</p>}
                      </div>
                      <p className="font-semibold text-right text-gray-100">₦{item.amount.toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="pt-6 border-t border-gray-700 flex justify-between text-3xl font-bold text-green-400">
                    <span>Total</span>
                    <span>₦{typeof data.total === 'number' ? data.total.toLocaleString() : data.total}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-lg">
                <h3 className="font-bold mb-6 text-white text-lg">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-medium">{data.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">{data.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{data.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white font-medium">{data.streetAddress || 'N/A'}, {data.city || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Document Preview */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden shadow-lg">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">Business Proposal</p>
                    <p className="text-sm opacity-90">Document Creation • Ready for Review</p>
                  </div>
                  <FaDownload className="text-3xl" />
                </div>

                <div className="p-16 bg-gray-900 min-h-[480px] flex flex-col items-center justify-center border-b border-gray-700">
                  <div className="text-[120px] mb-6 opacity-50">📄</div>
                  <p className="text-2xl font-medium text-gray-300">Document Preview</p>
                  <p className="text-gray-400 mt-3 text-center max-w-md">Your final document will be available here after approval and payment.</p>
                </div>

                <div className="p-6 flex gap-4">
                  <button
                    onClick={() => window.history.back()}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-600 py-4 rounded-2xl font-medium text-white hover:bg-gray-700 transition-colors"
                  >
                    <FaEdit /> Edit Request
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-2xl font-semibold text-lg transition-all">
                    Confirm & Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}