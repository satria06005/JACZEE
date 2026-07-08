import FadeIn from "@/components/animations/FadeIn";
import ProductCard from "./ProductCard";

export interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  href: string;
  discountPercent?: number;
  originalPrice?: string;
  galleryUrls?: string[];
  colors?: string[];
}

export default function ProductGrid({ title, products }: { title?: string, products: Product[] }) {
  return (
    <div className="w-full pb-24">
      {title && (
        <FadeIn direction="up">
          <h1 className="text-center text-sm tracking-[0.2em] uppercase mb-16">{title}</h1>
        </FadeIn>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16 max-w-[1600px] mx-auto">
        {products.map((product, index) => (
          <FadeIn key={product.id} direction="up" delay={index * 0.1}>
            <ProductCard product={product} priority={index < 4} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
