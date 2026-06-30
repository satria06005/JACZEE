"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white text-black w-full max-w-2xl shadow-2xl pointer-events-auto overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100">
                <h2 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase">Panduan Ukuran</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
                <p className="text-xs tracking-widest text-gray-500 mb-8 leading-relaxed uppercase">
                  Gunakan panduan di bawah ini untuk menentukan ukuran pakaian Anda. Semua ukuran dalam sentimeter (cm).
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs tracking-wider">
                    <thead className="border-b-2 border-black">
                      <tr>
                        <th className="py-4 px-4 font-bold uppercase text-gray-900">Ukuran</th>
                        <th className="py-4 px-4 font-bold uppercase text-gray-900">Dada</th>
                        <th className="py-4 px-4 font-bold uppercase text-gray-900">Panjang</th>
                        <th className="py-4 px-4 font-bold uppercase text-gray-900">Bahu</th>
                        <th className="py-4 px-4 font-bold uppercase text-gray-900">Lengan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-semibold">S</td>
                        <td className="py-4 px-4 text-gray-600">50</td>
                        <td className="py-4 px-4 text-gray-600">70</td>
                        <td className="py-4 px-4 text-gray-600">44</td>
                        <td className="py-4 px-4 text-gray-600">22</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-semibold">M</td>
                        <td className="py-4 px-4 text-gray-600">53</td>
                        <td className="py-4 px-4 text-gray-600">72</td>
                        <td className="py-4 px-4 text-gray-600">46</td>
                        <td className="py-4 px-4 text-gray-600">23</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-semibold">L</td>
                        <td className="py-4 px-4 text-gray-600">56</td>
                        <td className="py-4 px-4 text-gray-600">74</td>
                        <td className="py-4 px-4 text-gray-600">48</td>
                        <td className="py-4 px-4 text-gray-600">24</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-semibold">XL</td>
                        <td className="py-4 px-4 text-gray-600">59</td>
                        <td className="py-4 px-4 text-gray-600">76</td>
                        <td className="py-4 px-4 text-gray-600">50</td>
                        <td className="py-4 px-4 text-gray-600">25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-xs font-bold tracking-[0.1em] uppercase mb-4">Cara Mengukur</h3>
                  <ul className="text-xs tracking-wider text-gray-500 space-y-3 leading-relaxed">
                    <li><strong className="text-gray-900">Dada:</strong> Ukur lingkar bagian dada terbesar, jaga pita ukur tetap horizontal.</li>
                    <li><strong className="text-gray-900">Panjang:</strong> Ukur dari titik tertinggi bahu turun ke tepi bawah pakaian.</li>
                    <li><strong className="text-gray-900">Bahu:</strong> Ukur lurus dari jahitan bahu kiri ke kanan bagian belakang.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
