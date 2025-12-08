import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, currentPass, newPass } = body;

    if (!username || !currentPass || !newPass) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    // Compare current password
    if (admin.password !== currentPass) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: newPass },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
