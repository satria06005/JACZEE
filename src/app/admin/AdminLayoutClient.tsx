"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Image as ImageIcon } from "lucide-react";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dasboard", href: "/admin", icon: LayoutDashboard },
    { name: "Banners", href: "/admin/banners", icon: ImageIcon },
    { name: "Produk", href: "/admin/products", icon: Package },
    { name: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 print:bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex print:hidden">
        <div className="p-6 border-b border-gray-100 flex items-baseline">
          <span className="font-bold tracking-[0.3em] text-2xl text-black">JACZEE</span>
          <span className="ml-3 font-medium tracking-widest text-xs text-gray-400">ADMIN</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive
                    ? "bg-black text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Ke Toko Publik
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-auto bg-gray-50 print:bg-white p-8 print:p-0">
        {children}
      </main>
    </div>
  );
}
