import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const reference = new URL(req.url).searchParams.get('reference');
    if (!reference) {
      return NextResponse.json({ error: 'No reference provided' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Paystack is not configured' }, { status: 500 });
    }

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });

    const data = await res.json();
    const success = Boolean(data.status && data.data?.status === 'success');

    return NextResponse.json({
      success,
      reference,
      amount: data.data?.amount ? data.data.amount / 100 : null,
      status: data.data?.status ?? null,
      csn: data.data?.metadata?.csn ?? null,
      email: data.data?.customer?.email ?? null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
