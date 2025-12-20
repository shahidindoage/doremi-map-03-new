import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* UPDATE */
export async function PUT(req, { params }) {
  const { code, discount, type, expiry, maxUsage } = await req.json();

  const coupon = await prisma.coupon.update({
    where: { id: Number(params.id) },
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

/* DELETE */
export async function DELETE(req, { params }) {
  await prisma.coupon.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json({ success: true });
}
