import Stripe from "stripe";
import { NextResponse } from "next/server";
import { transporter } from "@/lib/mailer";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const charge = pi.charges?.data?.[0];

    const tableNos = (pi.metadata.tableNo || "").split(",");
    const seatNos = (pi.metadata.seatNo || "").split(",");

    const ticketCount = seatNos.filter(Boolean).length;


    const name = charge?.billing_details?.name || pi.metadata.customerName;
    const email = charge?.billing_details?.email || pi.metadata.customerEmail;
    const phone = pi.metadata.customerPhone;

    /* -------------------- BOOKINGS -------------------- */
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
        console.error(
          `❌ Booking error ${tableNos[i]}-${seatNos[i]}`,
          err
        );
      }
    }

    /* -------------------- EMAIL -------------------- */
try {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "DOREMI: Payment Successful & Booking Confirmed",
    html: `
<div style="font-family: 'Poppins', sans-serif; background-color: #171717; padding: 40px;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #212121; border-radius: 12px; padding: 30px;">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 10px;">
      <img src="https://lottery-v4.vercel.app/_next/image?url=%2Flogo.PNG&w=256&q=75" alt="DOREMI" style="max-width: 140px;">
    </div>

    <!-- Heading -->
    <h2 style="color: #d6af67; text-align: center; margin-bottom: 8px;">
      🎉 Booking Confirmed
    </h2>

    <p style="text-align: center; color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 25px;">
      Your payment was successful. Below are your ticket details.
    </p>

    <!-- Summary Box -->
    <div style="background: rgba(33,33,33,0.6); border-radius: 10px; padding: 18px; margin-bottom: 20px;">
      <table width="100%" cellpadding="6" cellspacing="0">
        <tr>
          <td style="color:#d6af67; font-weight:600;">Name</td>
          <td style="color:rgba(255,255,255,0.85);">${name}</td>
        </tr>
        <tr>
          <td style="color:#d6af67; font-weight:600;">Tickets</td>
         <td style="color:rgba(255,255,255,0.85);">${ticketCount}</td>
        </tr>
        <tr>
          <td style="color:#d6af67; font-weight:600;">Event Date & Time</td>
          <td style="color:rgba(255,255,255,0.85);">31/12/2025</td>
        </tr>
        <tr>
          <td style="color:#d6af67; font-weight:600;">Payment ID</td>
          <td style="color:rgba(255,255,255,0.85); font-size:13px;">${pi.id}</td>
        </tr>
      </table>
    </div>

    <!-- Ticket Layout -->
      <div style="
  background-color: rgba(33, 33, 33, 0.6); 
  border-radius: 8px; 
  padding: 16px; 
  margin: 20px 0; 
">
  <p style="font-weight: bold; color: #d6af67; margin-bottom: 10px;">Seating Location:</p>

  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
    <tr>
      ${tableNos.map((t, i) => `
        <td style="padding: 5px; width: 33.33%; vertical-align: top;">
          <div style="
            background-color: #d6af67;
            border-radius: 6px;
            padding: 8px 12px;
            color: rgba(255,255,255,0.9);
            font-weight: bold;
            font-size: 14px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 10px;
          ">
            Table ${t} | Seat ${seatNos[i]}
          </div>
        </td>
        ${(i + 1) % 3 === 0 && i !== tableNos.length - 1 ? `</tr><tr>` : ``}
      `).join('')}
    </tr>
  </table>
</div>

    <!-- Important Note -->
    <div style="background: rgba(214,175,103,0.15); border-left: 4px solid #d6af67; padding: 14px; border-radius: 6px; margin-bottom: 20px;">
      <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;">
        ⚠️ Please present this ticket at reception.
      </p>
    </div>

    <!-- Footer -->
    <p style="font-size: 13px; color: rgba(255,255,255,0.5); text-align: center; margin-top: 30px;">
      © 2025 DOREMI. All rights reserved.
    </p>

  </div>
</div>
`,

  });

} catch (emailErr) {
  console.error("❌ Email sending failed:", emailErr);
}

  }

  return NextResponse.json({ received: true });
}
