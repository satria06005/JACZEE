import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // SEMENTARA: Stripe dinonaktifkan, kembalikan response sukses dummy
  return NextResponse.json({ received: true });
}
