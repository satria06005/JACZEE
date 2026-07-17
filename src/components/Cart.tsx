"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Cart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for persisted store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-50 transition-opacity backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Slide-over Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h2 className="text-xs tracking-widest uppercase font-semibold">
            Keranjang Belanja {items.length > 0 && `(${items.reduce((sum, item) => sum + item.quantity, 0)})`}
          </h2>
          <button onClick={closeCart} className="hover:opacity-50 transition-opacity" aria-label="Tutup Keranjang">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <p className="text-xs tracking-widest uppercase">Keranjang Anda Kosong</p>
              <button onClick={closeCart} className="text-black border-b border-black pb-1 text-xs tracking-widest uppercase hover:opacity-70 transition-opacity">
                Lanjut Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-stone-100 overflow-hidden flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="text-sm font-bold text-black uppercase tracking-wider leading-tight">
                        {item.name && item.name !== "undefined - undefined" ? item.name : "Koleksi Eksklusif JACZEE"}
                      </h3>
                      {item.size && (
                        <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-widest font-medium">
                          Ukuran: {item.size}
                        </p>
                      )}
                      <p className="text-sm font-medium text-black mt-2">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 hover:bg-gray-50 text-gray-500"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-4 text-xs font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-50 text-gray-500"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors"
                        aria-label="Hapus produk"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs tracking-widest uppercase font-medium">
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} Barang)
              </span>
              <span className="text-sm font-semibold">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-wider">
              Pajak dan biaya pengiriman dihitung saat checkout.
            </p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-black text-white px-6 py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors flex justify-center items-center mt-6"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
