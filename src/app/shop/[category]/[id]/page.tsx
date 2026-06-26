import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const { id, category } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-gray-400 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Beranda</Link>
          <span>/</span>
          <Link href={`/${category}`} className="hover:text-black transition-colors">{product.category.name}</Link>
          <span>/</span>
          <span className="text-black font-semibold">{product.name}</span>
        </nav>

        <ProductDetailClient product={product} />

      </div>
    </div>
  );
}
