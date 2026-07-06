import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: token },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
