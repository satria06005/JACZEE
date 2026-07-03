"use client";

import { createProduct } from "../../actions";
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

export default function ProductForm({ categories }: { categories: CategoryWithSub[] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [customColors, setCustomColors] = useState<{name: string, hex: string}[]>([]);
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
      await createProduct(formData);
      addToast("Produk berhasil ditambahkan!", "success");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      addToast("Gagal menambahkan produk.", "error");
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Produk *</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          placeholder="Contoh: Essential Oversized Tee"
          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label htmlFor="priceDisplay" className="text-sm font-semibold text-gray-700">Harga (Rp) *</label>
          <input 
            type="text" 
            id="priceDisplay" 
            required 
            placeholder="0"
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              const formatted = rawValue ? new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10)) : "";
              e.target.value = formatted;
              const hiddenInput = document.getElementById("price") as HTMLInputElement;
              if (hiddenInput) hiddenInput.value = rawValue;
            }}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-black"
          />
          <input type="hidden" id="price" name="price" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="discountPercent" className="text-sm font-semibold text-gray-700">Diskon (%)</label>
          <input 
            type="number" 
            id="discountPercent" 
            name="discountPercent" 
            min="0"
            max="100"
            defaultValue="0"
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-black"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-semibold text-gray-700">Stok Awal</label>
          <input 
            type="number" 
            id="stock" 
            name="stock" 
            min="0"
            defaultValue="10"
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all text-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-semibold text-gray-700">Kategori Utama *</label>
          <select 
            id="categoryId" 
            name="categoryId" 
            required
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
          {AVAILABLE_COLORS.map((color) => (
            <label key={color.id} className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  name="colors" 
                  value={color.id}
                  className="peer sr-only"
                />
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-black transition-all"
                  style={{ backgroundColor: color.hex }}
                />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-black">{color.name}</span>
            </label>
          ))}
          {customColors.map((color, idx) => (
            <label key={`custom-${idx}`} className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  name="colors" 
                  value={`${color.name}|${color.hex}`}
                  defaultChecked
                  className="peer sr-only"
                />
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-black transition-all"
                  style={{ backgroundColor: color.hex }}
                />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-black">{color.name}</span>
            </label>
          ))}
        </div>
        
        <div className="mt-4 p-4 border border-gray-200 rounded-lg flex items-end gap-4 bg-gray-50">
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

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="imageFile" className="text-sm font-semibold text-gray-700">Gambar Utama Produk</label>
          <input 
            type="file" 
            id="imageFile" 
            name="imageFile" 
            accept="image/*"
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
          />
          <p className="text-xs text-gray-500">Rekomendasi ukuran: 600x800 pixel (Rasio 3:4). Abaikan jika ingin menggunakan gambar *dummy* otomatis.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="galleryFiles" className="text-sm font-semibold text-gray-700">Galeri Produk (Banyak Gambar)</label>
          <input 
            type="file" 
            id="galleryFiles" 
            name="galleryFiles" 
            accept="image/*"
            multiple
            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 border-dashed focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
          />
          <p className="text-xs text-gray-500">Pilih beberapa gambar sekaligus untuk ditampilkan sebagai galeri di halaman detail produk. Rekomendasi: 600x800 pixel (Rasio 3:4). Maksimal total ukuran file 8MB.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold text-gray-700">Deskripsi (Opsional)</label>
        <textarea 
          id="description" 
          name="description" 
          rows={4}
          placeholder="Tuliskan deskripsi lengkap produk ini..."
          className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all resize-none text-black"
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-black text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {isPending ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </div>

    </form>
  );
}
