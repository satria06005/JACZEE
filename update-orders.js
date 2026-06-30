const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.updateMany({
    data: {
      status: 'PAID'
    }
  });
  console.log("Semua pesanan berhasil diperbarui menjadi PAID");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
