// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // where your schema lives
  schema: 'prisma/schema.prisma',

  // where migrations will be stored (default is fine)
  migrations: {
    path: 'prisma/migrations',
  },

  // actual database URL for migrations
  datasource: {
    // you can use DATABASE_URL or DIRECT_DATABASE_URL; for now keep it simple:
    url: env('DATABASE_URL'),
    // If you later add Accelerate, you'll likely switch this to DIRECT_DATABASE_URL
  },
});
