import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { prisma } from "@/lib/prisma";
import { ShieldCheck, Grip, Activity } from "lucide-react";

const FadeIn = dynamic(() => import("@/components/animations/FadeIn"));
const TestimonialSlider = dynamic(() => import("@/components/TestimonialSlider"));

export const revalidate = 3600; // Cache halaman selama 1 jam (ISR)

export default async function Home() {
  const activeBanners = await prisma.banner.findMany({
    where: { isActive: true },
  });

  const getBanner = (location: string, fallback: any) => {
    const banner = activeBanners.find((b: any) => b.location === location);
    if (!banner) return fallback;
    return {
      title: banner.title || fallback.title,
      imageUrl: banner.imageUrl || fallback.imageUrl,
      linkUrl: banner.linkUrl || fallback.linkUrl,
      linkText: banner.linkText || fallback.linkText,
    };
  };

  const heroBanner = getBanner('hero', {
    title: "Essentials Summer 2026",
    imageUrl: "https://picsum.photos/seed/hero/2000/1200",
    linkUrl: "/shop",
    linkText: "Shop"
  });
  
  const mensBanner = getBanner('collection_mens', {
    imageUrl: "https://picsum.photos/seed/mens/800/1000",
    linkUrl: "/mens",
    linkText: "Shop Mens"
  });

  const womensBanner = getBanner('collection_womens', {
    imageUrl: "https://picsum.photos/seed/womens/800/1000",
    linkUrl: "/womens",
    linkText: "Shop Womens"
  });

  const featureBanner = getBanner('feature', {
    title: "The Signature Knitwear",
    imageUrl: "https://picsum.photos/seed/knitwear/2000/1000",
    linkUrl: "/shop",
    linkText: "Beli Sekarang"
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[100svh]">
        <div className="absolute inset-0 bg-stone-800">
          <Image 
            src={heroBanner.imageUrl}
            alt={heroBanner.title}
            fill
            sizes="100vw"
            quality={60}
            className="object-cover object-center opacity-80"
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 px-6">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase font-light text-center mb-8">
            {heroBanner.title}
          </h1>
          <Link 
            href={heroBanner.linkUrl} 
            className="bg-black text-white px-12 py-3 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
          >
            {heroBanner.linkText}
          </Link>
        </div>
      </section>

      {/* Collection Nine Section */}
      <section className="w-full py-20 px-4 md:px-8">
        <FadeIn direction="up">
          <h2 className="text-center text-xs tracking-[0.2em] uppercase mb-12">
            Collection Nine
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-[1600px] mx-auto">
          {/* Mens */}
          <FadeIn direction="up" delay={0.1}>
            <div className="relative aspect-[3/4] md:aspect-[4/5] bg-stone-200 group overflow-hidden">
              <Image 
                src={mensBanner.imageUrl}
                alt="Mens Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <Link 
                  href={mensBanner.linkUrl} 
                  className="bg-black text-white px-8 py-3 text-xs tracking-widest uppercase text-center w-full max-w-[200px] mx-auto hover:bg-white hover:text-black transition-colors duration-300"
                >
                  {mensBanner.linkText}
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Womens */}
          <FadeIn direction="up" delay={0.3}>
            <div className="relative aspect-[3/4] md:aspect-[4/5] bg-stone-200 group overflow-hidden">
              <Image 
                src={womensBanner.imageUrl}
                alt="Womens Collection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <Link 
                  href={womensBanner.linkUrl} 
                  className="bg-black text-white px-8 py-3 text-xs tracking-widest uppercase text-center w-full max-w-[200px] mx-auto hover:bg-white hover:text-black transition-colors duration-300"
                >
                  {womensBanner.linkText}
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Flagship Product Feature: The Cinder III */}
      {/* 1. Hero & Value Proposition */}
      <section className="relative w-full h-[80svh] md:h-[90svh]">
        <div className="absolute inset-0 bg-stone-900">
          <Image 
            src={featureBanner.imageUrl}
            alt={featureBanner.title}
            fill
            sizes="100vw"
            quality={60}
            className="object-cover object-center opacity-60"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <FadeIn direction="up">
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase font-light text-center mb-6">
              {featureBanner.title}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="text-stone-300 text-center max-w-2xl mx-auto text-sm md:text-base tracking-widest uppercase font-light mb-12 leading-relaxed">
              Dirajut dengan presisi. Dibuat bagi Anda yang mengutamakan kenyamanan. Rasakan kelembutan dan kehangatan sempurna di setiap kesempatan.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.4}>
            <Link 
              href={featureBanner.linkUrl} 
              className="bg-white text-black px-12 py-4 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300"
            >
              Beli Sekarang
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 2. Product Benefits */}
      <section className="w-full py-24 px-4 md:px-8 bg-stone-50">
        <div className="max-w-[1200px] mx-auto">
          <FadeIn direction="up">
            <h3 className="text-center text-xs tracking-[0.2em] uppercase mb-16 text-stone-600">
              Mengapa Memilih Koleksi Rajut Kami
            </h3>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <FadeIn direction="up" delay={0.1}>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-8 h-8 text-stone-800 mb-6 stroke-[1.5]" />
                <h4 className="text-sm tracking-widest uppercase mb-4">Bahan Rajut Premium</h4>
                <p className="text-stone-600 text-sm leading-relaxed max-w-xs">
                  Dirajut dari benang pilihan untuk tingkat kelembutan tak tertandingi dan sirkulasi udara yang baik sepanjang hari.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="flex flex-col items-center text-center">
                <Grip className="w-8 h-8 text-stone-800 mb-6 stroke-[1.5]" />
                <h4 className="text-sm tracking-widest uppercase mb-4">Desain Timeless</h4>
                <p className="text-stone-600 text-sm leading-relaxed max-w-xs">
                  Siluet klasik yang tidak pernah lekang oleh waktu, dirancang khusus agar mudah dipadukan untuk gaya kasual maupun formal.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="up" delay={0.5}>
              <div className="flex flex-col items-center text-center">
                <Activity className="w-8 h-8 text-stone-800 mb-6 stroke-[1.5]" />
                <h4 className="text-sm tracking-widest uppercase mb-4">Nyaman Sepanjang Hari</h4>
                <p className="text-stone-600 text-sm leading-relaxed max-w-xs">
                  Konstruksi rajutan elastis yang ringan mengikuti bentuk tubuh, memberikan kebebasan bergerak dan kenyamanan maksimal.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. Social Proof / Testimonials */}
      <section className="w-full py-24 bg-stone-900 text-white overflow-hidden">
        <TestimonialSlider />
      </section>
    </div>
  );
}
