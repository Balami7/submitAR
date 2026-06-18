'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';

const STATUS_STEPS = ['PENDING', 'IN_PROGRESS', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'];

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

// Fields we never want to render as raw rows (handled specially or internal).
const HIDDEN_FIELDS = new Set([
  'id', 'status', 'csn', 'lineItems', 'total', 'createdAt', 'updatedAt',
]);

function humanize(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/Url$/i, 'URL')
    .trim();
}

function formatValue(value: any): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) return value.length ? value.join(', ') : null;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    const parts = Object.entries(value)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => `${humanize(k)}: ${v}`);
    return parts.length ? parts.join(' · ') : null;
  }
  // ISO date strings
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });
  }
  return String(value);
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [csn, setCsn] = useState(searchParams.get('csn') ?? '');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    if (!csn.trim() || !email.trim()) {
      setError('Please enter both your order number and email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/track?csn=${encodeURIComponent(csn.trim())}&email=${encodeURIComponent(email.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not find your order.');
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const detailRows = order
    ? Object.entries(order)
        .filter(([k]) => !HIDDEN_FIELDS.has(k))
        .map(([k, v]) => [k, formatValue(v)] as [string, string | null])
        .filter(([, v]) => v !== null)
    : [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-10 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track your order</h1>
          <p className="text-gray-700 mb-8">
            Enter your order number (CSN) and the email you used.
          </p>

          {/* Search form */}
          <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order number (CSN)</label>
                <input
                  type="text"
                  value={csn}
                  onChange={(e) => setCsn(e.target.value)}
                  placeholder="e.g. CSN-1006626"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email on the order"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Searching...' : 'Track order'}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-8">
              {error}
            </div>
          )}

          {/* Result */}
          {order && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-600">Order number</p>
                  <p className="text-xl font-bold text-gray-900">{order.csn}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>

              {/* Progress bar (hidden for cancelled) */}
              {order.status !== 'CANCELLED' && (
                <div className="px-6 pt-6">
                  <div className="flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const reached = STATUS_STEPS.indexOf(order.status) >= i;
                      return (
                        <div key={step} className="flex-1 text-center">
                          <div className={`w-4 h-4 mx-auto rounded-full ${reached ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          <p className={`text-xs mt-2 ${reached ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>
                            {STATUS_LABELS[step]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Line items + total */}
              {Array.isArray(order.lineItems) && order.lineItems.length > 0 && (
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
                  <div className="space-y-2">
                    {order.lineItems.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-800">{item.label}</span>
                        <span className="font-medium text-gray-900">₦{Number(item.amount).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t border-gray-100 font-bold text-gray-900">
                      <span>Total</span>
                      <span>₦{Number(order.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* All other details */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Order details</h3>
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {detailRows.map(([key, val]) => (
                    <div key={key}>
                      <dt className="text-xs text-gray-600 font-medium">{humanize(key)}</dt>
                      <dd className="text-sm text-gray-900 break-words">{val}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-xs text-gray-600 mt-6">
                  Placed on {new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
