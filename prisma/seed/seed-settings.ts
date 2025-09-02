import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function seedSettings() {
  await prisma.appSettings.upsert({
    where: { key: "MINIMUM_LATE_THRESHOLD" },
    update: {
      value: "15",
    },
    create: {
      key: "MINIMUM_LATE_THRESHOLD",
      value: "15",
    },
  });

  await prisma.appSettings.upsert({
    where: { key: "OVERTIME_THRESHOLD" },
    update: {
      value: "60",
    },
    create: {
      key: "OVERTIME_THRESHOLD",
      value: "60",
    },
  });

  await prisma.appSettings.upsert({
    where: { key: "CLOCK_IN_TIME" },
    update: {
      value: "08:00",
    },
    create: {
      key: "CLOCK_IN_TIME",
      value: "08:00",
    },
  });

  await prisma.appSettings.upsert({
    where: { key: "CLOCK_OUT_TIME" },
    update: {
      value: "17:00",
    },
    create: {
      key: "CLOCK_OUT_TIME",
      value: "17:00",
    },
  });

  console.log("Seeding AppSettings selesai!");
}
