import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">Selamat Datang di Markas Komando</h1>
          <p className="text-gray-500 max-w-lg leading-relaxed">
            Ini adalah pusat kendali toko JACZEE Anda. Kelola produk, pantau ketersediaan stok, dan saksikan pertumbuhan bisnis Anda dari satu tempat.
          </p>
        </div>
        
        {/* Background Watermark Text */}
        <span className="text-[120px] font-black tracking-widest text-gray-50 absolute -right-10 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          JACZEE
        </span>
        
        {/* Foreground Logo Text */}
        <span className="text-3xl font-bold tracking-[0.3em] text-black relative z-10 hidden md:block">
          JACZEE
        </span>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Ringkasan</h2>
        <Link 
          href="/admin/products/new" 
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-gray-50 rounded-lg text-black">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Produk Aktif</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
      </div>
      
      {/* Placeholder for future charts/stats */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mt-8">
        <h2 className="text-lg font-semibold mb-2">Aktivitas Toko</h2>
        <p className="text-gray-500 text-sm">Grafik penjualan dan analitik akan tampil di sini pada tahap selanjutnya.</p>
      </div>
    </div>
  );
}
