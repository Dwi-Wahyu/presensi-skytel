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

function getRandomTime(startHour: number, endHour: number): string {
  const hour =
    Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function getRandomAttendanceData() {
  const statuses = [
    AttendanceStatus.ATTEND,
    AttendanceStatus.ABSENT,
    AttendanceStatus.LATE,
    AttendanceStatus.EXCUSED,
  ];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  let clockInAt = null;
  let clockOutAt = null;
  let overtimeHours = null;

  if (
    randomStatus === AttendanceStatus.ATTEND ||
    randomStatus === AttendanceStatus.LATE
  ) {
    clockInAt = getRandomTime(8, 10);
    clockOutAt = getRandomTime(15, 17);
  }

  return {
    status: randomStatus,
    clock_in_at: clockInAt,
    clock_out_at: clockOutAt,
    overtime_hours: overtimeHours,
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
        const { status, clock_in_at, clock_out_at, overtime_hours } =
          getRandomAttendanceData();

        attendanceData.push({
          date: new Date(date),
          user_id: user.id,
          status,
          clock_in_at: `0${clock_in_at}:00`,
          clock_out_at: `0${clock_out_at}:00`,
          overtime_hours,
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
