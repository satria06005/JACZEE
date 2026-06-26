"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

import { ShoppingBag } from "lucide-react";

export default function CartButton() {
  const { items, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button onClick={openCart} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
      <span className="hidden md:inline">KERANJANG ({mounted ? itemCount : 0})</span>
      <div className="md:hidden relative">
        <ShoppingBag className="w-5 h-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {itemCount}
          </span>
        )}
      </div>
    </button>
  );
}
