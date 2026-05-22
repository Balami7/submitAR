'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { FaDownload, FaEdit } from 'react-icons/fa';

export default function ReviewPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('currentSubmission');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading order review...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Order Summary</h1>
            <p className="text-green-600 font-medium">CSN-{Math.floor(1000000 + Math.random() * 9000000)}</p>
          </div>
          <span className="px-6 py-2 bg-green-100 text-green-700 rounded-full font-medium">Approved</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Service Breakdown</h2>
              <div className="space-y-5">
                {data.lineItems?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      {item.note && <p className="text-xs text-green-600 mt-0.5">{item.note}</p>}
                    </div>
                    <p className="font-semibold text-right">₦{item.amount.toLocaleString()}</p>
                  </div>
                ))}
                <div className="pt-6 border-t flex justify-between text-3xl font-bold text-blue-700">
                  <span>Total</span>
                  <span>{data.total}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-8">
              <h3 className="font-bold mb-4">Contact Information</h3>
              <p><strong>Name:</strong> {data.fullName}</p>
              <p><strong>Phone:</strong> {data.phone}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>Address:</strong> {data.streetAddress}, {data.city}</p>
            </div>
          </div>

          {/* Right - Document Preview (Styled like your image) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow">
              <div className="bg-[#0052cc] text-white px-8 py-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">Business Proposal</p>
                  <p className="text-sm opacity-75">Document Creation • Ready for Review</p>
                </div>
                <FaDownload className="text-3xl" />
              </div>

              <div className="p-16 bg-gray-50 min-h-[480px] flex flex-col items-center justify-center">
                <div className="text-[120px] mb-6 opacity-70">📄</div>
                <p className="text-2xl font-medium text-gray-700">Document Preview</p>
                <p className="text-gray-500 mt-3 text-center max-w-md">Your final document will be available here after approval and payment.</p>
              </div>

              <div className="p-6 flex gap-4 border-t">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-4 rounded-2xl font-medium hover:bg-gray-50"
                >
                  <FaEdit /> Edit Request
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg">
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}