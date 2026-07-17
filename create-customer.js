const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const email = "customer@jaczee.com";
  const password = "customer"; // Kata sandi sederhana
  const hashedPassword = hashPassword(password);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: { role: 'CUSTOMER', password: hashedPassword, name: 'Demo Customer' }
    });
    console.log("Akun customer berhasil diatur ulang (role & password diperbarui).");
  } else {
    await prisma.user.create({
      data: {
        name: "Demo Customer",
        email: email,
        password: hashedPassword,
        role: "CUSTOMER"
      }
    });
    console.log("Akun customer baru berhasil dibuat!");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
