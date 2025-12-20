import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* GET – List coupons */
export async function GET() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(coupons);
}

/* POST – Create coupon */
export async function POST(req) {
  const { code, discount, type, expiry, maxUsage } = await req.json();

  const coupon = await prisma.coupon.create({
    data: {
      code: code.trim().toUpperCase(),
      discount: Number(discount),
      type,
      expiry: new Date(expiry),
      maxUsage: maxUsage ? Number(maxUsage) : null,
    },
  });

  return NextResponse.json(coupon);
}
