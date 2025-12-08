// /api/admin/child-admins/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper: check OWNER session
async function getOwnerSession(req) {
  const adminId = req.cookies.get('admin_session')?.value;
  if (!adminId) return null;

  const admin = await prisma.admin.findUnique({ where: { id: parseInt(adminId) } });
  if (!admin || admin.role !== 'OWNER') return null;

  return admin;
}

// GET: fetch all managers
export async function GET(req) {
  const owner = await getOwnerSession(req);
  if (!owner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const managers = await prisma.admin.findMany({
    where: { role: 'MANAGER' },
    select: { id: true, username: true, createdAt: true },
  });

  return NextResponse.json({ managers });
}

// POST: create new manager
export async function POST(req) {
  const owner = await getOwnerSession(req);
  if (!owner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }

  try {
    const newManager = await prisma.admin.create({
      data: { username, password, role: 'MANAGER' },
      select: { id: true, username: true, createdAt: true },
    });
    return NextResponse.json({ manager: newManager });
  } catch (err) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
  }
}
export async function DELETE(req) { 
  const owner = await getOwnerSession(req); 
  if (!owner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 
  const { searchParams } = new URL(req.url); 
  const id = parseInt(searchParams.get('id')); 
  if (!id) return NextResponse.json({ error: 'Manager ID required' }, { status: 400 }); 
  await prisma.admin.delete({ where: { id } }); 
  return NextResponse.json({ success: true }); 
}