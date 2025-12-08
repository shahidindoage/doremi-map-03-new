import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  const { slug } = params;

  try {
    const { tableNumber, seatNo } = await req.json();

    if (!slug || !tableNumber || !seatNo) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    // 1️⃣ Find the event
    const event = await prisma.event.findUnique({
      where: { slug },
    });
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Find table for this event
    const table = await prisma.table.findFirst({
      where: {
        eventId: event.id,
        number: parseInt(tableNumber),
      },
    });
    if (!table) {
      return NextResponse.json(
        { success: false, error: `Table ${tableNumber} not found` },
        { status: 404 }
      );
    }

    // 3️⃣ Update the specific seat
    const updated = await prisma.seat.updateMany({
      where: {
        tableId: table.id,
        seatNo: parseInt(seatNo),
        status: "AVAILABLE", // only book available ones
      },
      data: {
        status: "BOOKED",
        bookedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { success: false, error: "Seat already booked or not found" },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, message: "Seat booked successfully" });
  } catch (err) {
    console.error("update-seat error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
