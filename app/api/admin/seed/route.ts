import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  const hashed = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.admin.create({
    data: { email: 'admin@submitar.com', password: hashed, name: 'Submitar Admin' },
  });
  return NextResponse.json({ created: admin.email });
}