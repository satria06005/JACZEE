"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Eye, EyeOff } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

type RegisterFormProps = {
  bannerImageUrl: string;
  bannerTitle: string;
};

export default function RegisterForm({ bannerImageUrl, bannerTitle }: RegisterFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);
    
    setIsPending(false);
    
    if (result.success) {
      addToast("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.", "success");
      router.push("/account");
    } else {
      addToast(result.error || "Gagal mendaftar.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Section */}
          <div className="relative w-full h-[600px] lg:h-[800px] bg-stone-100 hidden md:block overflow-hidden group">
            <Image 
              src={bannerImageUrl}
              alt={bannerTitle}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />
            <div className="absolute bottom-10 left-10 text-white">
              <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-2">{bannerTitle}</h2>
              <p className="text-sm tracking-widest text-stone-200">Daftar sekarang untuk pengalaman berbelanja eksklusif.</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex flex-col justify-center px-4 md:px-10 lg:px-0">
            <div className="mb-12">
              <Link href="/" className="inline-flex items-center text-xs tracking-widest text-gray-500 hover:text-black uppercase mb-8 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Kembali ke Beranda
              </Link>
              <h1 className="text-4xl font-bold tracking-[0.2em] uppercase mb-4">Buat Akun</h1>
              <p className="text-gray-500 text-sm tracking-widest uppercase">
                Lengkapi data di bawah ini untuk menjadi anggota.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2 group">
                <label htmlFor="name" className="block text-xs font-bold tracking-widest uppercase text-gray-800">
                  Nama Lengkap
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors text-sm tracking-wide bg-transparent"
                />
              </div>

              <div className="space-y-2 group">
                <label htmlFor="email" className="block text-xs font-bold tracking-widest uppercase text-gray-800">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  required
                  placeholder="Masukkan alamat email Anda"
                  className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors text-sm tracking-wide bg-transparent"
                />
              </div>

              <div className="space-y-2 group">
                <label htmlFor="password" className="block text-xs font-bold tracking-widest uppercase text-gray-800">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    name="password"
                    required
                    placeholder="Buat kata sandi Anda"
                    className="w-full border-b-2 border-gray-200 py-3 pr-10 outline-none focus:border-black transition-colors text-sm tracking-wide bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-black text-white uppercase tracking-widest text-sm font-bold py-4 hover:bg-stone-800 transition-colors mt-8 relative overflow-hidden group disabled:opacity-70"
              >
                <span className="relative z-10">{isPending ? "MENDAFTAR..." : "DAFTAR SEKARANG"}</span>
                {!isPending && <div className="absolute inset-0 h-full w-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-xs tracking-widest text-gray-500 mb-4 uppercase">Sudah memiliki akun?</p>
              <Link 
                href="/account"
                className="flex items-center justify-center w-full bg-white text-black border-2 border-black uppercase tracking-widest text-sm font-bold py-4 hover:bg-black hover:text-white transition-colors"
              >
                Masuk Di Sini
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
