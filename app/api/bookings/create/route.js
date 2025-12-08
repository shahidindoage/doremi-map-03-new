import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { tableNumber, seatNo, name, email, phone, paymentIntentId } = await req.json();

    if (!tableNumber || !seatNo || !name || !email || !phone || !paymentIntentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const table = await prisma.table.findFirst({ where: { number: Number(tableNumber) } });
    if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 });

    const updatedSeat = await prisma.seat.updateMany({
      where: { tableId: table.id, seatNo: Number(seatNo), status: "AVAILABLE" },
      data: { status: "BOOKED", bookedAt: new Date() },
    });

    if (updatedSeat.count === 0)
      return NextResponse.json({ error: `Seat ${tableNumber}-${seatNo} not available` }, { status: 409 });

    const booking = await prisma.booking.create({
      data: { tableNumber, seatNo, name, email, phone, paymentIntentId, bookedAt: new Date() },
    });

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("Booking creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
