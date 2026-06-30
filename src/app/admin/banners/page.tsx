import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import DeleteBannerButton from "./DeleteBannerButton";
import ToggleBannerStatus from "./ToggleBannerStatus";

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Banner</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola banner yang tampil di halaman utama.</p>
        </div>
        <Link 
          href="/admin/banners/new" 
          className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Tambah Banner
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {banners.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
            <p>Belum ada banner.</p>
            <Link href="/admin/banners/new" className="text-black underline mt-2 hover:text-gray-700">
              Tambah banner pertama Anda
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Preview</th>
                  <th className="px-6 py-4 font-medium">Lokasi / Judul</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {banners.map((banner: any) => (
                  <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-32 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <Image 
                          src={banner.imageUrl} 
                          alt={banner.title || banner.location} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 capitalize">{banner.location.replace('_', ' ')}</div>
                      <div className="text-gray-500">{banner.title || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <ToggleBannerStatus id={banner.id} initialStatus={banner.isActive} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link 
                        href={`/admin/banners/${banner.id}/edit`}
                        className="text-gray-500 hover:text-black transition-colors inline-block"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteBannerButton id={banner.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
