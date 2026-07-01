const { PrismaClient } = require('@prisma/client');
const fs = require('fs/promises');
const path = require('path');

const prisma = new PrismaClient();

async function cleanup() {
  console.log("Starting cleanup...");
  
  // 1. Get all referenced URLs from DB
  const products = await prisma.product.findMany();
  const banners = await prisma.banner.findMany();
  
  const referencedUrls = new Set();
  
  products.forEach(p => {
    if (p.imageUrl && p.imageUrl.startsWith('/uploads/')) {
      referencedUrls.add(p.imageUrl.replace('/uploads/', ''));
    }
    if (p.galleryUrls) {
      p.galleryUrls.forEach(url => {
        if (url && url.startsWith('/uploads/')) {
          referencedUrls.add(url.replace('/uploads/', ''));
        }
      });
    }
  });
  
  banners.forEach(b => {
    if (b.imageUrl && b.imageUrl.startsWith('/uploads/')) {
      referencedUrls.add(b.imageUrl.replace('/uploads/', ''));
    }
  });

  console.log("Referenced files in DB:", referencedUrls.size);
  
  // 2. Read all files in public/uploads
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  let files = [];
  try {
    files = await fs.readdir(uploadDir);
  } catch (e) {
    console.error("No uploads dir found.");
    return;
  }
  
  let deletedCount = 0;
  for (const file of files) {
    // Ignore non-image files if there are any (like .gitkeep)
    if (!file.includes('.')) continue;
    
    if (!referencedUrls.has(file)) {
      const filePath = path.join(uploadDir, file);
      try {
        await fs.unlink(filePath);
        console.log(`Deleted unreferenced file: ${file}`);
        deletedCount++;
      } catch (e) {
        console.error(`Failed to delete ${file}:`, e.message);
      }
    }
  }
  
  console.log(`Cleanup complete! Deleted ${deletedCount} unused files.`);
  await prisma.$disconnect();
}

cleanup().catch(console.error);
