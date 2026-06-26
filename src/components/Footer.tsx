import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white pt-32 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* Brand Name */}
        <Link href="/" className="mb-20">
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.3em] uppercase hover:opacity-70 transition-opacity">
            JACZEE
          </h2>
        </Link>
        
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-xs md:text-sm tracking-widest uppercase font-medium text-stone-400 mb-24">
          <Link href="/country" className="hover:text-white transition-colors duration-300">Indonesia (IDR)</Link>
          <Link href="/contact" className="hover:text-white transition-colors duration-300">Kontak</Link>
          <Link href="/client-services" className="hover:text-white transition-colors duration-300">Layanan Pelanggan</Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-300">Syarat & Ketentuan</Link>
          <Link href="/privacy" className="hover:text-white transition-colors duration-300">Kebijakan Privasi</Link>
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.2em] text-stone-500 uppercase">
          <span>© 2026 JACZEE. Seluruh Hak Cipta Dilindungi.</span>
          <span className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </span>
        </div>

      </div>
    </footer>
  );
}
