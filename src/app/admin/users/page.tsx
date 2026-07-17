import { prisma } from "@/lib/prisma";
import UserTable from "./UserTable";

export default async function UsersAdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Pengguna</h1>
        <p className="text-gray-500 text-sm">
          Kelola pelanggan dan administrator yang terdaftar di JACZEE.
        </p>
      </div>

      <UserTable users={users} />
    </div>
  );
}
