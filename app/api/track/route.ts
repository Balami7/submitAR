import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim();

    if (!email) {
      return NextResponse.json(
        { error: 'Please enter the email you used on the order.' },
        { status: 400 }
      );
    }

    // Look up by email only — return the customer's most recent order.
    const order = await prisma.order.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No order found for that email. Please double-check and try again.' },
        { status: 404 }
      );
    }

    // Return everything the customer submitted, but hide internal admin notes.
    const { adminNotes, ...safe } = order;
    return NextResponse.json({ order: safe });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
