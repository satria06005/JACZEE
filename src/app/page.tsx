import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import { prisma } from "@/lib/prisma";

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
    title: "The Cinder III Basketball",
    imageUrl: "https://picsum.photos/seed/cinder/2000/1000",
    linkUrl: "/shop/cinder-iii",
    linkText: "Shop"
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
            className="object-cover object-center opacity-80"
            priority
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 px-6">
          <FadeIn direction="up" delay={0.2}>
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase font-light text-center mb-8">
              {heroBanner.title}
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.4}>
            <Link 
              href={heroBanner.linkUrl} 
              className="bg-black text-white px-12 py-3 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
            >
              {heroBanner.linkText}
            </Link>
          </FadeIn>
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

      {/* Product Feature */}
      <section className="relative w-full h-[80svh] md:h-[90svh]">
        <div className="absolute inset-0 bg-stone-900">
          <Image 
            src={featureBanner.imageUrl}
            alt={featureBanner.title}
            fill
            sizes="100vw"
            className="object-cover object-center opacity-70"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6">
          <FadeIn direction="up">
            <h2 className="text-white text-2xl md:text-4xl lg:text-5xl tracking-[0.2em] uppercase font-light text-center mb-8">
              {featureBanner.title}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <Link 
              href={featureBanner.linkUrl} 
              className="bg-black text-white px-12 py-3 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
            >
              {featureBanner.linkText}
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
