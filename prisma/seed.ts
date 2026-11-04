import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Переменная DATABASE_URL не задана");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

async function main() {
  const count = await prisma.note.count();

  if (count > 0) {
    console.log(`Seed пропущен: в базе уже ${count} заметок.`);
    return;
  }

  await prisma.note.createMany({
    data: [
      { title: "Первая заметка" },
      { title: "Проект готов к деплою на Vercel" },
    ],
  });

  console.log("Добавлены стартовые заметки.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
