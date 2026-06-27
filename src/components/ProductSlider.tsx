"use client";

import { useRef } from "react";
import FadeIn from "@/components/animations/FadeIn";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductGrid";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductSlider({ title, products }: { title?: string, products: Product[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full pb-24">
      {title && (
        <FadeIn direction="up">
          <div className="flex items-center justify-between mb-12 px-2">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase">{title}</h2>
            
            {/* Desktop Navigation Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => scroll("left")}
                className="p-2 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors rounded-full"
                aria-label="Geser ke kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="p-2 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors rounded-full"
                aria-label="Geser ke kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </FadeIn>
      )}
      
      {/* Slider Container */}
      <div className="relative group">
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 hide-scrollbar scroll-smooth"
        >
          {products.map((product, index) => (
            <div key={product.id} className="snap-start shrink-0 w-[75vw] md:w-[350px]">
              <FadeIn direction="up" delay={index * 0.1}>
                <ProductCard product={product} priority={index < 3} />
              </FadeIn>
            </div>
          ))}
        </div>
        
        {/* Mobile Indicator / Hint */}
        <div className="md:hidden text-center mt-4 text-[10px] tracking-widest text-gray-400 uppercase">
          Geser untuk melihat lebih banyak →
        </div>
      </div>
    </div>
  );
}
