import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

export default function CountryPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn direction="up">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-16 text-center border-b border-gray-100 pb-12">
            Pilih Wilayah
          </h1>
          
          <div className="space-y-8 text-center">
            <p className="text-sm tracking-widest leading-relaxed text-gray-500 mb-12">
              Pilih lokasi pengiriman dan mata uang preferensi Anda untuk pengalaman berbelanja yang disesuaikan.
            </p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <button className="w-full bg-black text-white px-6 py-4 text-xs tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors">
                Indonesia (IDR Rp)
              </button>
              <button className="w-full bg-white text-black border border-black px-6 py-4 text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors">
                International (USD $)
              </button>
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-100">
              <Link href="/" className="text-xs tracking-widest uppercase hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
