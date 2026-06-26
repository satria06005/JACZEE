"use client";

import Image from "next/image";
import Accordion from "@/components/Accordion";
import AddToCartButton from "./AddToCartButton";
import { useState } from "react";

export const COLORS = [
  { id: 'hitam', name: 'Hitam', hex: '#1c1c1c' },
  { id: 'gading', name: 'Gading (Ivory)', hex: '#f4f3ed' },
  { id: 'coklat', name: 'Coklat Tanah', hex: '#8b7355' },
];

export default function ProductDetailClient({ product }: { product: any }) {
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].id);

  // Generate mock gallery images based on the selected color
  // In a real app, product would have an array of image URLs per color
  const colorIndex = COLORS.findIndex(c => c.id === selectedColor);
  const baseImg = product.imageUrl.replace('/seed/', `/seed/c${colorIndex}-`);
  
  const galleryImages = [
    baseImg,
    baseImg.replace('/seed/', '/seed/alt1-'),
    baseImg.replace('/seed/', '/seed/alt2-'),
    baseImg.replace('/seed/', '/seed/alt3-'),
  ];

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
          </div>
        ))}
      </div>

      {/* Right: Sticky Product Details */}
      <div className="md:col-span-5 relative">
        <div className="sticky top-32 flex flex-col h-fit pb-12">
          
          <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
          <div className="text-lg text-gray-600 mb-8">Rp {product.price.toLocaleString('id-ID')}</div>
          
          <div className="mb-12">
            <AddToCartButton 
              product={product} 
              selectedColor={selectedColor} 
              setSelectedColor={setSelectedColor} 
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
