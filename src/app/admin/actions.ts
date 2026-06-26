"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const subCategoryId = formData.get("subCategoryId") as string;

  if (!name || !price || !categoryId) {
    throw new Error("Nama, Harga, dan Kategori wajib diisi.");
  }

  const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

  await prisma.product.create({
    data: {
      id,
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock || "0"),
      imageUrl: imageUrl || `https://picsum.photos/seed/${id}/600/800`,
      categoryId,
      subCategoryId: subCategoryId || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const subCategoryId = formData.get("subCategoryId") as string;

  if (!id || !name || !price || !categoryId) {
    throw new Error("Data tidak lengkap.");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock || "0"),
      imageUrl: imageUrl || `https://picsum.photos/seed/${id}/600/800`,
      categoryId,
      subCategoryId: subCategoryId || null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath(`/shop/${categoryId}/${id}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}
