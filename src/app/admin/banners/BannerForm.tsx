"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBanner, updateBanner } from "./actions";
import { useToastStore } from "@/store/useToastStore";
import { Sparkles, Image as ImageIcon, Layout, Type } from "lucide-react";

type BannerData = {
  id?: string;
  location: string;
  title?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  linkText?: string | null;
  isActive: boolean;
};

const LOCATION_EXAMPLES = {
  hero: { src: "https://picsum.photos/seed/jaczee-hero/1920/1080", desc: "Banner utama di bagian paling atas halaman Home. Rekomendasi ukuran: Landscape (16:9) atau 1920x1080px." },
  collection_mens: { src: "https://picsum.photos/seed/jaczee-mens/800/1000", desc: "Banner kategori koleksi pria di halaman Home. Rekomendasi ukuran: Portrait (4:5) atau 800x1000px." },
  collection_womens: { src: "https://picsum.photos/seed/jaczee-womens/800/1000", desc: "Banner kategori koleksi wanita di halaman Home. Rekomendasi ukuran: Portrait (4:5) atau 800x1000px." },
  feature: { src: "https://picsum.photos/seed/jaczee-feature/1920/800", desc: "Banner memanjang di bagian tengah/bawah halaman Home. Rekomendasi ukuran: Landscape lebar atau 1920x800px." },
  mens_hero: { src: "https://picsum.photos/seed/mens-banner/1600/600", desc: "Banner utama untuk halaman khusus Pria (/mens). Rekomendasi ukuran: Landscape lebar atau 1600x600px." },
  mens_hero_atasan: { src: "https://picsum.photos/seed/mens-banner/1600/600", desc: "Banner untuk sub-kategori Atasan Pria. Rekomendasi ukuran: 1600x600px." },
  mens_hero_bawahan: { src: "https://picsum.photos/seed/mens-banner/1600/600", desc: "Banner untuk sub-kategori Bawahan Pria. Rekomendasi ukuran: 1600x600px." },
  mens_hero_sepatu: { src: "https://picsum.photos/seed/mens-banner/1600/600", desc: "Banner untuk sub-kategori Sepatu Pria. Rekomendasi ukuran: 1600x600px." },
  mens_hero_aksesoris: { src: "https://picsum.photos/seed/mens-banner/1600/600", desc: "Banner untuk sub-kategori Aksesoris Pria. Rekomendasi ukuran: 1600x600px." },
  womens_hero: { src: "https://picsum.photos/seed/womens-banner/1600/600", desc: "Banner utama untuk halaman khusus Wanita (/womens). Rekomendasi ukuran: Landscape lebar atau 1600x600px." },
  womens_hero_atasan: { src: "https://picsum.photos/seed/womens-banner/1600/600", desc: "Banner untuk sub-kategori Atasan Wanita. Rekomendasi ukuran: 1600x600px." },
  womens_hero_bawahan: { src: "https://picsum.photos/seed/womens-banner/1600/600", desc: "Banner untuk sub-kategori Bawahan Wanita. Rekomendasi ukuran: 1600x600px." },
  womens_hero_sepatu: { src: "https://picsum.photos/seed/womens-banner/1600/600", desc: "Banner untuk sub-kategori Sepatu Wanita. Rekomendasi ukuran: 1600x600px." },
  womens_hero_aksesoris: { src: "https://picsum.photos/seed/womens-banner/1600/600", desc: "Banner untuk sub-kategori Aksesoris Wanita. Rekomendasi ukuran: 1600x600px." },
  kids_hero: { src: "https://picsum.photos/seed/kids-banner/1600/600", desc: "Banner utama untuk halaman khusus Anak (/kids). Rekomendasi ukuran: Landscape lebar atau 1600x600px." },
  kids_hero_atasan: { src: "https://picsum.photos/seed/kids-banner/1600/600", desc: "Banner untuk sub-kategori Atasan Anak. Rekomendasi ukuran: 1600x600px." },
  kids_hero_bawahan: { src: "https://picsum.photos/seed/kids-banner/1600/600", desc: "Banner untuk sub-kategori Bawahan Anak. Rekomendasi ukuran: 1600x600px." },
  kids_hero_sepatu: { src: "https://picsum.photos/seed/kids-banner/1600/600", desc: "Banner untuk sub-kategori Sepatu Anak. Rekomendasi ukuran: 1600x600px." },
  kids_hero_aksesoris: { src: "https://picsum.photos/seed/kids-banner/1600/600", desc: "Banner untuk sub-kategori Aksesoris Anak. Rekomendasi ukuran: 1600x600px." },
  shop_hero: { src: "https://picsum.photos/seed/jaczee-shop-all/1600/800", desc: "Banner utama halaman Seluruh Koleksi Produk (/shop). Rekomendasi ukuran: Landscape lebar atau 1600x800px." },
  about_hero: { src: "https://picsum.photos/seed/jaczee-about/1920/1080", desc: "Banner paling atas pada halaman Tentang Kami (/about). Rekomendasi ukuran: Landscape (16:9) atau 1920x1080px." },
  about_philosophy: { src: "https://picsum.photos/seed/jaczee-philosophy/800/1000", desc: "Gambar untuk bagian Filosofi di halaman Tentang Kami. Rekomendasi ukuran: Portrait (4:5) atau 800x1000px." },
  about_craft: { src: "https://picsum.photos/seed/jaczee-craft/800/1000", desc: "Gambar untuk bagian Keahlian di halaman Tentang Kami. Rekomendasi ukuran: Portrait (4:5) atau 800x1000px." },
  account_login: { src: "https://picsum.photos/seed/account-fashion/800/1000", desc: "Gambar untuk halaman Masuk / Login (/account). Rekomendasi ukuran: Portrait (4:5) atau 800x1000px." },
  account_register: { src: "https://picsum.photos/seed/account-register/800/1000", desc: "Gambar untuk halaman Daftar Akun (/account/register). Rekomendasi ukuran: Portrait (4:5) atau 800x1000px." },
  account_forgot: { src: "https://picsum.photos/seed/account-forgot/800/1000", desc: "Gambar untuk halaman Lupa Sandi (/account/forgot-password). Rekomendasi ukuran: Portrait (4:5) atau 800x1000px." },
};

