"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "../actions";
import { useTransition } from "react";

export default function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen?")) {
      startTransition(async () => {
        await deleteProduct(id);
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-800 font-medium text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1"
      title="Hapus Produk"
    >
      <Trash2 className="w-4 h-4" />
      <span className="hidden sm:inline">{isPending ? "Menghapus..." : "Hapus"}</span>
    </button>
  );
}
