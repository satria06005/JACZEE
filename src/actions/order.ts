"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteOrder(orderId: string) {
  try {
    // Delete the order (cascade will delete items)
    await prisma.order.delete({
      where: { id: orderId }
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Gagal menghapus pesanan" };
  }
}
