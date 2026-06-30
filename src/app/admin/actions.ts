"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const subCategoryId = formData.get("subCategoryId") as string;
  const imageFile = formData.get("imageFile") as File | null;

  if (!name || !price || !categoryId) {
    throw new Error("Nama, Harga, dan Kategori wajib diisi.");
  }

  const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

  let finalImageUrl = `https://picsum.photos/seed/${id}/600/800`;
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), "public/uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch(e) {}
    
    const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);
    finalImageUrl = `/uploads/${fileName}`;
  }

  const data: any = {
    id,
    name,
    description,
    price: parseFloat(price),
    discountPercent: parseInt(formData.get("discountPercent") as string || "0"),
    stock: parseInt(stock || "0"),
    imageUrl: finalImageUrl,
    categoryId,
    subCategoryId: subCategoryId || null,
  };

  try {
    await prisma.product.create({ data });
  } catch (err: any) {
    if (err.message && err.message.includes("discountPercent")) {
      delete data.discountPercent;
      await prisma.product.create({ data });
    } else {
      throw err;
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const subCategoryId = formData.get("subCategoryId") as string;
  const imageFile = formData.get("imageFile") as File | null;

  if (!id || !name || !price || !categoryId) {
    throw new Error("Data tidak lengkap.");
  }

  let finalImageUrl = formData.get("imageUrl") as string; // existing image URL
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), "public/uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch(e) {}
    
    const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);
    finalImageUrl = `/uploads/${fileName}`;
  }

  const data: any = {
    name,
    description,
    price: parseFloat(price),
    discountPercent: parseInt(formData.get("discountPercent") as string || "0"),
    stock: parseInt(stock || "0"),
    imageUrl: finalImageUrl || `https://picsum.photos/seed/${id}/600/800`,
    categoryId,
    subCategoryId: subCategoryId || null,
  };

  try {
    await prisma.product.update({
      where: { id },
      data,
    });
  } catch (err: any) {
    // Jika user belum menjalankan `npx prisma db push`, prisma client belum tahu tentang discountPercent
    if (err.message && err.message.includes("discountPercent")) {
      delete data.discountPercent;
      await prisma.product.update({
        where: { id },
        data,
      });
    } else {
      throw err;
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/shop/${categoryId}/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
