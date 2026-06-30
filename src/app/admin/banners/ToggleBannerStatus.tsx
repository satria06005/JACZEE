"use client";

import { useState } from "react";
import { toggleBannerStatus } from "./actions";
import { useToastStore } from "@/store/useToastStore";

export default function ToggleBannerStatus({ id, initialStatus }: { id: string, initialStatus: boolean }) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToastStore((state) => state.addToast);

  const handleToggle = async () => {
    setIsLoading(true);
    const newStatus = !isActive;
    // Optimistic update
    setIsActive(newStatus);
    
    const res = await toggleBannerStatus(id, newStatus);
    if (!res.success) {
      // Revert if failed
      setIsActive(!newStatus);
      showToast("Gagal mengubah status", "error");
    } else {
      showToast(`Banner ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`, "success");
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${isLoading ? "opacity-50" : ""}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md bg-white" />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out ${
          isActive ? 'bg-black' : 'bg-gray-200'
        }`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
          isActive ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
