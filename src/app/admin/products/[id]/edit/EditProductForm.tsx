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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  
  const initialCustomColors = (product.colors || [])
    .filter((c: string) => c.includes('|'))
    .map((c: string) => {
      const [name, hex] = c.split('|');
      return { name, hex };
    });
    
  const [customColors, setCustomColors] = useState<{name: string, hex: string}[]>(initialCustomColors);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  
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
      router.refresh();
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

      {/* Tambah Warna Custom (Opsional) */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Tambah Warna Custom (Untuk Pilihan Dropdown di Bawah)</label>
        <div className="p-4 border border-gray-200 rounded-lg flex items-end gap-4 bg-gray-50">
          <div className="space-y-1 flex-1">
            <label className="text-xs font-semibold text-gray-700">Nama Warna Custom</label>
            <input 
              type="text" 
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Misal: Pink Terang"
              className="w-full px-3 py-2 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-sm text-black"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Hex</label>
            <input 
              type="color" 
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-10 h-9 p-0 bg-white rounded-md border border-gray-300 cursor-pointer"
            />
          </div>
          <button 
            type="button"
            onClick={() => {
              if (newColorName.trim()) {
                setCustomColors([...customColors, { name: newColorName.trim(), hex: newColorHex }]);
                setNewColorName("");
              }
            }}
            className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors h-9"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="space-y-4 border border-gray-200 p-6 rounded-xl">
        <label htmlFor="imageFile" className="text-sm font-semibold text-gray-700">Gambar Utama Produk (Opsional)</label>
        
        {product.imageUrl && (
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="relative group cursor-pointer" onClick={() => setPreviewImage(product.imageUrl)}>
              <img src={product.imageUrl} alt="Current" className="w-20 h-24 object-cover rounded bg-gray-100 transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                <span className="text-white text-xs drop-shadow-md font-medium">Lihat</span>
              </div>
            </div>
            <div className="flex flex-col w-full max-w-xs">
              <span className="text-sm font-semibold">Gambar Saat Ini</span>
              <span className="text-xs text-gray-500 break-all mb-2">{product.imageUrl}</span>
              <select name="colors" defaultValue={product.colors?.[0] || ""} className="w-full text-xs p-2 border rounded bg-white border-gray-300">
                <option value="">-- Pilih Warna --</option>
                {AVAILABLE_COLORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                {customColors.map((c, i) => <option key={`custom-${i}`} value={`${c.name}|${c.hex}`}>{c.name}</option>)}
              </select>
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
            <div className="flex gap-4 overflow-x-auto pb-2 pt-2 pr-2">
              {existingGallery.map((url: string, idx: number) => (
                <div key={idx} className="relative shrink-0 flex flex-col items-center gap-2">
                  <div className="relative group shrink-0">
                    <div className="cursor-pointer" onClick={() => setPreviewImage(url)}>
                      <img src={url} alt={`Gallery ${idx+1}`} className="w-20 h-24 object-cover rounded border bg-gray-100 transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
                        <span className="text-white text-[10px] drop-shadow-md font-medium">Lihat</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExistingGallery(existingGallery.filter(u => u !== url));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-600"
                    >
                      ✕
                    </button>
                    <input type="hidden" name="existingGalleryUrls" value={url} />
                  </div>
                  <select name="colors" defaultValue={product.colors?.[idx + 1] || ""} className="w-24 text-[10px] p-1 border rounded bg-white border-gray-300">
                    <option value="">- Warna -</option>
                    {AVAILABLE_COLORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    {customColors.map((c, i) => <option key={`custom-${i}`} value={`${c.name}|${c.hex}`}>{c.name}</option>)}
                  </select>
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
          onChange={(e) => {
            if (e.target.files) {
              const files = Array.from(e.target.files);
              const previews = files.map(file => URL.createObjectURL(file));
              setNewGalleryPreviews(previews);
            }
          }}
          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
        />
        {newGalleryPreviews.length > 0 && (
          <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg bg-blue-50">
            <span className="text-sm font-semibold text-blue-900">Preview Gambar Baru ({newGalleryPreviews.length} Gambar)</span>
            <div className="flex gap-4 overflow-x-auto pb-2 pt-2 pr-2">
              {newGalleryPreviews.map((url, idx) => (
                <div key={idx} className="relative shrink-0 flex flex-col items-center gap-2">
                  <div className="relative shrink-0 group cursor-pointer" onClick={() => setPreviewImage(url)}>
                    <img src={url} alt={`New Gallery ${idx+1}`} className="w-20 h-24 object-cover rounded border bg-white transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
                      <span className="text-white text-[10px] drop-shadow-md font-medium">Lihat</span>
                    </div>
                  </div>
                  <select name="colors" defaultValue="" className="w-24 text-[10px] p-1 border rounded bg-white border-gray-300">
                    <option value="">- Warna -</option>
                    {AVAILABLE_COLORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    {customColors.map((c, i) => <option key={`custom-${i}`} value={`${c.name}|${c.hex}`}>{c.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500">Pilih beberapa gambar sekaligus. Rekomendasi: 600x800 pixel (Rasio 3:4). Maksimal total ukuran file 10MB. Jika Anda mengunggah galeri baru, warnanya dapat dipilih pada preview di atas.</p>
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

      {previewImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
            <button 
              className="absolute -top-4 -right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-200 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
