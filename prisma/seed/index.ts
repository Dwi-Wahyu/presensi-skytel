import { prisma } from "@/lib/prisma";
import { seedUsers } from "./seed-users";
import { seedSettings } from "./seed-settings";
import { seedAttendance } from "./seed-attendance";

async function main() {
  await seedUsers();
  await seedSettings();
  await seedAttendance();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
