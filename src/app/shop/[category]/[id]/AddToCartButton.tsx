"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

import SizeGuideModal from "@/components/SizeGuideModal";

const SIZES = ["S", "M", "L", "XL"];

export default function AddToCartButton({ 
  product, 
  selectedColor, 
  setSelectedColor,
  productColors
}: { 
  product: any, 
  selectedColor: string, 
  setSelectedColor: (c: string) => void,
  productColors: { id: string, name: string, hex: string }[]
}) {
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    
    const colorObj = productColors.find(c => c.id === selectedColor) as any;
    
    let colorImg = product.imageUrl;
    if (colorObj) {
      const origIndex = colorObj.originalIndex;
      if (origIndex > 0 && product.galleryUrls && product.galleryUrls[origIndex - 1]) {
        colorImg = product.galleryUrls[origIndex - 1];
      } else if (product.imageUrl.includes('/seed/')) {
        colorImg = product.imageUrl.replace('/seed/', `/seed/c${origIndex}-`);
      }
    }
    
    const isDiscounted = product.discountPercent && product.discountPercent > 0;
    const finalPrice = isDiscounted ? product.price * (1 - product.discountPercent / 100) : product.price;

    addItem({ 
      ...product, 
      price: finalPrice,
      productId: product.id, // Keep the original database ID for checkout
      quantity: 1, 
      size: selectedSize,
      name: `${product.name} - ${colorObj?.name}`,
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      imageUrl: colorImg
    });
  };

  const isReady = selectedSize && (productColors.length === 0 || selectedColor);

  return (
    <div className="flex flex-col gap-8">
      
      {/* Color Selector */}
      {productColors && productColors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs tracking-widest uppercase font-semibold">
              Warna {selectedColor && `: ${productColors.find(c => c.id === selectedColor)?.name}`}
            </span>
          </div>
          <div className="flex gap-4">
            {productColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.id
                    ? "border-black scale-110"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs tracking-widest uppercase font-semibold">Ukuran</span>
          <button 
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-[10px] tracking-widest text-gray-400 hover:text-black uppercase transition-colors underline underline-offset-4"
          >
            Panduan Ukuran
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 border text-xs tracking-widest transition-all ${
                selectedSize === size
                  ? "border-black bg-black text-white font-semibold"
                  : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add To Cart Button */}
      <button 
        onClick={handleAddToCart}
        disabled={!isReady}
        className={`w-full py-5 text-xs tracking-widest uppercase font-semibold transition-colors ${
          isReady
            ? "bg-black text-white hover:bg-stone-800 cursor-pointer" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isReady ? "Tambah Ke Keranjang" : "Pilih Ukuran"}
      </button>

      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </div>
  );
}
