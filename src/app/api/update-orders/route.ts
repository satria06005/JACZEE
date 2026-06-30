import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  await prisma.order.updateMany({
    data: { status: "PAID" }
  });
  return NextResponse.json({ success: true });
}
