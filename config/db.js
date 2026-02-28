// db.js
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

// 1. Create the PostgreSQL connection pool
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
});

// 2. Setup the Prisma driver adapter for PG
const adapter = new PrismaPg(pool);

// 3. Instantiate the Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

// Export the instance to use in your routes and controllers
module.exports = prisma;