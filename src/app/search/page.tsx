import ProductGrid from "@/components/ProductGrid";
import ProductSlider from "@/components/ProductSlider";
import { prisma } from "@/lib/prisma";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const { q } = await searchParams;

  let dbProducts: any[] = [];
  let categoryRecommendations: any[] = [];
  
  if (q && q.trim() !== "") {
    dbProducts = await prisma.product.findMany({
      where: { 
        OR: [
          {
            name: {
              contains: q.trim(),
              mode: 'insensitive'
            }
          },
          {
            category: {
              name: {
                contains: q.trim(),
                mode: 'insensitive'
              }
            }
          },
          {
            subCategory: {
              name: {
                contains: q.trim(),
                mode: 'insensitive'
              }
            }
          }
        ]
      },
      include: { category: true, subCategory: true }
    });
  }

  // Jika tidak ada pencarian ATAU pencarian tidak membuahkan hasil, ambil produk per kategori
  if (!q || dbProducts.length === 0) {
    categoryRecommendations = await prisma.category.findMany({
      include: { 
        products: {
          take: 6,
          include: { category: true }
        }
      }
    });
  }

  const products = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: `Rp ${p.price.toLocaleString('id-ID')}`,
    imageUrl: p.imageUrl,
    galleryUrls: p.galleryUrls,
    href: `/shop/${p.category.slug}/${p.id}`,
  }));

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* Search Header & Input */}
        <div className="mb-16 text-center max-w-2xl mx-auto relative z-40">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[0.2em] uppercase mb-8">Pencarian</h1>
          
          <div className="sticky top-[70px] bg-white pt-4 pb-6 z-40 shadow-[0_10px_10px_-10px_rgba(0,0,0,0.05)]">
            <form action="/search" method="GET" className="relative group">
              <input 
                type="text" 
                name="q"
                defaultValue={q}
                placeholder="Cari nama produk..."
                className="w-full border-b-2 border-gray-200 py-4 outline-none focus:border-black transition-colors text-sm tracking-widest uppercase bg-transparent text-center"
                autoFocus
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </form>
          </div>
        </div>

        {/* Results Area */}
        {q && products.length > 0 ? (
          <div>
            <div className="mb-8 text-center text-xs tracking-widest text-gray-500 uppercase">
              Menampilkan {products.length} hasil untuk "{q}"
            </div>
            <ProductGrid title="" products={products} />
          </div>
        ) : (
          <div className="mt-12">
            {q && (
              <div className="text-center pb-16 text-gray-400 uppercase tracking-widest text-sm font-semibold">
                Produk tidak ditemukan. Silakan coba kata kunci lain.
              </div>
            )}
            
            <div className="space-y-16">
              {categoryRecommendations.map((cat) => {
                if (cat.products.length === 0) return null;
                
                const catProducts = cat.products.map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  price: `Rp ${p.price.toLocaleString('id-ID')}`,
                  imageUrl: p.imageUrl,
                  galleryUrls: p.galleryUrls,
                  href: `/shop/${p.category.slug}/${p.id}`,
                }));

                const getIndonesianName = (name: string) => {
                  const dict: Record<string, string> = {
                    'mens': 'Pria',
                    'womens': 'Wanita',
                    'kids': 'Anak'
                  };
                  return dict[name.toLowerCase()] || name;
                };

                return (
                  <ProductSlider 
                    key={cat.id} 
                    title={`Rekomendasi ${getIndonesianName(cat.name)}`} 
                    products={catProducts} 
                  />
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
