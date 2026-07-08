import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

import SearchProduct from "./SearchProduct";
import FilterProduct from "./FilterProduct";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; categoryId?: string; subCategoryId?: string }> }) {
  const { q, categoryId, subCategoryId } = await searchParams;

  const qLower = q?.toLowerCase() || '';
  const matchedCategories: string[] = [];
  if (qLower && "pria".includes(qLower)) matchedCategories.push("Mens");
  if (qLower && "wanita".includes(qLower)) matchedCategories.push("Womens");
  if (qLower && ("anak-anak".includes(qLower) || "anak".includes(qLower))) matchedCategories.push("Kids");
  if (qLower && "aksesoris".includes(qLower)) matchedCategories.push("Accessories");

  const products = await prisma.product.findMany({
    where: {
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { subCategory: { name: { contains: q, mode: 'insensitive' } } },
          ...(matchedCategories.length > 0 ? [{ category: { name: { in: matchedCategories } } }] : [])
        ]
      } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(subCategoryId ? { subCategoryId } : {}),
    },
    include: { category: true, subCategory: true },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany();
  const subCategories = await prisma.subCategory.findMany();

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <FilterProduct categories={categories} subCategories={subCategories} />
          <SearchProduct />
          <Link 
            href="/admin/products/new" 
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        </div>
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
                    <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-4 group cursor-pointer">
                      <div className="relative w-12 h-16 bg-stone-100 rounded overflow-hidden flex-shrink-0 group-hover:opacity-80 transition-opacity">
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          fill 
                          sizes="48px"
                          className="object-cover" 
                        />
                      </div>
                      <span className="font-medium text-black group-hover:underline decoration-1 underline-offset-4 capitalize">{product.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="bg-gray-100 px-2.5 py-1.5 rounded-md text-xs font-medium text-black border border-gray-200 shadow-sm">
                        {{
                          "Mens": "Pria",
                          "Womens": "Wanita",
                          "Kids": "Anak-anak",
                          "Accessories": "Aksesoris"
                        }[product.category.name] || product.category.name}
                      </span>
                      {product.subCategory && (
                        <>
                          <span className="text-gray-300 font-bold mx-0.5 text-xs">›</span>
                          <span className="bg-stone-50 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase text-gray-500 border border-gray-100">
                            {product.subCategory.name}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium text-black">Rp {product.price.toLocaleString('id-ID')}</td>
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
