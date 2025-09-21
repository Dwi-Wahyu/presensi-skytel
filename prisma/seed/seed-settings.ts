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

  await prisma.appSettings.upsert({
    where: { key: "OFFICE_LATITUDE" },
    update: {
      value: "-5.143034164300227",
    },
    create: {
      key: "OFFICE_LATITUDE",
      value: "-5.143034164300227",
    },
  });

  await prisma.appSettings.upsert({
    where: { key: "OFFICE_LONGITUDE" },
    update: {
      value: "119.48064904974403",
    },
    create: {
      key: "OFFICE_LONGITUDE",
      value: "119.48064904974403",
    },
  });

  console.log("Seeding AppSettings selesai!");
}
