"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { deleteBanner } from "./actions";
import { useToastStore } from "@/store/useToastStore";
import { useState, useEffect } from "react";

export default function DeleteBannerButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const showToast = useToastStore((state) => state.addToast);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteBanner(id);
    setIsDeleting(false);
    setShowModal(false);
    
    if (res.success) {
      showToast("Banner berhasil dihapus", "success");
    } else {
      showToast("Gagal menghapus banner", "error");
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={isDeleting}
        className={`text-red-500 hover:text-red-700 transition-colors inline-block ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setShowModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Banner?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Banner ini akan dihapus secara permanen dari sistem dan tidak akan muncul lagi di website Anda.
              </p>
            </div>
            <div className="bg-gray-50/80 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm shadow-red-500/20 flex items-center gap-2"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Banner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
