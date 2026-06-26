"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function processCheckout(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const itemsJson = formData.get("items") as string;
  const totalAmountStr = formData.get("totalAmount") as string;

  if (!name || !email || !address || !itemsJson) {
    throw new Error("Mohon lengkapi semua data pengiriman.");
  }

  const items = JSON.parse(itemsJson);
  const totalAmount = parseFloat(totalAmountStr);

  // Buat akun tamu (guest) secara otomatis jika email belum terdaftar
  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: {
      name,
      email,
      password: "GUEST_CHECKOUT_NO_LOGIN",
      role: "CUSTOMER",
    },
  });

  // Buat Pesanan
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount,
      status: "PENDING",
      orderItems: {
        create: items.map((item: any) => ({
          // We must use the original productId we injected, fallback to split for legacy cart items
          productId: item.productId || item.id.split('-')[0], 
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
      },
    },
  });

  // Return orderId for client to handle redirect and cart clearing
  return { success: true, orderId: order.id };
}
