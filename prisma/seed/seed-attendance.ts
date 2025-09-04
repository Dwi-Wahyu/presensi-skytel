import { AttendanceStatus, PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

function getWeekdaysInMonth(year: number, month: number) {
  const dates = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

/**
 * Mendapatkan waktu acak dalam bentuk objek Date untuk hari tertentu.
 */
function getRandomTime(
  baseDate: Date,
  startHour: number,
  endHour: number
): Date {
  const hour =
    Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const minute = Math.floor(Math.random() * 60);
  const result = new Date(baseDate);
  result.setHours(hour, minute, 0, 0);
  return result;
}

/**
 * Mendapatkan data kehadiran acak, termasuk waktu masuk dan keluar dalam bentuk Date.
 */
function getRandomAttendanceData(baseDate: Date) {
  const statuses = [
    AttendanceStatus.ATTEND,
    AttendanceStatus.ABSENT,
    AttendanceStatus.EXCUSED,
  ];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  let clockInAt = null;
  let clockOutAt = null;

  if (randomStatus === AttendanceStatus.ATTEND) {
    // Generate valid clock in and out times
    clockInAt = getRandomTime(baseDate, 8, 9);
    clockOutAt = getRandomTime(baseDate, 17, 18);
  } else if (randomStatus === AttendanceStatus.ABSENT) {
    // Leave clockInAt and clockOutAt as null
  } else if (randomStatus === AttendanceStatus.EXCUSED) {
    // Can optionally have times if excused, but for simplicity, leave null
  }

  return {
    status: randomStatus,
    clock_in_at: clockInAt,
    clock_out_at: clockOutAt,
  };
}

export async function seedAttendance() {
  console.log(
    "Memulai seeding kehadiran untuk setiap karyawan dan setiap hari kerja di bulan ini..."
  );

  try {
    const allUsers = await prisma.user.findMany({
      where: {
        role: "employee",
      },
    });

    if (allUsers.length === 0) {
      console.error("Tidak ada pengguna ditemukan. Seeding dibatalkan.");
      return;
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const weekdaysInMonth = getWeekdaysInMonth(currentYear, currentMonth);

    const attendanceData = [];

    for (const user of allUsers) {
      for (const date of weekdaysInMonth) {
        const { status, clock_in_at, clock_out_at } =
          getRandomAttendanceData(date);

        attendanceData.push({
          date: new Date(date),
          user_id: user.id,
          status,
          clock_in_at,
          clock_out_at,
        });
      }
    }

    if (attendanceData.length > 0) {
      await prisma.attendance.createMany({
        data: attendanceData,
        skipDuplicates: true,
      });
      console.log(
        `Berhasil menambahkan ${attendanceData.length} data kehadiran untuk ${allUsers.length} pengguna.`
      );
    } else {
      console.log(
        "Tidak ada hari kerja dalam bulan ini, tidak ada data yang ditambahkan."
      );
    }
  } catch (error) {
    console.error("Gagal melakukan seeding kehadiran:", error);
  } finally {
    await prisma.$disconnect();
  }
}
