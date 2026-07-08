"use client";

import { useTransition, useState } from "react";
import { deleteOrder } from "@/actions/order";
import { useToastStore } from "@/store/useToastStore";
import { Trash2, AlertCircle } from "lucide-react";

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToastStore();

  const handleConfirmDelete = () => {
    startTransition(async () => {
      const result = await deleteOrder(orderId);
      if (result.success) {
        addToast("Pesanan berhasil dihapus.", "success");
        setIsModalOpen(false);
      } else {
        addToast(result.error || "Gagal menghapus pesanan.", "error");
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="text-red-600 hover:text-red-800 font-medium text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {isPending ? "HAPUS..." : "HAPUS"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Pesanan?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {isPending ? (
                  <span className="animate-pulse">Menghapus...</span>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
