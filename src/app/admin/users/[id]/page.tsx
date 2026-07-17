import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Shield, User as UserIcon, Mail, Phone, MapPin, Calendar, ShoppingBag } from "lucide-react";

export default async function UserDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    notFound();
  }

  // Ekstrak nama asli dan nomor telepon dari format "Nama | PHONE:081xxx"
  let displayName = user.name;
  let phoneNumber = "-";
  
  if (user.name.includes(' | PHONE:')) {
    const parts = user.name.split(' | PHONE:');
    displayName = parts[0];
    phoneNumber = parts[1] || "-";
  }

  const userInitials = displayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  const latestOrder = user.orders.length > 0 ? user.orders[0] : null;
  const latestShippingAddress = latestOrder?.shippingAddress || "Belum ada alamat pengiriman yang tersimpan.";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header dengan tombol kembali */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <Link href="/admin/users" className="p-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Pengguna</h1>
          <p className="text-gray-500 text-sm">Informasi lengkap biodata dan riwayat pesanan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Biodata Lengkap */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-3xl font-light tracking-widest mb-4">
                {userInitials}
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest">{displayName}</h2>
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest ${
                  user.role === 'ADMIN' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {user.role === 'ADMIN' ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <p className="text-sm font-medium text-gray-800 break-all">{user.email}</p>
              </div>
              
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Nomor Telepon
                </p>
                <p className="text-sm font-medium text-gray-800">{phoneNumber}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Terdaftar Sejak
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-6">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Alamat Pengiriman (Dari Pesanan Terakhir)
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {latestShippingAddress}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-black text-white p-6 border border-black shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold">{user.orders.length}</p>
            </div>
            <ShoppingBag className="w-8 h-8 opacity-20" />
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Pesanan */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-widest">Riwayat Pesanan Pelanggan</h3>
            </div>
            
            <div className="p-0">
              {user.orders.length === 0 ? (
                <div className="p-16 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Pelanggan ini belum pernah membuat pesanan.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {user.orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold hover:text-gray-600 transition-colors border-b border-transparent hover:border-gray-400">
                            #{order.id.toUpperCase()}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                            order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            order.status === 'SHIPPED' ? 'bg-black text-white' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-bold text-sm">
                            Rp {order.totalAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-100 p-4 rounded-sm">
                        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Item yang Dipesan</p>
                        <div className="space-y-3">
                          {order.orderItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-500">{item.quantity}x</span>
                                <span className="font-medium uppercase">{item.product?.name || "Produk Tidak Ditemukan"}</span>
                              </div>
                              <span className="text-gray-500">Rp {item.priceAtPurchase.toLocaleString('id-ID')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
