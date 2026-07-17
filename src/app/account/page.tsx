import { prisma } from "@/lib/prisma";
import LoginForm from "./LoginForm";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  let orders: any[] = [];

  if (token) {
    user = await prisma.user.findUnique({
      where: { id: token },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (user) {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
    }
  }

  if (user) {
    const userInitials = user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    return (
      <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between border-b-2 border-black pb-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold tracking-[0.2em] uppercase mb-2">Akun Saya</h1>
              <p className="text-sm text-gray-500 tracking-widest uppercase hidden sm:block">Kelola Profil dan Pesanan Anda</p>
            </div>
            <LogoutButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Profil Pengguna */}
            <div className="lg:col-span-1">
              <h2 className="text-xs tracking-widest uppercase font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">Profil Pengguna</h2>
              <div className="border border-gray-200 p-6 bg-white flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-light tracking-widest mb-6">
                  {userInitials}
                </div>
                <p className="text-sm font-bold uppercase tracking-widest mb-1">{user.name}</p>
                <p className="text-xs text-gray-500 mb-6 truncate w-full">{user.email}</p>
                <div className="w-full border-t border-gray-200 pt-6">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">
                    Anggota Sejak
                  </p>
                  <p className="text-xs font-semibold mt-1">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Riwayat Pesanan */}
            <div className="lg:col-span-3">
              <h2 className="text-xs tracking-widest uppercase font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">Riwayat Pesanan</h2>
              {orders.length === 0 ? (
                <div className="border border-gray-200 p-16 text-center bg-gray-50">
                  <p className="text-sm text-gray-500 mb-6 tracking-widest uppercase">Belum ada riwayat pesanan.</p>
                  <a href="/shop" className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    Mulai Belanja
                  </a>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border border-gray-300 bg-white shadow-sm overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-300 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase mb-1 text-gray-500">Tgl Pesanan</p>
                            <p className="text-xs font-semibold">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase mb-1 text-gray-500">Total</p>
                            <p className="text-xs font-semibold">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase mb-1 text-gray-500">Status</p>
                            <span className={`inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                              order.status === 'PAID' ? 'bg-green-100 text-green-800 border border-green-200' :
                              order.status === 'SHIPPED' ? 'bg-black text-white' :
                              'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold tracking-widest uppercase mb-1 text-gray-500">Order ID</p>
                          <p className="text-xs font-semibold text-gray-800">#{order.id.slice(-10).toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6 space-y-6">
                        {order.orderItems.map((item: any, idx: number) => (
                          <div key={item.id} className={`flex items-center gap-6 ${idx !== order.orderItems.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                            <div className="w-20 h-24 bg-stone-100 relative border border-gray-200 flex-shrink-0">
                              {item.product?.imageUrl && (
                                <img src={item.product.imageUrl} alt={item.product.name} className="absolute inset-0 w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold uppercase tracking-widest mb-1">{item.product?.name || "Produk Tidak Ditemukan"}</p>
                              <p className="text-xs text-gray-500 tracking-wider mb-2">Qty: {item.quantity}</p>
                              <p className="text-sm font-semibold text-black">Rp {item.priceAtPurchase.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="hidden sm:block">
                              {item.product?.categoryId && (
                                <a href={`/shop/${item.product.categoryId}/${item.productId}`} className="text-[10px] font-bold tracking-widest uppercase border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                                  Beli Lagi
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // @ts-ignore
  const banner = await prisma.banner.findFirst({
    where: { location: "account_login", isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  const bannerImageUrl = banner?.imageUrl || "https://picsum.photos/seed/account-fashion/800/1000";
  const bannerTitle = banner?.title || "Anggota Eksklusif";

  return <LoginForm bannerImageUrl={bannerImageUrl} bannerTitle={bannerTitle} />;
}
