import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const { orderId } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32 pb-20 px-6">
      <div className="bg-white p-10 md:p-16 rounded-2xl border border-gray-200 shadow-sm max-w-2xl w-full text-center space-y-6">
        <div className="flex justify-center mb-8">
          <CheckCircle2 className="w-24 h-24 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">Pesanan Berhasil!</h1>
        
        <p className="text-gray-500 max-w-lg mx-auto">
          Terima kasih telah berbelanja di JACZEE. Kami telah menerima pesanan Anda dan saat ini sedang memprosesnya.
        </p>

        {orderId && (
          <div className="bg-gray-50 p-6 rounded-xl mt-8 mb-8 inline-block">
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-widest font-medium">Nomor Pesanan Anda</p>
            <p className="text-xl font-bold tracking-wider">{orderId}</p>
          </div>
        )}

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-block bg-black text-white px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
          >
            Lanjutkan Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}
