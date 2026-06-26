import Link from "next/link";
import { Search, User, Menu } from "lucide-react";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-100 text-stone-900 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left Section: Hamburger + Logo + Links */}
        <div className="flex items-center gap-4 md:gap-8">
          <MobileMenu />
          {/* Image Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.jpeg" alt="JACZEE Logo" className="h-10 w-auto object-contain" />
          </Link>
          {/* Desktop Left Links */}
          <nav className="hidden md:flex gap-6 text-xs tracking-widest uppercase font-medium">
            <Link href="/mens" className="hover:opacity-70 transition-opacity">Pria</Link>
            <Link href="/womens" className="hover:opacity-70 transition-opacity">Wanita</Link>
            <Link href="/kids" className="hover:opacity-70 transition-opacity">Anak</Link>
          </nav>
        </div>

        {/* Center Title */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-lg md:text-xl font-bold tracking-[0.2em] uppercase">
          JACZEE
        </Link>

        {/* Right Links */}
        <div className="flex items-center gap-4 md:gap-6 text-xs tracking-widest uppercase font-medium">
          <button className="hidden md:flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Search className="w-3.5 h-3.5" />
            <span>CARI</span>
          </button>
          <Link href="/account" className="hidden md:flex hover:opacity-70 transition-opacity">AKUN</Link>
          <button className="md:hidden hover:opacity-70">
            <Search className="w-5 h-5" />
          </button>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
