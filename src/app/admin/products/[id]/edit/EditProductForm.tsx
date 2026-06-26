"use client";

import { updateProduct } from "../../../actions";
import { Save } from "lucide-react";
import { useState } from "react";

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
  const [isPending, setIsPending] = useState(false);

  const activeCategory = categories.find(c => c.id === selectedCategory);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateProduct(formData);
    } catch (err) {
      console.error(err);
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
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-semibold text-gray-700">Harga (USD) *</label>
          <input 
            type="number" 
            id="price" 
            name="price" 
            defaultValue={product.price}
            required 
            min="0"
            step="0.01"
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
            defaultValue={product.subCategoryId || ""}
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
        <label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700">URL Gambar</label>
        <input 
          type="url" 
          id="imageUrl" 
          name="imageUrl" 
          defaultValue={product.imageUrl}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-sm text-black"
        />
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
          className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
