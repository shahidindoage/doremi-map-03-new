import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items, customerName, customerEmail, customerPhone, coupon } =
      await req.json();

    const totalAmount = items.reduce((sum, seat) => sum + Number(seat.price), 0);

    let discountAmount = 0;
    let couponApplied = false;
    let couponType= null
    let discountpercentage=0

    if (coupon) {
      const dbCoupon = await prisma.coupon.findUnique({
        where: { code: coupon.trim().toUpperCase() },
      });
     couponType=dbCoupon.type
discountpercentage=dbCoupon.discount
      if (dbCoupon) {
        const now = new Date();
        const expiry = new Date(dbCoupon.expiry);

        console.log("Now:", now.toISOString());
        console.log("Expiry:", expiry.toISOString());

        // check expiry
        if (now.getTime() <= expiry.getTime()) {
          // check usage limit
          if (!dbCoupon.maxUsage || dbCoupon.usageCount < dbCoupon.maxUsage) {
            couponApplied = true;

            // calculate discount based on type
            if (dbCoupon.type === "FIXED") {
              discountAmount = dbCoupon.discount;
            } else if (dbCoupon.type === "PERCENT") {
              discountAmount = (totalAmount * dbCoupon.discount) / 100;
            }

            // increment usage count
            await prisma.coupon.update({
              where: { id: dbCoupon.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
      }
    }

    const finalAmount = Math.max(totalAmount - discountAmount, 0);

    const tableNos = items.map((s) => s.tableNumber).join(",");
    const seatNos = items.map((s) => s.seatNo).join(",");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100),
      currency: "aed",
      receipt_email: customerEmail,
      automatic_payment_methods: { enabled: true },
      metadata: {
        tableNo: tableNos,
        seatNo: seatNos,
        customerName,
        customerEmail,
        customerPhone,
        coupon: couponApplied ? coupon.trim().toUpperCase() : "",
        discount: discountAmount,
        originalAmount: totalAmount,
        finalAmount,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      couponApplied,
      discount: discountAmount,
      finalAmount,
      couponType,
      discountpercentage
    });
  } catch (err) {
    console.error("❌ Payment Intent Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
