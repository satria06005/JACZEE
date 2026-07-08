"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "../actions";
import { useState, useTransition } from "react";
import { useToastStore } from "@/store/useToastStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToastStore();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const response = await deleteProduct(id);
        if (response && response.error) {
          addToast(response.error, "error");
          setShowModal(false);
          return;
        }
        addToast("Produk berhasil dihapus", "success");
        setShowModal(false);
      } catch (error: any) {
        addToast(error.message || "Gagal menghapus produk", "error");
        setShowModal(false);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="text-red-600 hover:text-red-800 font-medium text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1"
        title="Hapus Produk"
      >
        <Trash2 className="w-4 h-4" />
        <span className="hidden sm:inline">{isPending ? "Menghapus..." : "Hapus"}</span>
      </button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini secara permanen? Tindakan ini tidak dapat dibatalkan dan semua data produk akan hilang."
        confirmText="Hapus Permanen"
      />
    </>
  );
}
