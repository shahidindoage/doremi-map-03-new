import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req, { params }) {
  const { slug } = params
  const body = await req.json()
  const { seats, customer } = body
  if (!seats || seats.length === 0) return NextResponse.json({ error: 'No seats' }, { status: 400 })

  const event = await prisma.event.findUnique({ where: { slug } })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  try {
    const result = await prisma.$transaction(async (tx) => {
      const booked = []
      for (const s of seats) {
        const table = await tx.table.findFirst({ where: { eventId: event.id, number: s.tableNumber } })
        if (!table) throw new Error(`Table ${s.tableNumber} not found`)

        const updated = await tx.seat.updateMany({
          where: {
            tableId: table.id,
            seatNo: s.seatNo,
            status: 'AVAILABLE'
          },
          data: {
            status: 'BOOKED',
            bookedAt: new Date(),
          }
        })
        if (updated.count === 0) throw new Error(`Seat T${s.tableNumber}-${s.seatNo} not available`)
        const seatRec = await tx.seat.findFirst({ where: { tableId: table.id, seatNo: s.seatNo } })
        booked.push({ id: seatRec.id, tableNumber: s.tableNumber, seatNo: s.seatNo })
      }
      return { booked }
    })
    return NextResponse.json({ success: true, booked: result.booked })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Booking failed' }, { status: 409 })
  }
}
