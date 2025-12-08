import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }

  const admin = await prisma.admin.findUnique({ where: { username } })
  if (!admin || admin.password !== password) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  // Login successful, set session cookie
  const res = NextResponse.json({
    message: 'Login successful',
    role: admin.role, // include role in response
  })

  res.cookies.set('admin_session', admin.id.toString(), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
  })

  return res
}
