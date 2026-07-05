import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "./PrintButton";
import StatusSelector from "./StatusSelector";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: { product: true }
      }
    }
  });

  if (!order) {
    notFound();
  }

  // Parse phone from name
  let name = order.user.name;
  let phone = "-";
  if (name.includes("| PHONE:")) {
    const parts = name.split("| PHONE:");
    name = parts[0].trim();
    phone = parts[1].trim();
  }

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-lg mx-auto print:hidden mb-8 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <Link href="/admin/orders" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <div className="flex items-center gap-4">
          <StatusSelector orderId={order.id} currentStatus={order.status} />
          <PrintButton />
        </div>
      </div>

      {/* Thermal Receipt Container */}
      <div className="w-full max-w-[300px] mx-auto bg-white text-black font-sans text-sm print:m-0 print:shadow-none shadow-xl border border-gray-200">
        <div className="p-4 flex flex-col gap-4">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black tracking-widest uppercase">JACZEE</h1>
            <p className="text-[11px] font-medium leading-tight">
              Jl. Merdeka No. 123, Kota Bandung
            </p>
            <p className="text-[10px] font-bold">
              IG: @jaczee.id | WA: 0812-3456-7890
            </p>
          </div>

          {/* Dashed Divider */}
          <div className="w-full border-t-2 border-dashed border-black my-1"></div>

          {/* Transaction Meta */}
          <div className="text-[11px] space-y-1 font-semibold leading-tight">
            <div className="flex justify-between">
              <span>ID Pesanan:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })} WIB
              </span>
            </div>
            <div className="pt-1">
              <span>Pelanggan:</span>
              <div className="truncate uppercase">{name}</div>
              <div className="truncate">{order.user.email}</div>
              <div>{phone}</div>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="w-full border-t-2 border-dashed border-black my-1"></div>

          {/* Item Details (Stacked Layout) */}
          <div className="space-y-3">
            {order.orderItems.map((item: any) => (
              <div key={item.id} className="text-[11px] font-bold leading-tight">
                <div className="mb-0.5">{item.product.name}</div>
                <div className="flex justify-between">
                  <span>{item.quantity} x {item.priceAtPurchase.toLocaleString('id-ID')}</span>
                  <span>{(item.quantity * item.priceAtPurchase).toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dashed Divider */}
          <div className="w-full border-t-2 border-dashed border-black my-1"></div>

          {/* Payment Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-black text-[13px]">
              <span>TOTAL BELANJA</span>
              <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold">
              <span>Metode Bayar:</span>
              <span>{(order as any).paymentMethod || 'STRIPE CHECKOUT'}</span>
            </div>
            
            <div className="flex justify-between items-center text-[11px] font-bold pt-1">
              <span>Status:</span>
              <span className="bg-black text-white px-2 py-0.5 tracking-wider uppercase">
                {order.status === 'PAID' ? 'LUNAS' : order.status}
              </span>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="w-full border-t-2 border-dashed border-black my-1 mt-2"></div>

          {/* Footer */}
          <div className="text-center text-[10px] font-bold space-y-1 py-2">
            <p className="uppercase text-[11px]">Terima kasih atas kunjungan Anda!</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar.</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
