const prisma = require("../config/db");
const bcrypt = require("bcrypt")

async function main() {
  const adminPhone = "07809629386";
  const rawPassword = "12345678";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  console.log('Seeding database...');

  const admin = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {},
    create: {
      name: "Ahmed Abbas",
      phone: adminPhone,
      password: hashedPassword,
      role: "ADMIN",
      address: "Baghdad, Iraq"
    },
  });

  console.log({ admin });
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