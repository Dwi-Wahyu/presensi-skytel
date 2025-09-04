"server only";

import { prisma } from "@/lib/prisma";

const calculateWorkDurationInMinutes = (
  clockIn: Date | null,
  clockOut: Date | null
): number => {
  if (!clockIn || !clockOut) {
    return 0;
  }
  const diffInMilliseconds = clockOut.getTime() - clockIn.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  return diffInMinutes;
};

const getStartOfWeek = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(today.setDate(diff));
};

const getEndOfWeek = () => {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  return endOfWeek;
};

type AttendanceRecord = {
  date: Date;
  clock_in_at: Date | null;
  clock_out_at: Date | null;
};

export async function getWorkDurationData(userId: string) {
  try {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();

    const rawAttendanceData = await prisma.attendance.findMany({
      where: {
        user_id: userId,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: {
        date: "asc",
      },
      select: {
        date: true,
        clock_in_at: true,
        clock_out_at: true,
      },
    });

    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const weeklyDataTemplate = [
      { month: "Senin", workDuration: 0 },
      { month: "Selasa", workDuration: 0 },
      { month: "Rabu", workDuration: 0 },
      { month: "Kamis", workDuration: 0 },
      { month: "Jumat", workDuration: 0 },
    ];

    const processedData = rawAttendanceData.map((record: AttendanceRecord) => ({
      month: days[record.date.getDay()],
      workDuration: calculateWorkDurationInMinutes(
        record.clock_in_at,
        record.clock_out_at
      ),
    }));

    processedData.forEach((dayData) => {
      const index = weeklyDataTemplate.findIndex(
        (template) => template.month === dayData.month
      );
      if (index !== -1) {
        weeklyDataTemplate[index].workDuration = dayData.workDuration;
      }
    });

    return weeklyDataTemplate;
  } catch (error) {
    return [];
  }
}
