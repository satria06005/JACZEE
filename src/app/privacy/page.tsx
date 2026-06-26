import FadeIn from "@/components/animations/FadeIn";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn direction="up">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-16 text-center border-b border-gray-100 pb-12">
            Kebijakan Privasi
          </h1>
          
          <div className="space-y-8 text-sm text-gray-600 leading-relaxed text-justify">
            <p>
              Pembaruan Terakhir: Juni 2026
            </p>
            <p>
              JACZEE sangat menghargai privasi dan keamanan data Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi yang Anda berikan saat menggunakan situs web kami.
            </p>
            
            <h2 className="text-xs tracking-widest uppercase font-semibold text-black mt-8 mb-4">Pengumpulan Data</h2>
            <p>
              Kami mengumpulkan informasi identitas diri seperti nama, alamat email, nomor telepon, dan alamat pengiriman saat Anda mendaftar akun, berlangganan newsletter, atau melakukan transaksi pembelian. Kami juga mengumpulkan data analitik secara anonim melalui penggunaan *cookies*.
            </p>

            <h2 className="text-xs tracking-widest uppercase font-semibold text-black mt-8 mb-4">Penggunaan Data</h2>
            <p>
              Data yang dikumpulkan digunakan semata-mata untuk memproses pesanan Anda, mengirimkan pembaruan terkait status pengiriman, memberikan penawaran khusus, serta meningkatkan kualitas pengalaman berbelanja Anda di JACZEE.
            </p>

            <h2 className="text-xs tracking-widest uppercase font-semibold text-black mt-8 mb-4">Keamanan</h2>
            <p>
              Informasi pembayaran Anda dienkripsi melalui teknologi keamanan terkini. Kami tidak pernah menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga mana pun tanpa persetujuan eksplisit dari Anda.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
