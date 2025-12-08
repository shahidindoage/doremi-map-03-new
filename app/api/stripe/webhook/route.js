import Stripe from "stripe";
import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const charge = pi.charges?.data?.[0];
    const tableNos = (pi.metadata.tableNo || "").split(",");
    const seatNos = (pi.metadata.seatNo || "").split(",");

    const name = charge?.billing_details?.name || pi.metadata.customerName;
    const email = charge?.billing_details?.email || pi.metadata.customerEmail;
    const phone = pi.metadata.customerPhone;

    for (let i = 0; i < tableNos.length; i++) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tableNumber: Number(tableNos[i]),
            seatNo: Number(seatNos[i]),
            name,
            email,
            phone,
            paymentIntentId: pi.id,
          }),
        });
      } catch (err) {
        console.error(`Error booking seat ${tableNos[i]}-${seatNos[i]}:`, err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
