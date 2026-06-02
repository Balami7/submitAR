import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await the params before using the ID
  const { id } = await params;
  
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await the params before using the ID
  const { id } = await params;
  const body = await req.json();
  
  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      adminNotes: body.adminNotes,
    },
  });
  return NextResponse.json(updated);
}