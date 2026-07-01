"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
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

export async function createBanner(data: {
  location: string;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  isActive: boolean;
}) {
  try {
    await prisma.banner.create({
      data,
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { success: false, error: "Failed to create banner" };
  }
}

export async function updateBanner(
  id: string,
  data: {
    location: string;
    title?: string;
    imageUrl: string;
    linkUrl?: string;
    linkText?: string;
    isActive: boolean;
  }
) {
  try {
    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (existingBanner && existingBanner.imageUrl !== data.imageUrl) {
      await deleteFileIfLocal(existingBanner.imageUrl);
    }

    await prisma.banner.update({
      where: { id },
      data,
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error updating banner:", error);
    return { success: false, error: "Failed to update banner" };
  }
}

export async function deleteBanner(id: string) {
  try {
    const existingBanner = await prisma.banner.findUnique({ where: { id } });
    if (existingBanner) {
      await deleteFileIfLocal(existingBanner.imageUrl);
    }

    await prisma.banner.delete({
      where: { id },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { success: false, error: "Failed to delete banner" };
  }
}

export async function toggleBannerStatus(id: string, isActive: boolean) {
  try {
    await prisma.banner.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/", "layout");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error toggling banner status:", error);
    return { success: false, error: "Failed to toggle banner status" };
  }
}
