import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const { orderId } = await searchParams;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-32 pb-24 px-6">
      <FadeIn direction="up" className="w-full max-w-2xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-8 relative">
            <CheckCircle2 className="w-10 h-10" />
            <div className="absolute inset-0 border-4 border-black rounded-full animate-ping opacity-20" />
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-6 text-black">
            Pesanan Berhasil
          </h1>
          <div className="w-12 h-[1px] bg-black mx-auto mb-6" />
          <p className="text-gray-500 max-w-lg mx-auto text-sm tracking-widest leading-relaxed">
            Terima kasih telah memilih JACZEE. Pesanan Anda sedang kami proses dengan cermat dan penuh perhatian.
          </p>
        </div>

        {/* Order Details Box */}
        {orderId && (
          <div className="bg-stone-50 border border-stone-200 p-8 md:p-12 mb-12">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-[0.2em] font-semibold">
              Nomor Pesanan Anda
            </p>
            <div className="inline-block bg-white border border-gray-200 px-6 py-4 shadow-sm">
              <p className="text-lg md:text-xl font-mono text-black tracking-widest font-bold break-all">
                {orderId}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-6 tracking-wider">
              Simpan nomor pesanan ini untuk melacak status pengiriman Anda nantinya. Email konfirmasi beserta rincian faktur telah dikirimkan ke kotak masuk Anda.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/track-order" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black border border-black px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Lacak Pesanan
          </Link>
          <Link 
            href="/shop" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white border border-black px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-stone-800 transition-colors group"
          >
            Lanjut Belanja
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
