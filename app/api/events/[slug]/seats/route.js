import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  const { slug } = params
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      tables: {
        include: { seats: true },
        orderBy: { number: 'asc' }
      }
    }
  })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const tables = event.tables.map(t => ({
    number: t.number,
    id: t.id,
    top: t.top,
    left: t.left,
    price: t.price,
    color: t.color,
    seats: t.seats.map(s => ({
      id: s.id,
      seatNo: s.seatNo,
      label: s.label,
      status: s.status,
    }))
  }))

  return NextResponse.json({ event: { id: event.id, title: event.title, slug }, tables })
}
