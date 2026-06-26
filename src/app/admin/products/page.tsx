import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Produk</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Kategori</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Harga</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Stok</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-16 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          fill 
                          sizes="48px"
                          className="object-cover" 
                        />
                      </div>
                      <span className="font-medium text-black">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.stock} Tersedia
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium text-xs uppercase tracking-wider flex items-center gap-1">
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
