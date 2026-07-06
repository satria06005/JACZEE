const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const email = "admin@jaczee.com";
  const password = "admin"; // Kata sandi sederhana
  const hashedPassword = hashPassword(password);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', password: hashedPassword, name: 'Administrator' }
    });
    console.log("Akun admin berhasil diatur ulang (role & password diperbarui).");
  } else {
    await prisma.user.create({
      data: {
        name: "Administrator",
        email: email,
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    console.log("Akun admin baru berhasil dibuat!");
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
