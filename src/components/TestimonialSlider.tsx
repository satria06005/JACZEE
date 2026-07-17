"use client";

import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const testimonials = [
  {
    quote: "Bahan rajutnya sangat lembut dan tidak gatal sama sekali di kulit. Sangat nyaman dipakai seharian untuk cuaca dingin maupun hangat.",
    author: "Rina A., Karyawati"
  },
  {
    quote: "Sweater rajut untuk anak saya pas banget! Desainnya lucu dan bahannya aman untuk kulit anak yang sensitif.",
    author: "Bunda Siska"
  },
  {
    quote: "Kualitas rajutannya sangat rapi dan tebal. Desain cardigan prianya bikin penampilan jadi lebih stylish buat ke kantor.",
    author: "Dimas W., Profesional Muda"
  },
  {
    quote: "Sudah dicuci berkali-kali tapi bentuk dan warnanya tetap awet. Bener-bener pakaian rajut berkualitas premium!",
    author: "Sari K., Ibu Rumah Tangga"
  },
  {
    quote: "Suka banget sama koleksi musim dinginnya! Sangat menghangatkan tapi bahannya tetap breathable. Will definitely buy again.",
    author: "Kevin S., Mahasiswa"
  }
];

export default function TestimonialSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current;
      
      let newScrollLeft = scrollLeft;
      
      if (direction === 'left') {
        if (scrollLeft <= 0) {
          // Jika di paling awal, lompat ke paling akhir
          newScrollLeft = scrollWidth - clientWidth;
        } else {
          newScrollLeft = scrollLeft - clientWidth;
        }
      } else {
        // Menggunakan Math.ceil untuk mengatasi perbedaan pembulatan pixel
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
          // Jika di paling akhir, kembali ke awal
          newScrollLeft = 0;
        } else {
          newScrollLeft = scrollLeft + clientWidth;
        }
      }
      
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative max-w-[1000px] mx-auto group">
      <FadeIn direction="up">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full"
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full shrink-0 snap-center flex flex-col items-center text-center px-12 md:px-24">
              <div className="flex justify-center gap-1 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-white text-white" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-light italic leading-relaxed mb-8 max-w-3xl">
                "{testimonial.quote}"
              </blockquote>
              <cite className="block text-xs tracking-[0.2em] uppercase text-stone-400 not-italic">
                — {testimonial.author}
              </cite>
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm transition-colors hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Testimoni sebelumnya"
        >
          <ChevronLeft className="w-10 h-10 stroke-[1]" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm transition-colors hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Testimoni selanjutnya"
        >
          <ChevronRight className="w-10 h-10 stroke-[1]" />
        </button>

        {/* Mobile instruction */}
        <div className="flex justify-center mt-2 md:hidden">
          <span className="text-[10px] tracking-widest uppercase text-stone-500 font-light">
            Geser untuk melihat lebih banyak
          </span>
        </div>
      </FadeIn>
    </div>
  );
}
