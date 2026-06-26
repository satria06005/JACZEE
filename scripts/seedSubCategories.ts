import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.findMany();

  const subCats = ['Atasan', 'Bawahan', 'Sepatu', 'Aksesoris'];

  for (const cat of categories) {
    for (const sub of subCats) {
      const slug = `${cat.slug}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      await prisma.subCategory.upsert({
        where: { slug },
        update: {},
        create: {
          name: sub,
          slug,
          categoryId: cat.id
        }
      });
    }
  }

  console.log("SubCategories seeded successfully.");
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
