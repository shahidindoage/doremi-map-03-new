import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items, customerName, customerEmail, customerPhone } = await req.json();

    const totalAmount = items.reduce((sum, seat) => sum + Number(seat.price), 0);
    const tableNos = items.map((s) => s.tableNumber).join(",");
    const seatNos = items.map((s) => s.seatNo).join(",");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "aed",
      metadata: { tableNo: tableNos, seatNo: seatNos, customerName, customerEmail, customerPhone },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
