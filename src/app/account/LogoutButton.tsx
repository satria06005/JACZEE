"use client";

import { logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-xs font-bold tracking-widest uppercase text-red-600 hover:text-red-800 transition-colors border-b border-transparent hover:border-red-800"
    >
      Keluar
    </button>
  );
}
