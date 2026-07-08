import FadeIn from "@/components/animations/FadeIn";

export default function ClientServicesPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn direction="up">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-16 text-center border-b border-gray-100 pb-12">
            Layanan Pelanggan
          </h1>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-sm tracking-widest uppercase font-semibold mb-4">Pengiriman</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Kami menawarkan pengiriman ke seluruh Indonesia menggunakan layanan kurir tepercaya. Estimasi waktu pengiriman standar adalah 2-5 hari kerja untuk wilayah Jabodetabek, dan 3-7 hari kerja untuk di luar Jabodetabek. Gratis ongkos kirim berlaku untuk semua pesanan di atas Rp 500.000.
              </p>
            </section>

            <section>
              <h2 className="text-sm tracking-widest uppercase font-semibold mb-4">Pengembalian & Penukaran</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                JACZEE menerima pengembalian atau penukaran barang dalam jangka waktu 14 hari sejak barang diterima. Produk harus berada dalam kondisi asli, belum dicuci, belum dipakai, dan dengan seluruh label masih terpasang. Barang yang didiskon (sale) merupakan penjualan final dan tidak dapat ditukar atau dikembalikan.
              </p>
            </section>

            <section>
              <h2 className="text-sm tracking-widest uppercase font-semibold mb-4">Perawatan Produk</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Kami sangat memperhatikan kualitas dari setiap helai pakaian kami. Untuk menjaga keawetan dan bentuk pakaian, selalu ikuti instruksi perawatan yang tertera pada label di bagian dalam pakaian. Gunakan deterjen lembut dan hindari pemutih berbahan keras.
              </p>
            </section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
