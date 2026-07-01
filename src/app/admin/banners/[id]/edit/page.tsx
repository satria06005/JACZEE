import BannerForm from "../../BannerForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const banner = await prisma.banner.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!banner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Banner</h1>
        <p className="text-gray-500 mt-1 text-sm">Ubah informasi banner.</p>
      </div>
      
      <BannerForm initialData={banner} />
    </div>
  );
}
