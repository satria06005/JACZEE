"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/");
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
    await prisma.banner.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error updating banner:", error);
    return { success: false, error: "Failed to update banner" };
  }
}

export async function deleteBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    });
    revalidatePath("/");
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
    revalidatePath("/");
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error toggling banner status:", error);
    return { success: false, error: "Failed to toggle banner status" };
  }
}
