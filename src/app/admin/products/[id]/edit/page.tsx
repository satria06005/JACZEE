import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    include: { subCategories: true }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Produk</h1>
      </div>

      <EditProductForm product={product} categories={categories} />
    </div>
  );
}
