// prisma.config.js
import { defineConfig } from '@prisma/config';
require('dotenv').config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'node ./prisma/seed.js'
  }
});