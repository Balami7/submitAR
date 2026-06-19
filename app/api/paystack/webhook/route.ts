import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// Paystack sends events here. We verify the signature, then mark the order paid.
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Paystack is not configured' }, { status: 500 });
  }

  // Raw body is required to verify the signature.
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  if (!signature || signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    if (event?.event === 'charge.success') {
      const data = event.data ?? {};
      const csn = data?.metadata?.csn as string | undefined;
      const reference = data?.reference as string | undefined;

      if (csn) {
        await prisma.order.updateMany({
          where: { csn },
          data: {
            paid: true,
            paidAt: new Date(),
            paymentRef: reference,
            status: 'IN_PROGRESS',
          },
        });
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    // Still return 200 so Paystack doesn't keep retrying a malformed-but-verified event.
  }

  // Acknowledge receipt quickly.
  return NextResponse.json({ received: true });
}
