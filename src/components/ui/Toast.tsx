"use client";

import { useToastStore, ToastType } from "@/store/useToastStore";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const getIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "error":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "info":
      return <Info className="w-5 h-5 text-gray-500" />;
  }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like spring
            className="pointer-events-auto flex items-center gap-4 bg-white/95 backdrop-blur-md text-black border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-5 py-4 min-w-[320px] max-w-[400px]"
          >
            {getIcon(toast.type)}
            
            <p className="flex-1 text-xs tracking-widest font-semibold uppercase leading-snug">
              {toast.message}
            </p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
