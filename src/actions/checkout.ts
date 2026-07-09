"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16" as any,
// });

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

  const parsedItems = JSON.parse(itemsJson);
  let totalAmountFromFrontend = parseFloat(totalAmountStr);

  // SECURITY: Ambil harga asli dari database, JANGAN percaya harga dari frontend!
  // Ini mencegah "Price Manipulation Attack" di mana hacker mengubah harga di browser.
  const items = await Promise.all(
    parsedItems.map(async (item: any) => {
      const realProductId = item.productId || item.id.split('-')[0];
      const product = await prisma.product.findUnique({ where: { id: realProductId } });
      
      if (!product) throw new Error(`Produk tidak ditemukan: ${item.name}`);
      
      return {
        ...item,
        productId: realProductId,
        // Ganti harga dari frontend dengan harga valid dari database
        price: product.price,
        name: product.name,
      };
    })
  );

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
  
  // Hitung ulang subtotal berdasarkan harga asli database
  const realSubtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  
  // Hitung ongkir berdasarkan selisih total frontend dan subtotal frontend (untuk sementara)
  const frontendSubtotal = parsedItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shippingFee = Math.max(0, totalAmountFromFrontend - frontendSubtotal);
  
  // Total bayar = Harga Asli Database + Ongkos Kirim Asli
  const totalAmount = realSubtotal + shippingFee;

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
          productId: item.productId, 
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
      },
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Konfigurasi Midtrans Snap
  // @ts-ignore - midtrans-client might not have perfect TS types
  const midtransClient = require('midtrans-client');
  const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });

  const transactionDetails = {
    order_id: order.id,
    gross_amount: Math.round(totalAmount),
  };

  const customerDetails = {
    first_name: name,
    email: email,
    phone: phone,
    billing_address: {
      first_name: name,
      email: email,
      phone: phone,
      address: address,
      city: cityName,
      country_code: "IDN"
    },
    shipping_address: {
      first_name: name,
      email: email,
      phone: phone,
      address: address,
      city: cityName,
      country_code: "IDN"
    }
  };

  const itemDetails = items.map((item: any) => ({
    id: item.productId,
    price: Math.round(item.price),
    quantity: item.quantity,
    name: item.name || "Koleksi JACZEE",
  }));

  if (shippingFee > 0) {
    itemDetails.push({
      id: "SHIPPING",
      price: Math.round(shippingFee),
      quantity: 1,
      name: "Ongkos Kirim",
    });
  }

  const transactionParams = {
    transaction_details: transactionDetails,
    customer_details: customerDetails,
    item_details: itemDetails,
    callbacks: {
      finish: `${baseUrl}/checkout/success?orderId=${order.id}`,
      error: `${baseUrl}/checkout`,
      pending: `${baseUrl}/checkout`,
    }
  };

  try {
    const transaction = await snap.createTransaction(transactionParams);
    // Kembalikan URL Midtrans Snap
    return { success: true, url: transaction.redirect_url };
  } catch (error) {
    console.error("Midtrans Error:", error);
    throw new Error("Gagal memproses pembayaran dengan Midtrans.");
  }
}
