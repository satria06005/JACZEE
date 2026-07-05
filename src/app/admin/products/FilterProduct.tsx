"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  slug: string;
}

export default function FilterProduct({
  categories,
  subCategories,
}: {
  categories: Category[];
  subCategories: SubCategory[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentSubCategoryId = searchParams.get("subCategoryId") || "";

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (e.target.value) {
        params.set("categoryId", e.target.value);
      } else {
        params.delete("categoryId");
      }
      // Reset subcategory when category changes
      params.delete("subCategoryId");
      router.push(`/admin/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSubCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (e.target.value) {
        params.set("subCategoryId", e.target.value);
      } else {
        params.delete("subCategoryId");
      }
      router.push(`/admin/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Filter subcategories based on selected category
  const filteredSubCategories = currentCategoryId
    ? subCategories.filter((sub) => sub.categoryId === currentCategoryId)
    : [];

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <select
        value={currentCategoryId}
        onChange={handleCategoryChange}
        className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black appearance-none"
      >
        <option value="">Semua Kategori</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name === "Mens" ? "Pria" : cat.name === "Womens" ? "Wanita" : cat.name === "Kids" ? "Anak-anak" : cat.name === "Accessories" ? "Aksesoris" : cat.name}
          </option>
        ))}
      </select>

      <select
        value={currentSubCategoryId}
        onChange={handleSubCategoryChange}
        disabled={!currentCategoryId || filteredSubCategories.length === 0}
        className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black appearance-none disabled:bg-gray-50 disabled:text-gray-400"
      >
        <option value="">Semua Sub-Kategori</option>
        {filteredSubCategories.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>
    </div>
  );
}
