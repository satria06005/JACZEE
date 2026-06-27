import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Plus, Users, DollarSign, Activity, ShoppingBag } from "lucide-react";

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();

  return (
    <div className="space-y-10 text-gray-900">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dasbor Eksekutif</h1>
          <p className="text-gray-500 mt-1 text-sm">Pantau performa dan kelola toko JACZEE Anda hari ini.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-all shadow-md hover:shadow-lg w-fit"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk Baru
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Pendapatan", value: "Rp 0", icon: DollarSign, trend: "+0%" },
          { label: "Pesanan Aktif", value: "0", icon: ShoppingBag, trend: "0" },
          { label: "Pelanggan Baru", value: "0", icon: Users, trend: "0" },
          { label: "Total Produk", value: totalProducts.toString(), icon: Package, trend: "+1" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-gray-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">{stat.trend}</span>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Banner / Premium Access */}
      <div className="bg-black rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl mt-12">
        <div className="relative z-10 text-white max-w-xl">
          <h2 className="text-2xl font-semibold mb-3 tracking-wide text-white">JACZEE Premium Analytics</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Dapatkan wawasan mendalam mengenai perilaku pelanggan, tren penjualan, dan prediksi performa produk untuk bulan depan. Fitur analitik canggih eksklusif ini akan segera aktif di akun Anda.
          </p>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <Activity className="w-48 h-48 text-white/5 absolute -right-10 -bottom-10 pointer-events-none" />
      </div>
      
    </div>
  );
}
