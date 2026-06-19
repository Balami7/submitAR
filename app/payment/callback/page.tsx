'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentResult() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get('reference') ?? params.get('trxref');
  const [state, setState] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [csn, setCsn] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setState('failed');
      return;
    }
    fetch(`/api/paystack/verify?reference=${reference}`)
      .then((r) => r.json())
      .then((d) => {
        setCsn(d.csn ?? null);
        setEmail(d.email ?? null);
        setState(d.success ? 'success' : 'failed');
        if (d.success) {
          // Take the customer to the tracking page shortly after confirming.
          const dest = d.email ? `/track?email=${encodeURIComponent(d.email)}` : '/track';
          setTimeout(() => router.push(dest), 2500);
        }
      })
      .catch(() => setState('failed'));
  }, [reference, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        {state === 'verifying' && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900">Verifying payment...</h1>
            <p className="text-gray-600 mt-2">Please wait while we confirm your transaction.</p>
          </>
        )}
        {state === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600">Payment successful!</h1>
            <p className="text-gray-600 mt-2">
              Your payment has been confirmed. We&apos;ll begin processing your request.
            </p>
            {csn && (
              <p className="text-gray-700 mt-4">
                Your tracking ID is <span className="font-bold">{csn}</span> — keep it safe.
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">Taking you to order tracking…</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a
                href={email ? `/track?email=${encodeURIComponent(email)}` : '/track'}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Track your order
              </a>
              <a href="/" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50">
                Back to home
              </a>
            </div>
          </>
        )}
        {state === 'failed' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600">Payment not confirmed</h1>
            <p className="text-gray-600 mt-2">
              We couldn&apos;t verify your payment. If you were charged, please contact support.
            </p>
            <a href="/review" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Try again
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentResult />
    </Suspense>
  );
}
