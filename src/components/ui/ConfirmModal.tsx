"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isPending = false
}: ConfirmModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => !isPending && onClose()} 
      />
      
      {/* Modal */}
      <div className={`relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold tracking-widest uppercase">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            disabled={isPending}
            className="text-gray-400 hover:text-black transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-50 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isPending}
            className="px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
