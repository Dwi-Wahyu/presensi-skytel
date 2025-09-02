import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@/app/generated/prisma";

export async function GET() {
  const now = new Date();
  const dayOfWeek = now.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return NextResponse.json(
      { message: "Hari ini bukan hari kerja, tugas cron dilewati." },
      { status: 200 }
    );
  }

  try {
    const users = await prisma.user.findMany();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek + 1);

    const weekdays = [];
    for (let i = 0; i < 5; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      weekdays.push(day);
    }

    const createdEntriesSummary: { userId: string; dates: string[] }[] = [];

    for (const user of users) {
      const missingEntriesForUser: string[] = [];

      for (const day of weekdays) {
        const attendance = await prisma.attendance.findUnique({
          where: {
            date_user_id: {
              date: new Date(day.setHours(0, 0, 0, 0)),
              user_id: user.id,
            },
          },
        });

        if (!attendance) {
          await prisma.attendance.create({
            data: {
              date: new Date(day.setHours(0, 0, 0, 0)),
              user_id: user.id,
              status: AttendanceStatus.ABSENT,
            },
          });
          missingEntriesForUser.push(day.toISOString().split("T")[0]);
        }
      }

      if (missingEntriesForUser.length > 0) {
        createdEntriesSummary.push({
          userId: user.id,
          dates: missingEntriesForUser,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Tugas cron berhasil dijalankan.",
        details: "Entri kehadiran yang hilang telah dibuat.",
        summary: createdEntriesSummary,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal menjalankan tugas cron.",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
