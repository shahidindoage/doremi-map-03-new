// /api/checkout/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { items } = body; // now expects array of seats [{tableNumber, seatNo, price}]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No seats selected" },
        { status: 400 }
      );
    }

    // ✅ Create line_items for Stripe
    const line_items = items.map(seat => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: `Seat ${seat.tableNumber}-${seat.seatNo}`
        },
        unit_amount: Math.round(Number(seat.price) * 100)
      },
      quantity: 1
    }));

    // ✅ Save seats metadata as JSON string
    const metadata = {
      seats: JSON.stringify(items)
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata,
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
