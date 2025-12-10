// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  // Prisma 7 requires explicit options; types may lag, so we ignore TS here.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL!,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
