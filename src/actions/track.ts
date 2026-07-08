"use server";

import { prisma } from "@/lib/prisma";

export async function trackOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const email = formData.get("email") as string;

  if (!orderId || !email) {
    return { success: false, error: "Mohon masukkan Nomor Pesanan dan Email." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan. Periksa kembali Nomor Pesanan Anda." };
    }

    if (order.user.email.toLowerCase() !== email.toLowerCase()) {
      return { success: false, error: "Email tidak cocok dengan pesanan ini." };
    }

    // Convert date to a serializable format for client component if necessary,
    // though passing from Server Action to Client Component usually handles dates now.
    // Better safe to stringify complex objects if Next.js version complains.
    // Extract phone if we appended it to the name during checkout
    let phone = "";
    if (order.user.name.includes("| PHONE:")) {
      phone = order.user.name.split("| PHONE:")[1].trim();
    }

    return { 
      success: true, 
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toISOString(),
        email: order.user.email,
        phone: phone,
        items: order.orderItems.map((item: any) => ({
          name: item.product.name,
          imageUrl: item.product.imageUrl,
          quantity: item.quantity,
          price: item.priceAtPurchase,
          originalPrice: item.product.price,
          discountPercent: item.product.discountPercent
        }))
      }
    };
  } catch (error) {
    console.error("Track Order Error:", error);
    return { success: false, error: "Terjadi kesalahan sistem saat melacak pesanan." };
  }
}
