"use client";

import { createProduct } from "../../actions";
import { Save } from "lucide-react";
import { useState } from "react";

type CategoryWithSub = {
  id: string;
  name: string;
  subCategories: { id: string; name: string }[];
};

export default function ProductForm({ categories }: { categories: CategoryWithSub[] }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isPending, setIsPending] = useState(false);

  const activeCategory = categories.find(c => c.id === selectedCategory);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createProduct(formData);
    } catch (err) {
      console.error(err);
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
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-semibold text-gray-700">Harga (USD) *</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            required 
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
          >
            <option value="" className="text-black">Pilih Kategori...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="text-black">{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="subCategoryId" className="text-sm font-semibold text-gray-700">Sub-Kategori</label>
          <select 
            id="subCategoryId" 
            name="subCategoryId" 
            disabled={!selectedCategory || !activeCategory?.subCategories.length}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Pilih Sub-Kategori...</option>
            {activeCategory?.subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700">URL Gambar (Opsional)</label>
        <input 
          type="url" 
          id="imageUrl" 
          name="imageUrl" 
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
        <p className="text-xs text-gray-500">Biarkan kosong untuk menghasilkan gambar *dummy* otomatis.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold text-gray-700">Deskripsi (Opsional)</label>
        <textarea 
          id="description" 
          name="description" 
          rows={4}
          placeholder="Tuliskan deskripsi lengkap produk ini..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isPending ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </div>

    </form>
  );
}
