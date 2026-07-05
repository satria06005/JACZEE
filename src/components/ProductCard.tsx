"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "./ProductGrid";

export const COLORS = [
  { id: 'hitam', name: 'Hitam', hex: '#1c1c1c' },
  { id: 'gading', name: 'Gading (Ivory)', hex: '#f4f3ed' },
  { id: 'coklat', name: 'Coklat Tanah', hex: '#8b7355' },
];

export default function ProductCard({ product, priority }: { product: Product, priority: boolean }) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  let currentImage = product.imageUrl;
  if (selectedColor) {
    const colorIndex = COLORS.findIndex(c => c.id === selectedColor);
    if (product.galleryUrls && product.galleryUrls[colorIndex]) {
      currentImage = product.galleryUrls[colorIndex];
    } else {
      currentImage = product.imageUrl.replace('/seed/', `/seed/c${colorIndex}-`);
    }
  }

  return (
    <div className="flex flex-col relative">
      <Link href={product.href} className="group flex flex-col text-center">
        <div className="relative w-full aspect-[3/4] bg-stone-100 mb-4 overflow-hidden">
          <Image 
            src={currentImage} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 50vw, 33vw"
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
          />
          {product.discountPercent && product.discountPercent > 0 && (
            <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white/95 backdrop-blur-sm text-black border border-gray-100 text-[9px] md:text-[10px] font-semibold px-3 py-1.5 tracking-[0.2em] uppercase shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-opacity">
              SALE -{product.discountPercent}%
            </div>
          )}
        </div>
      </Link>
      
      {/* Color Swatches */}
      <div className="flex justify-center gap-2 mb-3 mt-1" onMouseLeave={() => setSelectedColor(null)}>
        {COLORS.map((color) => (
          <button
            key={color.id}
            onMouseEnter={() => setSelectedColor(color.id)}
            onClick={() => setSelectedColor(color.id)}
            className={`w-4 h-4 rounded-full border border-gray-300 transition-transform hover:scale-110 ${selectedColor === color.id ? 'ring-1 ring-offset-2 ring-black' : ''}`}
            style={{ backgroundColor: color.hex }}
            aria-label={`Lihat warna ${color.name}`}
          />
        ))}
      </div>

      <Link href={product.href} className="text-center group flex flex-col gap-1">
        <h3 className="text-xs tracking-widest uppercase group-hover:underline text-gray-900 line-clamp-1">{product.name}</h3>
        {product.originalPrice ? (
          <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs tracking-widest mt-0.5">
            <span className="text-gray-400 line-through decoration-gray-300">{product.originalPrice}</span>
            <span className="text-black font-semibold">{product.price}</span>
          </div>
        ) : (
          <p className="text-[10px] md:text-xs tracking-widest text-gray-500 mt-0.5">{product.price}</p>
        )}
      </Link>
    </div>
  );
}