export default function BannerForm({ initialData }: { initialData?: BannerData }) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  
  const [formData, setFormData] = useState({
    location: initialData?.location || "hero",
    title: initialData?.title || "",
    imageUrl: initialData?.imageUrl || "",
    linkUrl: initialData?.linkUrl || "",
    linkText: initialData?.linkText || "",
    isActive: initialData !== undefined ? initialData.isActive : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let currentImageUrl = formData.imageUrl;
      
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        
        if (!uploadRes.ok) {
          throw new Error("Gagal mengunggah gambar");
        }
        
        const { url } = await uploadRes.json();
        currentImageUrl = url;
      }

      const finalData = { ...formData, imageUrl: currentImageUrl };

      let res;
      if (initialData?.id) {
        res = await updateBanner(initialData.id, finalData);
      } else {
        res = await createBanner(finalData);
      }

      if (res.success) {
        showToast(initialData?.id ? "Banner berhasil diperbarui" : "Banner berhasil ditambahkan", "success");
        router.push("/admin/banners");
        router.refresh();
      } else {
        showToast(res.error || "Terjadi kesalahan", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan saat menyimpan data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start max-w-7xl">
      <div className="xl:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Banner</label>
        <select 
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-black focus:ring-black focus:border-black"
          required
        >
          <optgroup label="Halaman Utama (Home)">
            <option value="hero">Hero (Utama Atas)</option>
            <option value="collection_mens">Collection Nine - Mens</option>
            <option value="collection_womens">Collection Nine - Womens</option>
            <option value="feature">Product Feature (Bawah)</option>
          </optgroup>
          <optgroup label="Halaman Pria (/mens)">
            <option value="mens_hero">Pria - Hero (Utama)</option>
            <option value="mens_hero_atasan">Pria - Atasan</option>
            <option value="mens_hero_bawahan">Pria - Bawahan</option>
            <option value="mens_hero_sepatu">Pria - Sepatu</option>
            <option value="mens_hero_aksesoris">Pria - Aksesoris</option>
          </optgroup>
          <optgroup label="Halaman Wanita (/womens)">
            <option value="womens_hero">Wanita - Hero (Utama)</option>
            <option value="womens_hero_atasan">Wanita - Atasan</option>
            <option value="womens_hero_bawahan">Wanita - Bawahan</option>
            <option value="womens_hero_sepatu">Wanita - Sepatu</option>
            <option value="womens_hero_aksesoris">Wanita - Aksesoris</option>
          </optgroup>
          <optgroup label="Halaman Anak (/kids)">
            <option value="kids_hero">Anak - Hero (Utama)</option>
            <option value="kids_hero_atasan">Anak - Atasan</option>
            <option value="kids_hero_bawahan">Anak - Bawahan</option>
            <option value="kids_hero_sepatu">Anak - Sepatu</option>
            <option value="kids_hero_aksesoris">Anak - Aksesoris</option>
          </optgroup>
          <optgroup label="Halaman Semua Produk (/shop)">
            <option value="shop_hero">Shop (Semua Produk) - Hero</option>
          </optgroup>
          <optgroup label="Halaman Tentang Kami">
            <option value="about_hero">Tentang Kami - Hero</option>
            <option value="about_philosophy">Tentang Kami - Filosofi</option>
            <option value="about_craft">Tentang Kami - Keahlian</option>
          </optgroup>
          <optgroup label="Halaman Akun">
            <option value="account_login">Akun - Masuk (Login)</option>
            <option value="account_register">Akun - Daftar (Register)</option>
            <option value="account_forgot">Akun - Lupa Sandi</option>
          </optgroup>
        </select>

        {/* Panduan Gambar */}
        {LOCATION_EXAMPLES[formData.location as keyof typeof LOCATION_EXAMPLES] && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="w-full sm:w-32 h-20 relative rounded-md overflow-hidden bg-gray-200 shrink-0 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={LOCATION_EXAMPLES[formData.location as keyof typeof LOCATION_EXAMPLES].src} 
                alt="Contoh Lokasi" 
                className="object-cover w-full h-full opacity-80 mix-blend-multiply"
              />
              <div className="absolute inset-0 border border-black/10 rounded-md"></div>
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Panduan Tata Letak
              </span>
              <p className="leading-relaxed">
                {LOCATION_EXAMPLES[formData.location as keyof typeof LOCATION_EXAMPLES].desc}
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Gambar</label>
        <div className="flex flex-col gap-4">
          <input 
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-black focus:ring-black focus:border-black"
            required={!initialData?.imageUrl}
          />
          {previewUrl && (
            <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border border-gray-200 bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Banner (Opsional)</label>
        <input 
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Teks yang muncul di banner"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-black focus:ring-black focus:border-black"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Tautan (Opsional)</label>
          <input 
            type="text"
            name="linkUrl"
            value={formData.linkUrl}
            onChange={handleChange}
            placeholder="/shop"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-black focus:ring-black focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teks Tautan (Opsional)</label>
          <input 
            type="text"
            name="linkText"
            value={formData.linkText}
            onChange={handleChange}
            placeholder="Shop Now"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-black focus:ring-black focus:border-black"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input 
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Aktifkan Banner
        </label>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-black bg-white hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-5 py-2 bg-black text-white rounded-lg text-sm font-medium transition-colors ${isLoading ? 'opacity-70' : 'hover:bg-gray-800'}`}
        >
          {isLoading ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Tambah Banner")}
        </button>
      </div>
    </form>
    </div>

    {/* Right Panel - Tips Desain (Visible on large screens) */}
    <div className="xl:col-span-1 sticky top-6 hidden xl:block">
      <div className="bg-white text-black p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold tracking-widest uppercase mb-8 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-black" />
          Tips Desain Banner
        </h3>
        
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-xs tracking-wider uppercase">Resolusi Gambar</h4>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-light">
              Gunakan gambar dengan resolusi tinggi (minimal sesuai rekomendasi ukuran di panduan) agar banner tetap terlihat tajam, elegan, dan tidak pecah di layar beresolusi tinggi (High-DPI).
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Layout className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-xs tracking-wider uppercase">Fokus Komposisi</h4>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-light">
              Pastikan subjek atau model utama gambar berada di area tengah (center-aligned). Hal ini sangat krusial agar gambar tidak terpotong (crop) secara aneh saat pengunjung membuka website dari Handphone.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <Type className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-xs tracking-wider uppercase">Keterbacaan Teks</h4>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-light">
              Jika banner Anda nantinya akan ditimpa teks atau tombol di atasnya, pilihlah gambar yang memiliki latar belakang sedikit redup, polos, atau memiliki *negative space* yang cukup agar teks lebih mudah dibaca.
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
  );
}
