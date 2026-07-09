import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// @ts-ignore
const midtransClient = require('midtrans-client');

const apiClient = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(req: Request) {
  try {
    const notificationJson = await req.json();

    const statusResponse = await apiClient.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    let newStatus = 'PENDING';

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        newStatus = 'PENDING'; // Or 'CHALLENGE' if you have that status
      } else if (fraudStatus == 'accept') {
        newStatus = 'PAID';
      }
    } else if (transactionStatus == 'settlement') {
      newStatus = 'PAID';
    } else if (
      transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire'
    ) {
      newStatus = 'CANCELLED';
    } else if (transactionStatus == 'pending') {
      newStatus = 'PENDING';
    }

    // Update order status
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: newStatus as any,
          paymentMethod: paymentType ? paymentType.toUpperCase() : 'MIDTRANS',
        },
      });
      console.log(`Order ${orderId} updated to ${newStatus}`);
    }

    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Error handling Midtrans webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
