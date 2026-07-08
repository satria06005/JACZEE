"use client";

import { useState } from "react";
import FadeIn from "@/components/animations/FadeIn";
import { trackOrder } from "@/actions/track";
import { useToastStore } from "@/store/useToastStore";
import { Search, Calendar, CreditCard, ShoppingBag, ArrowRight, Clock, Mail, Phone } from "lucide-react";
import Image from "next/image";

type OrderData = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  email: string;
  phone: string;
  items: Array<{
    name: string;
    imageUrl: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
  }>;
};

export default function TrackOrderPage() {
  const [isPending, setIsPending] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const { addToast } = useToastStore();

  const maskPhone = (phone: string) => {
    if (!phone) return "-";
    if (phone.length < 8) return phone;
    const start = phone.substring(0, 4);
    const end = phone.substring(phone.length - 4);
    return `${start}-XXXX-${end}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await trackOrder(formData);
    
    setIsPending(false);
    
    if (result.success && result.order) {
      setOrder(result.order);
      addToast("Pesanan berhasil ditemukan.", "success");
    } else {
      setOrder(null);
      addToast(result.error || "Pesanan tidak ditemukan.", "error");
    }
  };

  const resetForm = () => setOrder(null);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-32 px-6">
      <div className="w-full max-w-3xl mx-auto">
        
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-6 text-black">
              Lacak Pesanan
            </h1>
            <div className="w-12 h-[1px] bg-black mx-auto mb-6" />
            <p className="text-gray-500 text-xs md:text-sm tracking-widest uppercase">
              Pantau status pengiriman pesanan eksklusif Anda
            </p>
          </div>

          {!order ? (
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-3 group">
                  <label htmlFor="orderId" className="block text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-black">
                    Nomor Pesanan
                  </label>
                  <input 
                    type="text" 
                    id="orderId"
                    name="orderId"
                    required
                    placeholder="Contoh: ORD-20260627-1234"
                    className="w-full border-b border-gray-300 py-4 outline-none focus:border-black transition-colors text-sm tracking-widest bg-transparent text-black placeholder:text-gray-300"
                  />
                </div>

                <div className="space-y-3 group">
                  <label htmlFor="email" className="block text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-black">
                    Email Pesanan
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    placeholder="Alamat email saat Anda checkout"
                    className="w-full border-b border-gray-300 py-4 outline-none focus:border-black transition-colors text-sm tracking-widest bg-transparent text-black placeholder:text-gray-300"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center items-center gap-4 bg-black text-white uppercase tracking-[0.2em] text-xs font-bold py-6 hover:bg-stone-800 transition-colors disabled:opacity-70 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Search className="w-4 h-4" />
                      {isPending ? "MENCARI..." : "TEMUKAN PESANAN"}
                    </span>
                    {!isPending && <div className="absolute inset-0 h-full w-full bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <FadeIn direction="up" className="bg-stone-50 border border-gray-200">
              {/* Receipt Header */}
              <div className="bg-black text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-[0.2em]">Nomor Pesanan</p>
                  <p className="text-xl md:text-2xl font-mono tracking-widest font-light">{order.id}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-[0.2em]">Status</p>
                  <div className="inline-flex items-center justify-center bg-white text-black text-xs font-bold px-4 py-2 uppercase tracking-[0.2em]">
                    {order.status === 'PENDING' ? 'Menunggu Proses' : order.status === 'PAID' ? 'Dibayar' : order.status === 'SHIPPED' ? 'Dikirim' : order.status}
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-gray-200">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Tanggal Pesanan
                    </p>
                    <p className="text-sm font-medium text-black tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> Waktu
                    </p>
                    <p className="text-sm font-medium text-black tracking-widest">
                      {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email Pembeli
                    </p>
                    <p className="text-sm font-medium text-black tracking-widest truncate" title={order.email}>
                      {order.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> No. Telepon
                    </p>
                    <p className="text-sm font-medium text-black tracking-widest">
                      {maskPhone(order.phone)}
                    </p>
                  </div>
                </div>

                <div className="mb-12 border-b border-gray-200 pb-12">
                  <h3 className="text-xs font-bold text-black uppercase tracking-[0.2em] mb-8">Rincian Pembelian</h3>
                  
                  <div className="space-y-8 mb-12">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="relative w-24 h-32 bg-gray-100 shrink-0">
                          <Image 
                            src={item.imageUrl} 
                            alt={item.name}
                            fill
                            className="object-cover mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="text-sm md:text-base font-semibold text-black tracking-widest mb-1">{item.name}</p>
                          <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mb-3">Kuantitas: {item.quantity}</p>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-medium text-black tracking-wider">Rp {item.price.toLocaleString('id-ID')}</p>
                            {item.discountPercent ? (
                              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 font-bold tracking-widest rounded-sm border border-red-200">
                                -{item.discountPercent}%
                              </span>
                            ) : null}
                          </div>
                          {item.discountPercent ? (
                            <p className="text-[10px] text-gray-400 line-through mt-1">Rp {item.originalPrice?.toLocaleString('id-ID')}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end items-start sm:items-end gap-6 pt-8 border-t border-gray-100">
                    {(() => {
                      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                      const shippingFee = order.totalAmount - subtotal;
                      
                      return (
                        <div className="w-full sm:w-auto flex flex-col gap-3 sm:min-w-[300px]">
                          <div className="flex justify-between items-center text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                            <span>Subtotal Produk</span>
                            <span className="text-black tracking-widest">Rp {subtotal.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                            <span>Ongkos Kirim</span>
                            <span className="text-black tracking-widest">
                              {shippingFee > 0 ? `Rp ${shippingFee.toLocaleString('id-ID')}` : 'Gratis'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                            <span className="text-xs font-bold text-black uppercase tracking-[0.2em] flex items-center gap-2">
                              <CreditCard className="w-3 h-3" /> Total Belanja
                            </span>
                            <span className="text-lg font-bold text-black tracking-widest">
                              Rp {order.totalAmount.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-12 border-t border-gray-200">
                  <button 
                    onClick={resetForm}
                    className="w-full flex-1 inline-flex items-center justify-center gap-3 bg-white text-black border border-black uppercase tracking-[0.2em] text-[10px] font-bold py-5 hover:bg-stone-50 transition-colors"
                  >
                    Lacak Pesanan Lain
                  </button>
                  <a 
                    href="/shop"
                    className="w-full flex-1 inline-flex items-center justify-center gap-3 bg-black text-white uppercase tracking-[0.2em] text-[10px] font-bold py-5 hover:bg-stone-800 transition-colors group"
                  >
                    Lanjut Belanja
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </FadeIn>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
