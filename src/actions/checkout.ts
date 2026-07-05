"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
});

// Generate a structured, elegant order number (e.g., ORD-20260627-4829)
function generateOrderNumber() {
  const date = new Date();
  const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  const randomString = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateString}-${randomString}`;
}

export async function processCheckout(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string || "";
  const address = formData.get("address") as string;
  
  // Geographical Data
  const provinceName = formData.get("provinceName") as string;
  const cityName = formData.get("cityName") as string;
  const districtName = formData.get("districtName") as string;
  
  const itemsJson = formData.get("items") as string;
  const totalAmountStr = formData.get("totalAmount") as string;

  if (!name || !email || !address || !itemsJson || !provinceName || !cityName || !districtName) {
    throw new Error("Mohon lengkapi semua data pengiriman dan wilayah.");
  }

  // Workaround: Append phone to name so we can retrieve it later without DB migrations
  const nameWithPhone = phone ? `${name} | PHONE:${phone}` : name;
  
  // Format the full shipping address combining the specific address and BPS data
  const fullShippingAddress = `${address}, Kec. ${districtName}, ${cityName}, Provinsi ${provinceName}`;

  const items = JSON.parse(itemsJson);
  const totalAmount = parseFloat(totalAmountStr);

  // Buat akun tamu (guest) secara otomatis jika email belum terdaftar
  const user = await prisma.user.upsert({
    where: { email },
    update: { name: nameWithPhone },
    create: {
      name: nameWithPhone,
      email,
      password: "GUEST_CHECKOUT_NO_LOGIN",
      role: "CUSTOMER",
    },
  });

  const structuredOrderId = generateOrderNumber();

  // Buat Pesanan
  const order = await prisma.order.create({
    data: {
      id: structuredOrderId,
      userId: user.id,
      totalAmount,
      shippingAddress: fullShippingAddress,
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shippingFee = totalAmount - subtotal;

  const stripeLineItems = items.map((item: any) => ({
    price_data: {
      currency: "idr",
      product_data: {
        name: item.name || "Koleksi JACZEE",
      },
      // Stripe menganggap IDR memiliki 2 desimal (sen), jadi harus dikali 100
      unit_amount: Math.round(item.price * 100), 
    },
    quantity: item.quantity,
  }));

  if (shippingFee > 0) {
    stripeLineItems.push({
      price_data: {
        currency: "idr",
        product_data: {
          name: "Ongkos Kirim",
        },
        unit_amount: Math.round(shippingFee * 100),
      },
      quantity: 1,
    });
  }

  // Trik untuk Proyek Kuliah: Stripe menolak transaksi di bawah $0.50 (sekitar Rp 10.000)
  if (totalAmount < 10000) {
    const adminFee = 10000 - totalAmount;
    stripeLineItems.push({
      price_data: {
        currency: "idr",
        product_data: {
          name: "Biaya Layanan (Minimum Transaksi)",
        },
        unit_amount: Math.round(adminFee * 100),
      },
      quantity: 1,
    });
  }

  // Buat sesi Stripe
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
    cancel_url: `${baseUrl}/checkout`,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
    },
    line_items: stripeLineItems,
  });

  // Kembalikan URL Stripe Checkout ke frontend
  return { success: true, url: session.url };
}
