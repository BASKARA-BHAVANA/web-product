import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const specials = (process.env.SPECIAL_USERS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (specials.length > 0) {
    await prisma.user.updateMany({
      where: { email: { in: specials } },
      data: { role: 'SUPERADMIN' },
    });
  }

  return NextResponse.json({
    message: 'Init complete.',
    data: [`Set ${specials.length} special users.`],
  });
}
