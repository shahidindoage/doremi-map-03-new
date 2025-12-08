import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function PATCH(req, { params }) {
  // Check cookie for admin session
  const cookie = req.cookies.get('admin_session')
  if (!cookie) return unauthorized()

  const { id } = params
  const body = await req.json()
  const { status } = body

  // Validate status
  if (!['BOOKED', 'AVAILABLE', 'BLOCKED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Update seat in DB
  try {
    const seat = await prisma.seat.update({
      where: { id: parseInt(id) },
      data: {
        status,
        bookedAt: status === 'BOOKED' ? new Date() : null,
        bookedBy: null, // optional, can add admin ID if needed
      },
    })
    return NextResponse.json({ seat })
  } catch (err) {
    return NextResponse.json({ error: 'Seat not found' }, { status: 404 })
  }
}
