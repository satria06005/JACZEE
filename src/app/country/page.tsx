"use client";

import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import { useState } from "react";
import { useToastStore } from "@/store/useToastStore";

export default function CountryPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<"IDR" | "USD">("IDR");
  const { addToast } = useToastStore();

  const handleSelect = (currency: "IDR" | "USD") => {
    setSelectedCurrency(currency);
    addToast(`Preferensi mata uang telah diubah ke ${currency}`, "info");
  };

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn direction="up">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-16 text-center border-b border-gray-100 pb-12">
            Pilih Wilayah
          </h1>
          
          <div className="space-y-8 text-center">
            <p className="text-sm tracking-widest leading-relaxed text-gray-500 mb-12">
              Pilih lokasi pengiriman dan mata uang preferensi Anda untuk pengalaman berbelanja yang disesuaikan.
            </p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <button 
                onClick={() => handleSelect("IDR")}
                className={`w-full px-6 py-4 text-xs tracking-[0.2em] uppercase transition-colors ${
                  selectedCurrency === "IDR" 
                    ? "bg-black text-white hover:bg-stone-800" 
                    : "bg-white text-black border border-black hover:bg-gray-50"
                }`}
              >
                Indonesia (IDR Rp)
              </button>
              <button 
                onClick={() => handleSelect("USD")}
                className={`w-full px-6 py-4 text-xs tracking-[0.2em] uppercase transition-colors ${
                  selectedCurrency === "USD" 
                    ? "bg-black text-white hover:bg-stone-800" 
                    : "bg-white text-black border border-black hover:bg-gray-50"
                }`}
              >
                International (USD $)
              </button>
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-100">
              <Link href="/" className="text-xs tracking-widest uppercase hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
