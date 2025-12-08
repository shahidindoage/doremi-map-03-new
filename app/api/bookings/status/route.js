import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pi = searchParams.get("pi");

  if (!pi) return new Response(JSON.stringify({ error: "Missing PaymentIntent ID" }), { status: 400 });

  const count = await prisma.booking.count({ where: { paymentIntentId: pi } });
  return new Response(JSON.stringify({ count }));
}
