import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawCsn = searchParams.get('csn')?.trim();
    const phone = searchParams.get('phone')?.trim();

    if (!rawCsn || !phone) {
      return NextResponse.json(
        { error: 'Please provide your order number and the phone number on the order.' },
        { status: 400 }
      );
    }

    // Be forgiving about the CSN format: accept "CSN-1234567" or just "1234567"
    const up = rawCsn.toUpperCase().replace(/\s/g, '');
    const csnCandidates = Array.from(
      new Set([up, up.startsWith('CSN-') ? up : `CSN-${up}`])
    );

    const order = await prisma.order.findFirst({
      where: {
        csn: { in: csnCandidates },
        phone,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No order found matching that order number and phone number. Please double-check and try again.' },
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
