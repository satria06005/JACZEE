"use client";

import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";
import { processCheckout } from "@/actions/checkout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTransition, useState, useEffect } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const showToast = useToastStore((state) => state.addToast);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [provinces, setProvinces] = useState<{id: string, name: string}[]>([]);
  const [cities, setCities] = useState<{id: string, name: string}[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  const [courier, setCourier] = useState("");
  const [shippingCosts, setShippingCosts] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [isLoadingOngkir, setIsLoadingOngkir] = useState(false);

  // 1. Fetch Provinces (RajaOngkir)
  useEffect(() => {
    fetch("/api/rajaongkir?type=province")
      .then(res => res.json())
      .then(data => {
        if (data.rajaongkir?.results) {
          setProvinces(data.rajaongkir.results.map((p: any) => ({
            id: p.province_id,
            name: p.province
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);

  // 2. Fetch Cities (RajaOngkir)
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setSelectedCity("");
      return;
    }
    fetch(`/api/rajaongkir?type=city&province=${selectedProvince}`)
      .then(res => res.json())
      .then(data => {
        if (data.rajaongkir?.results) {
          setCities(data.rajaongkir.results.map((c: any) => ({
            id: c.city_id,
            name: `${c.type} ${c.city_name}`
          })));
        }
      })
      .catch(err => console.error(err));
  }, [selectedProvince]);

  // 3. Fetch Shipping Cost
  useEffect(() => {
    if (!selectedCity || !courier) {
      setShippingCosts([]);
      setSelectedService("");
      setShippingFee(0);
      return;
    }

    const totalWeight = items.reduce((sum, item) => sum + (item.quantity * 500), 0); // Asumsi berat baju 500 gram
    
    setIsLoadingOngkir(true);
    fetch("/api/rajaongkir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination: selectedCity,
        weight: totalWeight || 1000,
        courier: courier
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.rajaongkir?.results?.[0]?.costs) {
        setShippingCosts(data.rajaongkir.results[0].costs);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setIsLoadingOngkir(false));
  }, [selectedCity, courier, items]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 4. Sync Shipping Fee based on selected service and subtotal
  useEffect(() => {
    if (selectedService && shippingCosts.length > 0) {
      const selected = shippingCosts.find(c => c.service === selectedService);
      if (selected) {
        setShippingFee(subtotal >= 800000 ? 0 : selected.cost[0].value);
      }
    }
  }, [subtotal, selectedService, shippingCosts]);

  const totalAmount = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService) {
       showToast("Pilih layanan pengiriman terlebih dahulu.", "error");
       return;
    }
    const formData = new FormData(e.currentTarget);
    formData.append("items", JSON.stringify(items));
    formData.append("totalAmount", totalAmount.toString());

    startTransition(async () => {
      try {
        const result = await processCheckout(formData);
        if (result.success && result.url) {
          clearCart();
          window.location.href = result.url;
        }
      } catch (error) {
        showToast("Gagal memproses pesanan. Silakan coba lagi.", "error");
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
            Harap lengkapi informasi pengiriman Anda di bawah ini dengan detail dan akurat.
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
                <label htmlFor="phone" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Nomor Telepon *</label>
                <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white" placeholder="Contoh: 081234567890" />
              </div>

              <div className="space-y-2">
                <label htmlFor="province" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Provinsi *</label>
                <select id="province" name="province" required value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white appearance-none cursor-pointer">
                  <option value="">Pilih Provinsi...</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input type="hidden" name="provinceName" value={provinces.find(p => p.id === selectedProvince)?.name || ""} />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Kota/Kabupaten *</label>
                <select id="city" name="city" required value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedProvince} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed">
                  <option value="">Pilih Kota/Kabupaten...</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input type="hidden" name="cityName" value={cities.find(c => c.id === selectedCity)?.name || ""} />
              </div>

              <div className="space-y-2">
                <label htmlFor="districtName" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Kecamatan *</label>
                <input type="text" id="districtName" name="districtName" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white" placeholder="Ketik nama Kecamatan..." />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Alamat Lengkap *</label>
                <textarea id="address" name="address" rows={4} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black resize-none text-black bg-white" placeholder="Jalan, RT/RW, Patokan Rumah, Kelurahan, Kode Pos..."></textarea>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="font-bold text-lg border-b border-gray-100 pb-4 uppercase tracking-widest text-black">Opsi Pengiriman</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="courier" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Pilih Kurir *</label>
                  <select id="courier" name="courier" required value={courier} onChange={(e) => setCourier(e.target.value)} disabled={!selectedCity} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="">Pilih Kurir...</option>
                    <option value="jne">JNE</option>
                    <option value="pos">POS Indonesia</option>
                    <option value="tiki">TIKI</option>
                  </select>
                </div>

                {isLoadingOngkir ? (
                  <p className="text-sm text-gray-500 animate-pulse">Menghitung ongkos kirim...</p>
                ) : shippingCosts.length > 0 ? (
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Layanan *</label>
                    <select id="service" name="service" required value={selectedService} 
                      onChange={(e) => {
                        setSelectedService(e.target.value);
                        const selected = shippingCosts.find(c => c.service === e.target.value);
                        if (selected) {
                          setShippingFee(subtotal >= 800000 ? 0 : selected.cost[0].value);
                        }
                      }} 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Pilih Layanan...</option>
                      {shippingCosts.map((c, i) => {
                        const isFreeShipping = subtotal >= 800000;
                        const costText = isFreeShipping ? "Rp 0 (GRATIS)" : `Rp ${c.cost[0].value.toLocaleString('id-ID')}`;
                        return (
                          <option key={i} value={c.service}>
                            {c.service} ({c.description}) - {costText} ({c.cost[0].etd} Hari)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : courier && (
                  <p className="text-sm text-red-500">Ongkos kirim tidak tersedia untuk tujuan ini.</p>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending || !selectedService}
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
                <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-black">
                <span className="text-gray-500 uppercase tracking-wider text-xs font-semibold">Pengiriman</span>
                <span className="font-semibold">
                  {shippingFee > 0 ? `Rp ${shippingFee.toLocaleString('id-ID')}` : '-'}
                </span>
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
