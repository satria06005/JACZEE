import FadeIn from "@/components/animations/FadeIn";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn direction="up">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-16 text-center border-b border-gray-100 pb-12">
            Syarat & Ketentuan
          </h1>
          
          <div className="space-y-8 text-sm text-gray-600 leading-relaxed text-justify">
            <p>
              Pembaruan Terakhir: Juni 2026
            </p>
            <p>
              Selamat datang di JACZEE. Dengan mengakses dan menggunakan situs web ini, Anda menyetujui untuk terikat dengan Syarat & Ketentuan yang berlaku. Jika Anda tidak menyetujui sebagian atau seluruh syarat ini, mohon untuk tidak menggunakan layanan kami.
            </p>
            
            <h2 className="text-xs tracking-widest uppercase font-semibold text-black mt-8 mb-4">1. Penggunaan Situs</h2>
            <p>
              Situs ini disediakan untuk penggunaan pribadi dan non-komersial Anda. Anda setuju untuk tidak menggunakan situs ini untuk tujuan ilegal atau melanggar hak cipta dan kekayaan intelektual kami.
            </p>

            <h2 className="text-xs tracking-widest uppercase font-semibold text-black mt-8 mb-4">2. Informasi Produk dan Harga</h2>
            <p>
              Kami selalu berusaha untuk menampilkan warna dan detail produk seakurat mungkin. Namun, karena perbedaan resolusi layar, kami tidak menjamin bahwa warna yang Anda lihat 100% sesuai dengan produk asli. JACZEE berhak untuk mengubah harga tanpa pemberitahuan sebelumnya.
            </p>

            <h2 className="text-xs tracking-widest uppercase font-semibold text-black mt-8 mb-4">3. Ketersediaan Stok</h2>
            <p>
              Semua pesanan bergantung pada ketersediaan stok produk. Dalam keadaan di mana produk tidak tersedia setelah Anda melakukan pembayaran, kami akan membatalkan pesanan tersebut dan mengembalikan dana Anda sepenuhnya.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
