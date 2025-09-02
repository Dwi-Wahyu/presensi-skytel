import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker/locale/id_ID";
import { PrismaClient, Role } from "@/app/generated/prisma";

import { config } from "dotenv";

config();

const prisma = new PrismaClient();

const DEFAULT_AVATAR = "/uploads/avatar/default-avatar.jpg";
const DEFAULT_EMPLOYEE_PASSWORD = "karyawan123";

export async function seedUsers() {
  console.log("Memulai seeding users...");

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error(
      "Variabel lingkungan ADMIN_PASSWORD tidak ditemukan. Seeding admin dibatalkan."
    );
    await prisma.$disconnect();
    return;
  }

  try {
    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10);
    const hashedPasswordEmployee = await bcrypt.hash(
      DEFAULT_EMPLOYEE_PASSWORD,
      10
    );

    const usersToSeed = [];

    usersToSeed.push({
      name: "Ahmad Kurniawan",
      username: "awan",
      password: hashedPasswordAdmin,
      role: Role.admin,
      avatar: DEFAULT_AVATAR,
    });

    for (let i = 0; i < 10; i++) {
      const name = faker.person.fullName();
      usersToSeed.push({
        name: name,
        username: faker.internet.userName({ firstName: name }),
        password: hashedPasswordEmployee,
        role: Role.employee,
        avatar: DEFAULT_AVATAR,
      });
    }

    const userCreationPromises = usersToSeed.map(async (userData) => {
      await prisma.user.upsert({
        where: { username: userData.username },
        update: {
          name: userData.name,
          password: userData.password,
          role: userData.role,
        },
        create: {
          name: userData.name,
          username: userData.username,
          password: userData.password,
          role: userData.role,
          avatar: userData.avatar,
        },
      });
      console.log(`Pengguna '${userData.username}' berhasil di-seed.`);
    });

    await Promise.all(userCreationPromises);

    console.log("Seeding users selesai.");
  } catch (error) {
    console.error("Gagal melakukan seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}
