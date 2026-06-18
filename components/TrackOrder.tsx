'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

export default function TrackOrder() {
  const router = useRouter();
  const [csn, setCsn] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const value = csn.trim();
    if (!value) return;
    router.push(`/track?csn=${encodeURIComponent(value)}`);
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Track your order</h2>
        <p className="text-gray-600 mb-6">
          Already placed a request? Enter your tracking ID to see its status.
        </p>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={csn}
              onChange={(e) => setCsn(e.target.value)}
              placeholder="Enter your tracking ID (e.g. CSN-1006626)"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Track
          </button>
        </form>
      </div>
    </section>
  );
}
