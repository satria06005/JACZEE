import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Categories
  const categories = [
    { name: 'Mens', slug: 'mens' },
    { name: 'Womens', slug: 'womens' },
    { name: 'Kids', slug: 'kids' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
  }

  const mensCat = await prisma.category.findUnique({ where: { slug: 'mens' } });
  const womensCat = await prisma.category.findUnique({ where: { slug: 'womens' } });
  const kidsCat = await prisma.category.findUnique({ where: { slug: 'kids' } });

  if (!mensCat || !womensCat || !kidsCat) {
    throw new Error('Categories not found');
  }

  // 2. Create Products
  const products = [
    // Mens
    ...Array.from({ length: 9 }).map((_, i) => ({
      name: `Mens Collection Piece ${i + 1}`,
      description: 'Premium quality apparel designed for modern aesthetics and absolute comfort.',
      price: 280.0,
      stock: 50,
      imageUrl: `https://picsum.photos/seed/mens${i}/600/800`,
      categoryId: mensCat.id,
    })),
    // Womens
    ...Array.from({ length: 9 }).map((_, i) => ({
      name: `Womens Collection Piece ${i + 1}`,
      description: 'Elegant and versatile wardrobe essentials crafted with precision.',
      price: 320.0,
      stock: 50,
      imageUrl: `https://picsum.photos/seed/womens${i}/600/800`,
      categoryId: womensCat.id,
    })),
    // Kids
    ...Array.from({ length: 9 }).map((_, i) => ({
      name: `Kids Collection Piece ${i + 1}`,
      description: 'Durable, comfortable, and stylish clothing for the younger generation.',
      price: 150.0,
      stock: 50,
      imageUrl: `https://picsum.photos/seed/kids${i}/600/800`,
      categoryId: kidsCat.id,
    })),
  ];

  for (const product of products) {
    // Check if product already exists to avoid duplicates
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
