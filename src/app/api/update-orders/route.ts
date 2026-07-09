export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await prisma.order.updateMany({
    data: { status: "PAID" }
  });
  return NextResponse.json({ success: true });
}
