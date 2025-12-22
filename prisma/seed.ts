// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding classes...");

  await prisma.score.deleteMany();
  await prisma.class.deleteMany();

  const classNames = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
    "Class 13"
  ];

  for (const name of classNames) {
    await prisma.class.create({
      data: { name }
    });
  }

  console.log(`Created ${classNames.length} classes.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
