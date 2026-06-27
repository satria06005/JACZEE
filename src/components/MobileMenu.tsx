"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="md:hidden" onClick={() => setIsOpen(true)}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="font-bold tracking-[0.2em] text-xl">JACZEE</span>
          <button onClick={() => setIsOpen(false)} className="hover:opacity-50 transition-opacity">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex flex-col px-6 py-12 gap-8 text-sm tracking-widest uppercase font-medium">
          <Link href="/mens" onClick={() => setIsOpen(false)} className="hover:opacity-50 transition-opacity border-b pb-4">Pria</Link>
          <Link href="/womens" onClick={() => setIsOpen(false)} className="hover:opacity-50 transition-opacity border-b pb-4">Wanita</Link>
          <Link href="/kids" onClick={() => setIsOpen(false)} className="hover:opacity-50 transition-opacity border-b pb-4">Anak</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:opacity-50 transition-opacity border-b pb-4 mt-8">Tentang Kami</Link>
          <Link href="/account" onClick={() => setIsOpen(false)} className="hover:opacity-50 transition-opacity border-b pb-4">Akun Saya</Link>
        </nav>
      </div>
    </>
  );
}
