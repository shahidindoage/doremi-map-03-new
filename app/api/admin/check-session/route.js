import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  const adminId = req.cookies.get('admin_session')?.value

  if (!adminId) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const id = parseInt(adminId)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const admin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!admin) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  return NextResponse.json({
    message: 'Logged in',
    admin: {
      username: admin.username,
      role: admin.role, // include role
    },
  })
}
