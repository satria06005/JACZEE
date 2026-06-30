import BannerForm from "../BannerForm";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tambah Banner</h1>
        <p className="text-gray-500 mt-1 text-sm">Tambahkan banner baru untuk ditampilkan di halaman utama.</p>
      </div>
      
      <BannerForm />
    </div>
  );
}
