"server only";

import { prisma } from "@/lib/prisma";

/**
 * Mengambil semua pengaturan aplikasi dari database.
 * @returns {Promise<Array<{ key: string, value: string }>>} Sebuah array dari semua objek pengaturan.
 */
export async function getAllAppSettings() {
  const settings = await prisma.appSettings.findMany();
  return settings;
}
