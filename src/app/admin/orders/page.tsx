import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { 
      user: true,
      orderItems: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daftar Pesanan Masuk</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Pelanggan</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Total Harga</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada pesanan yang masuk.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      <a href={`/admin/orders/${order.id}`} className="hover:text-black hover:underline underline-offset-4 decoration-1 cursor-pointer">
                        {order.id}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-black">{order.user.name}</div>
                      <div className="text-xs text-gray-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-black">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-amber-100 text-amber-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs uppercase tracking-wider">
                        Detail
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
