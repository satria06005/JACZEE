"use client";

import Image from "next/image";
import Accordion from "@/components/Accordion";
import AddToCartButton from "./AddToCartButton";
import { useState } from "react";

import { AVAILABLE_COLORS } from "@/lib/constants";

export default function ProductDetailClient({ product }: { product: any }) {
  // Use product colors if available, otherwise fallback to an empty array
  const productColors = product.colors && product.colors.length > 0
    ? AVAILABLE_COLORS.filter(c => product.colors.includes(c.id))
    : [];

  const [selectedColor, setSelectedColor] = useState<string>(productColors.length > 0 ? productColors[0].id : "");

  const isDiscounted = product.discountPercent && product.discountPercent > 0;
  const finalPrice = isDiscounted ? product.price * (1 - product.discountPercent / 100) : product.price;

  // Generate mock gallery images based on the selected color
  // In a real app, product would have an array of image URLs per color
  const colorIndex = productColors.findIndex(c => c.id === selectedColor);
  const colorIdxForImg = colorIndex >= 0 ? colorIndex : 0;
  const baseImg = product.imageUrl.replace('/seed/', `/seed/c${colorIdxForImg}-`);
  
  let galleryImages = [baseImg];
  if (product.galleryUrls && product.galleryUrls.length > 0) {
    galleryImages = [baseImg, ...product.galleryUrls];
  } else if (product.imageUrl.includes('/seed/')) {
    // Dummy product fallback
    galleryImages = [
      baseImg,
      baseImg.replace('/seed/', '/seed/alt1-'),
      baseImg.replace('/seed/', '/seed/alt2-'),
      baseImg.replace('/seed/', '/seed/alt3-'),
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 relative">
      
      {/* Left: Product Image Gallery */}
      <div className="md:col-span-7 flex flex-col gap-2">
        {galleryImages.map((img, idx) => (
          <div key={idx} className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
            <Image 
              src={img} 
              alt={`${product.name} - view ${idx + 1}`} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={idx === 0}
            />
            {idx === 0 && isDiscounted && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-black border border-gray-100 text-[10px] md:text-xs font-semibold px-4 py-2 tracking-[0.2em] uppercase shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                SALE -{product.discountPercent}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right: Sticky Product Details */}
      <div className="md:col-span-5 relative">
        <div className="sticky top-32 flex flex-col h-fit pb-12">
          
          <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
          {isDiscounted ? (
            <div className="flex items-center gap-4 mb-8 text-lg tracking-widest">
              <span className="text-gray-400 line-through decoration-gray-300">Rp {product.price.toLocaleString('id-ID')}</span>
              <span className="text-black font-semibold">Rp {finalPrice.toLocaleString('id-ID')}</span>
            </div>
          ) : (
            <div className="text-lg text-gray-600 mb-8 tracking-widest">Rp {product.price.toLocaleString('id-ID')}</div>
          )}
          
          <div className="mb-12">
            <AddToCartButton 
              product={product} 
              selectedColor={selectedColor} 
              setSelectedColor={setSelectedColor} 
              productColors={productColors}
            />
          </div>
          
          <div className="mb-12">
            <Accordion title="Deskripsi">
              {product.description || "Premium quality apparel designed for modern aesthetics and absolute comfort. Meticulously crafted to elevate your everyday wardrobe."}
            </Accordion>
            <Accordion title="Bahan & Perawatan">
              Dibuat dari 100% katun organik berkualitas tinggi. 
              Cuci dengan air dingin dan warna senada. Jangan gunakan pemutih. Keringkan dengan suhu rendah. Setrika dengan suhu sedang jika diperlukan.
            </Accordion>
            <Accordion title="Pengiriman & Pengembalian">
              Pesanan diproses dalam 1-2 hari kerja. Pengembalian gratis tersedia dalam waktu 14 hari sejak tanggal penerimaan. Barang harus dalam kondisi asli belum dipakai dan label belum dilepas.
            </Accordion>
          </div>

          <div className="pt-8 border-t border-gray-100 text-[10px] tracking-widest text-gray-400 space-y-3 font-medium uppercase">
            <p>GRATIS ONGKOS KIRIM UNTUK PESANAN DI ATAS Rp 5.000.000</p>
            <p>KODE PRODUK: {product.id.split('-')[0].toUpperCase()}</p>
          </div>

        </div>
      </div>

    </div>
  );
}
