// prisma/seed.ts
import { prisma } from '../lib/prisma';

async function main() {
  // clear existing
  await prisma.sale.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();

  const product = await prisma.product.create({
    data: {
      sku: 'HEADPHONES-BLK-01',
      name: 'Wireless Headphones - Black',
      category: 'Electronics',
      costPrice: 800,
      price: 1499,
      inventory: {
        create: {
          onHand: 120,
          inbound: 40,
          leadTimeDays: 25,
          safetyStock: 20,
        },
      },
    },
  });

  const now = new Date();
  const days = 30;
  const salesData = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const units = Math.floor(Math.random() * 8); // 0–7 per day
    const revenue = units * 1499;

    salesData.push({
      productId: product.id,
      date: d,
      units,
      revenue,
    });
  }

  await prisma.sale.createMany({ data: salesData });

  console.log('Seeded demo product + 30 days of sales.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
