"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchProduct() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        router.push(`/admin/products?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push(`/admin/products`);
      }
    }, 300); // 300ms delay to prevent excessive queries while typing

    return () => clearTimeout(timeoutId);
  }, [query, router]);

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Cari produk..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black placeholder:text-gray-400"
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
    </div>
  );
}
