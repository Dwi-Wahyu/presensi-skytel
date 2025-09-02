import { prisma } from "@/lib/prisma";

async function setSetting(key: string, value: string) {
  await prisma.appSettings.upsert({
    where: { key: key },
    update: { value: value },
    create: { key: key, value: value },
  });
}

// Untuk mengambil
async function getSetting(key: string) {
  const setting = await prisma.appSettings.findUnique({
    where: { key: key },
  });
  return setting ? setting.value : null;
}
