import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, amount, csn } = await req.json();

    if (!email || !amount) {
      return NextResponse.json({ error: 'Email and amount are required' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Paystack is not configured' }, { status: 500 });
    }

    const origin = req.headers.get('origin') ?? new URL(req.url).origin;

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(Number(amount) * 100), // Paystack expects the amount in kobo
        currency: 'NGN',
        metadata: { csn },
        callback_url: `${origin}/payment/callback`,
      }),
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize payment' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
