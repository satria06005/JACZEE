import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] md:h-screen bg-stone-100">
        <Image 
          src="https://picsum.photos/seed/jaczee-about/1920/1080"
          alt="JACZEE Brand Philosophy"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <FadeIn direction="up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-[0.3em] uppercase mb-6">Tentang Kami</h1>
            <p className="text-sm md:text-base tracking-[0.2em] font-light max-w-2xl leading-relaxed uppercase">
              Mendefinisikan Ulang Kesederhanaan Melalui Kemewahan yang Hening.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 md:py-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          <FadeIn direction="right">
            <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-8">Filosofi</h2>
            <div className="space-y-6 text-sm text-gray-600 leading-loose tracking-wide">
              <p>
                JACZEE lahir dari sebuah gagasan sederhana: bahwa pakaian terbaik tidak seharusnya berteriak untuk mendapatkan perhatian. Kami percaya pada kekuatan kesederhanaan, pada jahitan yang sempurna, dan pada material berkualitas tinggi yang berbicara untuk dirinya sendiri.
              </p>
              <p>
                Setiap potongan koleksi kami dirancang dengan cermat di studio kami, terinspirasi oleh arsitektur modern dan keindahan alam yang tak lekang oleh waktu. Kami menciptakan pakaian bukan sekadar sebagai penutup tubuh, melainkan sebagai perpanjangan dari identitas dan karakter penggunanya.
              </p>
            </div>
          </FadeIn>
          <FadeIn direction="left">
            <div className="relative w-full aspect-[4/5] bg-stone-100">
              <Image 
                src="https://picsum.photos/seed/jaczee-philosophy/800/1000"
                alt="JACZEE Philosophy"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Craftsmanship Section */}
      <div className="bg-[#0a0a0a] text-white py-32 md:py-48">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
            <FadeIn direction="right" className="order-2 md:order-1">
              <div className="relative w-full aspect-[4/5] bg-stone-900">
                <Image 
                  src="https://picsum.photos/seed/jaczee-craft/800/1000"
                  alt="JACZEE Craftsmanship"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                />
              </div>
            </FadeIn>
            <FadeIn direction="left" className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-8">Keahlian & Material</h2>
              <div className="space-y-6 text-sm text-stone-400 leading-loose tracking-wide">
                <p>
                  Kemewahan sejati terletak pada detail yang sering kali tidak terlihat secara kasat mata. Oleh karena itu, kami berkeliling dunia untuk bermitra secara eksklusif dengan pengrajin dan pabrik tekstil terbaik yang memiliki nilai dan standar etika yang sama dengan kami.
                </p>
                <p>
                  Mulai dari katun organik premium yang kami gunakan hingga teknik penjahitan tradisional yang diaplikasikan pada setiap koleksi, JACZEE berdedikasi untuk menciptakan busana yang tidak hanya indah saat dipandang, tetapi juga luar biasa saat dikenakan, musim demi musim.
                </p>
                <div className="pt-8">
                  <Link 
                    href="/shop"
                    className="inline-block border-b border-white pb-2 text-xs font-bold tracking-[0.2em] uppercase hover:text-stone-400 hover:border-stone-400 transition-colors"
                  >
                    Jelajahi Koleksi Kami
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

    </div>
  );
}
