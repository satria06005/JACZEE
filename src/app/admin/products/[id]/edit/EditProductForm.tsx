"use client";

import { updateProduct } from "../../../actions";
import { Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/useToastStore";
import { AVAILABLE_COLORS } from "@/lib/constants";

type CategoryWithSub = {
  id: string;
  name: string;
  subCategories: { id: string; name: string }[];
};

export default function EditProductForm({ 
  product, 
  categories 
}: { 
  product: any, 
  categories: CategoryWithSub[] 
}) {
  const [selectedCategory, setSelectedCategory] = useState(product.categoryId || "");
  const [existingGallery, setExistingGallery] = useState<string[]>(product.galleryUrls || []);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { addToast } = useToastStore();

  const activeCategory = categories.find(c => c.id === selectedCategory);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateProduct(product.id, formData);
      addToast("Produk berhasil diperbarui!", "success");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      addToast("Gagal memperbarui produk.", "error");
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <input type="hidden" name="id" value={product.id} />
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Produk *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          defaultValue={product.name}
          required 
          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all resize-none text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label htmlFor="priceDisplay" className="text-sm font-semibold text-gray-700">Harga (Rp) *</label>
          <input 
            type="text" 
            id="priceDisplay" 
            defaultValue={product.price ? new Intl.NumberFormat('id-ID').format(product.price) : ""}
            required 
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              const formatted = rawValue ? new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10)) : "";
              e.target.value = formatted;
              const hiddenInput = document.getElementById("price") as HTMLInputElement;
              if (hiddenInput) hiddenInput.value = rawValue;
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
          <input type="hidden" id="price" name="price" defaultValue={product.price} />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="discountPercent" className="text-sm font-semibold text-gray-700">Diskon (%)</label>
          <input 
            type="number" 
            id="discountPercent" 
            name="discountPercent" 
            defaultValue={product.discountPercent || 0}
            min="0"
            max="100"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-semibold text-gray-700">Stok</label>
          <input 
            type="number" 
            id="stock" 
            name="stock" 
            defaultValue={product.stock}
            min="0"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-semibold text-gray-700">Kategori Utama *</label>
          <select 
            id="categoryId" 
            name="categoryId" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-black cursor-pointer appearance-none"
          >
            <option value="" className="text-black">Pilih Kategori...</option>
            {categories.map((cat) => {
              const nameMap: Record<string, string> = { Mens: "Pria", Womens: "Wanita", Kids: "Anak" };
              return (
                <option key={cat.id} value={cat.id} className="text-black">
                  {nameMap[cat.name] || cat.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="subCategoryId" className="text-sm font-semibold text-gray-700">Sub-Kategori</label>
          <select 
            id="subCategoryId" 
            name="subCategoryId" 
            defaultValue={product.subCategoryId || ""}
            disabled={!selectedCategory || !activeCategory?.subCategories.length}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-black cursor-pointer appearance-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <option value="">Pilih Sub-Kategori...</option>
            {activeCategory?.subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Pilihan Warna (Opsional)</label>
        <div className="flex flex-wrap gap-4 pt-2">
          {AVAILABLE_COLORS.map((color) => {
            const isChecked = product.colors?.includes(color.id);
            return (
              <label key={color.id} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    name="colors" 
                    value={color.id}
                    defaultChecked={isChecked}
                    className="peer sr-only"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-black transition-all"
                    style={{ backgroundColor: color.hex }}
                  />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-black">{color.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 border border-gray-200 p-6 rounded-xl">
        <label htmlFor="imageFile" className="text-sm font-semibold text-gray-700">Gambar Utama Produk (Opsional)</label>
        
        {product.imageUrl && (
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <img src={product.imageUrl} alt="Current" className="w-20 h-24 object-cover rounded bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Gambar Saat Ini</span>
              <span className="text-xs text-gray-500 break-all">{product.imageUrl}</span>
            </div>
          </div>
        )}

        <input type="hidden" name="imageUrl" value={product.imageUrl} />

        <input 
          type="file" 
          id="imageFile" 
          name="imageFile" 
          accept="image/*"
          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
        />
        <p className="text-xs text-gray-500">Rekomendasi ukuran: 600x800 pixel (Rasio 3:4). Pilih file baru jika Anda ingin mengganti gambar utama di atas.</p>
      </div>

      <div className="space-y-4 border border-gray-200 p-6 rounded-xl">
        <label htmlFor="galleryFiles" className="text-sm font-semibold text-gray-700">Galeri Produk (Banyak Gambar)</label>

        {existingGallery && existingGallery.length > 0 && (
          <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg">
            <span className="text-sm font-semibold">Galeri Saat Ini ({existingGallery.length} Gambar)</span>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {existingGallery.map((url: string, idx: number) => (
                <div key={idx} className="relative shrink-0 group">
                  <img src={url} alt={`Gallery ${idx+1}`} className="w-16 h-20 object-cover rounded border bg-gray-100" />
                  <button
                    type="button"
                    onClick={() => setExistingGallery(existingGallery.filter(u => u !== url))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    ✕
                  </button>
                  <input type="hidden" name="existingGalleryUrls" value={url} />
                </div>
              ))}
            </div>
          </div>
        )}

        <input 
          type="file" 
          id="galleryFiles" 
          name="galleryFiles" 
          accept="image/*"
          multiple
          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
        />
        <p className="text-xs text-gray-500">Pilih beberapa gambar sekaligus. Rekomendasi: 600x800 pixel (Rasio 3:4). **Peringatan:** Mengunggah galeri baru akan menghapus dan mengganti galeri saat ini.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold text-gray-700">Deskripsi</label>
        <textarea 
          id="description" 
          name="description" 
          defaultValue={product.description}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none text-black"
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
