"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";

async function deleteFileIfLocal(url: string | null) {
  if (!url || !url.startsWith('/uploads/')) return;
  try {
    const filename = url.replace('/uploads/', '');
    const path = join(process.cwd(), "public/uploads", filename);
    await unlink(path);
  } catch (e) {
    console.error("Failed to delete old file", e);
  }
}

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

  const colors = formData.getAll("colors") as string[];

  const galleryFiles = formData.getAll("galleryFiles") as File[];
  const galleryUrls: string[] = [];
  
  if (galleryFiles && galleryFiles.length > 0) {
    const uploadDir = join(process.cwd(), "public/uploads");
    try { await mkdir(uploadDir, { recursive: true }); } catch(e) {}
    
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const path = join(uploadDir, fileName);
        await writeFile(path, buffer);
        galleryUrls.push(`/uploads/${fileName}`);
      }
    }
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
    colors,
    galleryUrls,
  };

  try {
    await prisma.product.create({ data: data as any });
  } catch (err: any) {
    if (err.message && err.message.includes("discountPercent")) {
      delete data.discountPercent;
      await prisma.product.create({ data: data as any });
    } else {
      throw err;
    }
  }

  revalidatePath("/admin/products", "layout");
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

  const existingProduct = (await prisma.product.findUnique({ where: { id } })) as any;

  let finalImageUrl = formData.get("imageUrl") as string; // existing image URL
  if (imageFile && imageFile.size > 0) {
    if (existingProduct) await deleteFileIfLocal(existingProduct.imageUrl);
    
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

  const colors = formData.getAll("colors") as string[];

  const galleryFiles = formData.getAll("galleryFiles") as File[];
  const existingGalleryUrlsFromForm = formData.getAll("existingGalleryUrls") as string[];
  
  // Find which old gallery images were removed by the user
  if (existingProduct && existingProduct.galleryUrls) {
    for (const oldUrl of existingProduct.galleryUrls) {
      if (!existingGalleryUrlsFromForm.includes(oldUrl)) {
        await deleteFileIfLocal(oldUrl);
      }
    }
  }

  let galleryUrls: string[] = [...existingGalleryUrlsFromForm];
  
  const hasNewGallery = galleryFiles.some(f => f.size > 0);
  if (hasNewGallery) {
    const uploadDir = join(process.cwd(), "public/uploads");
    try { await mkdir(uploadDir, { recursive: true }); } catch(e) {}
    
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const path = join(uploadDir, fileName);
        await writeFile(path, buffer);
        galleryUrls.push(`/uploads/${fileName}`);
      }
    }
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
    colors,
    galleryUrls,
  };

  try {
    await prisma.product.update({
      where: { id },
      data: data as any,
    });
  } catch (err: any) {
    // Jika user belum menjalankan `npx prisma db push`, prisma client belum tahu tentang discountPercent
    if (err.message && err.message.includes("discountPercent")) {
      delete data.discountPercent;
      await prisma.product.update({
        where: { id },
        data: data as any,
      });
    } else {
      throw err;
    }
  }

  revalidatePath("/admin/products", "layout");
  revalidatePath("/");
  revalidatePath(`/shop/${categoryId}/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const pendingOrdersCount = await prisma.orderItem.count({
    where: {
      productId: id,
      order: {
        status: {
          not: "SHIPPED", // Asumsikan "SHIPPED" berarti pesanan selesai, PENDING/PAID belum selesai
        },
      },
    },
  });

  if (pendingOrdersCount > 0) {
    return { error: `Produk ini masih terkait dengan ${pendingOrdersCount} pesanan yang belum diselesaikan (PENDING/PAID). Harap selesaikan pesanan terlebih dahulu sebelum menghapus produk.` };
  }

  const existingProduct = (await prisma.product.findUnique({ where: { id } })) as any;
  
  await prisma.product.delete({
    where: { id },
  });

  if (existingProduct) {
    await deleteFileIfLocal(existingProduct.imageUrl);
    if (existingProduct.galleryUrls) {
      for (const url of existingProduct.galleryUrls) {
        await deleteFileIfLocal(url);
      }
    }
  }

  revalidatePath("/admin/products", "layout");
  revalidatePath("/");
  return { success: true };
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

export async function updateUserRole(userId: string, newRole: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  // First, find and delete all orders belonging to the user to satisfy foreign key constraints
  const userOrders = await prisma.order.findMany({
    where: { userId },
    select: { id: true }
  });

  for (const order of userOrders) {
    // orderItems are cascade deleted because of onDelete: Cascade on order relation
    await prisma.order.delete({
      where: { id: order.id }
    });
  }

  // Now delete the user
  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath("/admin/users");
  return { success: true };
}
