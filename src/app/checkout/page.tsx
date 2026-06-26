"use client";

import { useCartStore } from "@/store/useCartStore";
import { processCheckout } from "@/actions/checkout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("items", JSON.stringify(items));
    formData.append("totalAmount", totalAmount.toString());

    startTransition(async () => {
      try {
        const result = await processCheckout(formData);
        if (result.success) {
          clearCart();
          router.push(`/checkout/success?orderId=${result.orderId}`);
        }
      } catch (error) {
        alert("Gagal memproses pesanan. Silakan coba lagi.");
        console.error(error);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Keranjang Kosong</h1>
        <p className="text-gray-500 mb-8">Anda belum menambahkan apa pun untuk di-checkout.</p>
        <Link href="/" className="bg-black text-white px-8 py-4 text-sm tracking-widest uppercase font-bold hover:bg-gray-800 transition-colors">
          Kembali Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 text-black">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* Left: Form */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-bold tracking-wider uppercase mb-2 text-black">Checkout</h1>
          <p className="text-gray-500 text-sm mb-8">
            Harap lengkapi informasi pengiriman Anda di bawah ini dengan detail dan akurat. Kami akan memastikan pesanan koleksi eksklusif Anda tiba dengan aman di tempat tujuan.
          </p>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="font-bold text-lg border-b border-gray-100 pb-4 uppercase tracking-widest text-black">Informasi Pengiriman</h2>
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Nama Lengkap *</label>
                <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white" placeholder="Sesuai KTP / Nama Penerima" />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Email *</label>
                <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white" placeholder="Untuk resi dan konfirmasi" />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Alamat Lengkap *</label>
                <textarea id="address" name="address" rows={4} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none text-black bg-white" placeholder="Jalan, RT/RW, Patokan Rumah, Kelurahan, Kecamatan, Kota, Kode Pos..."></textarea>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-lg border-b border-gray-100 pb-4 mb-4 uppercase tracking-widest text-black">Metode Pembayaran</h2>
              <div className="flex items-center gap-3 p-4 border-2 border-black rounded-lg bg-gray-50">
                <div className="w-5 h-5 rounded-full border-4 border-black bg-white flex-shrink-0"></div>
                <div>
                  <label htmlFor="cod" className="font-bold text-sm text-black">Manual Transfer / Cash on Delivery</label>
                  <p className="text-xs text-gray-500 mt-1">Tim layanan pelanggan kami akan segera menghubungi Anda via Email/WhatsApp untuk instruksi pembayaran lebih lanjut setelah pesanan dibuat.</p>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white px-6 py-5 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4"
            >
              {isPending ? "MEMPROSES PESANAN..." : "SELESAIKAN PESANAN SEKARANG"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Dengan menyelesaikan pesanan, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi JACZEE.
            </p>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="font-bold text-lg border-b border-gray-100 pb-4 mb-6 uppercase tracking-widest text-black">Ringkasan Pesanan</h2>
            
            <div className="space-y-6 mb-6 max-h-[50vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-stone-100 flex-shrink-0 border border-gray-100">
                    <Image src={item.imageUrl} alt={item.name || "Produk JACZEE"} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-black uppercase tracking-wider leading-tight">{item.name || "Koleksi Eksklusif JACZEE"}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium tracking-widest">Ukuran: {item.size}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                      <span className="text-sm font-bold text-black">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4 text-sm">
              <div className="flex justify-between text-black">
                <span className="text-gray-500 uppercase tracking-wider text-xs font-semibold">Subtotal</span>
                <span className="font-semibold">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-black">
                <span className="text-gray-500 uppercase tracking-wider text-xs font-semibold">Pengiriman</span>
                <span className="text-green-600 font-bold uppercase tracking-wider text-xs">Gratis</span>
              </div>
              <div className="flex justify-between items-center font-bold text-xl pt-6 border-t border-gray-200 text-black">
                <span className="uppercase tracking-widest text-sm">Total Akhir</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
