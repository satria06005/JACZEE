import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function MensCategoryPage({
  searchParams,
}: {
  searchParams: { subCategory?: string };
}) {
  const { subCategory } = await searchParams;

  const category = (await prisma.category.findUnique({
    where: { slug: "mens" },
    include: { subCategories: true } as any
  })) as any;

  const dbProducts = await prisma.product.findMany({
    where: { 
      category: { slug: "mens" },
      ...(subCategory ? { subCategory: { slug: subCategory } } as any : {})
    },
    include: { subCategory: true } as any
  });

  let targetLocation = "mens_hero";
  if (subCategory) {
    const suffix = subCategory.split('-')[1] || subCategory;
    targetLocation = `mens_hero_${suffix}`;
  }

  let banner = await (prisma as any).banner.findFirst({
    where: { location: targetLocation, isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  if (!banner && subCategory) {
    banner = await (prisma as any).banner.findFirst({
      where: { location: "mens_hero", isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  const bannerImageUrl = banner?.imageUrl || "https://picsum.photos/seed/mens-banner/1600/600";
  const bannerTitle = banner?.title || "Gaya Pria Modern";

  const products = dbProducts.map((p) => {
    const isDiscounted = p.discountPercent && p.discountPercent > 0;
    const finalPrice = isDiscounted ? p.price * (1 - p.discountPercent / 100) : p.price;
    return {
      id: p.id,
      name: p.name,
      price: `Rp ${finalPrice.toLocaleString('id-ID')}`,
      originalPrice: isDiscounted ? `Rp ${p.price.toLocaleString('id-ID')}` : undefined,
      discountPercent: p.discountPercent,
      imageUrl: p.imageUrl,
      galleryUrls: p.galleryUrls,
      href: `/shop/mens/${p.id}`,
    };
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-widest uppercase mb-6">Pria</h1>
        
        {/* Filter Bar */}
        {category?.subCategories && category.subCategories.length > 0 && (
          <div className="flex gap-6 overflow-x-auto pb-4 text-xs font-semibold uppercase tracking-widest border-b border-gray-100">
            <Link 
              href="/mens" 
              className={`transition-colors whitespace-nowrap ${!subCategory ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-black'}`}
            >
              Semua
            </Link>
            {category.subCategories.map((sub: any) => (
              <Link 
                key={sub.id}
                href={`/mens?subCategory=${sub.slug}`} 
                className={`transition-colors whitespace-nowrap ${subCategory === sub.slug ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-black'}`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] mb-16 overflow-hidden bg-stone-900 group">
        <Image 
          src={bannerImageUrl}
          alt={bannerTitle}
          fill
          className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-widest uppercase mb-4">{bannerTitle}</h2>
          <p className="max-w-2xl text-xs md:text-sm tracking-widest text-stone-200 leading-relaxed">
            Temukan koleksi eksklusif kami yang dirancang khusus untuk kenyamanan, ketahanan, dan gaya kasual yang tak lekang oleh waktu.
          </p>
        </div>
      </div>
      
      {products.length > 0 ? (
        <ProductGrid 
          title={`Koleksi Pria${subCategory && category?.subCategories ? ` - ${category.subCategories.find((s: any) => s.slug === subCategory)?.name || ''}` : ''}`} 
          products={products} 
        />
      ) : (
        <div className="text-center py-24 text-gray-500 uppercase tracking-widest text-sm font-semibold">
          Belum ada produk di kategori ini.
        </div>
      )}
    </div>
    </div>
  );
}
