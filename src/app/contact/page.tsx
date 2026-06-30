"use client";

import FadeIn from "@/components/animations/FadeIn";
import { useState } from "react";
import { submitContactMessage } from "@/actions/contact";
import { useToastStore } from "@/store/useToastStore";

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);
    
    setIsPending(false);
    
    if (result.success) {
      addToast("Pesan Anda telah terkirim. Tim kami akan segera menghubungi Anda.", "success");
      (e.target as HTMLFormElement).reset();
    } else {
      addToast(result.error || "Gagal mengirim pesan.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn direction="up">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-16 text-center border-b border-gray-100 pb-12">
            Kontak
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-xs tracking-widest uppercase font-semibold mb-6">Hubungi Kami</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Tim layanan pelanggan JACZEE siap membantu Anda dengan pertanyaan mengenai produk, pesanan, maupun informasi lainnya.
              </p>
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:support@jaczee.com" className="text-gray-500 hover:text-black transition-colors">support@jaczee.com</a>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telepon / WhatsApp</h3>
                  <p className="text-gray-500">+62 811 2345 6789</p>
                  <p className="text-xs text-gray-400 mt-1">Senin - Jumat, 09:00 - 18:00 WIB</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xs tracking-widest uppercase font-semibold mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input type="text" name="name" required placeholder="NAMA LENGKAP" className="w-full border-b border-gray-300 pb-2 text-xs tracking-widest uppercase outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400" />
                </div>
                <div>
                  <input type="email" name="email" required placeholder="ALAMAT EMAIL" className="w-full border-b border-gray-300 pb-2 text-xs tracking-widest uppercase outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400" />
                </div>
                <div>
                  <textarea name="message" required placeholder="PESAN ANDA" rows={4} className="w-full border-b border-gray-300 pb-2 text-xs tracking-widest uppercase outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400 resize-none"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-black text-white px-8 py-3 text-xs tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {isPending ? "MENGIRIM..." : "KIRIM PESAN"}
                </button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
