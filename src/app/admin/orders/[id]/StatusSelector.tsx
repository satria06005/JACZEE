"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "../../actions";
import { useToastStore } from "@/store/useToastStore";

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "DIPROSES",
  "DIKIRIM",
  "SELESAI",
  "DIBATALKAN"
];

export default function StatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToastStore();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        addToast(`Status pesanan diubah menjadi ${newStatus}`, "success");
      } catch (err) {
        addToast("Gagal memperbarui status", "error");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="status" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status:</label>
      <select
        id="status"
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isPending}
        className="bg-gray-50 border border-gray-200 text-black text-xs font-semibold rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:opacity-50 cursor-pointer min-w-[120px]"
      >
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
