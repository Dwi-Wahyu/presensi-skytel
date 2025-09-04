"use server";

import { ServerActionReturn } from "@/types/server-action";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { auth } from "@/config/auth";
import { formatToHour } from "@/helper/hour-helper";
import { redirect } from "next/navigation";

// Todo: terapkan pemeriksaan terlambat atau overtime dari app settings
export async function catatPresensi(
  qrId: string
): Promise<ServerActionReturn<void>> {
  const session = await auth();

  if (!session) {
    return errorResponse("Sesi login tidak ditemukan", "SERVER_ERROR");
  }

  const findQrCodeEntry = await prisma.validQRCode.findFirst({
    where: { id: qrId },
  });

  if (!findQrCodeEntry) {
    redirect("/presensi/qrcode-tidak-valid");
  }

  try {
    const findEmployeeAndExistingAttendanceToday = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        attendances: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
      },
    });

    if (!findEmployeeAndExistingAttendanceToday) {
      return errorResponse("Username tidak ditemukan", "SERVER_ERROR");
    }

    const clockedIn =
      findEmployeeAndExistingAttendanceToday.attendances.length === 1;

    const nowHourString = formatToHour(new Date());

    if (!clockedIn) {
      const createdAttendance = await prisma.attendance.create({
        data: {
          clock_in_at: nowHourString,
          status: "ABSENT",
          user_id: findEmployeeAndExistingAttendanceToday.id,
        },
      });

      console.log(createdAttendance);

      return successResponse(undefined, "Berhasil mencatat kehadiran");
    }

    const alreadyClockedOut =
      findEmployeeAndExistingAttendanceToday.attendances[0].clock_out_at !==
      null;

    if (alreadyClockedOut)
      return successResponse(undefined, "Berhasil mencatat kehadiran");

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: findEmployeeAndExistingAttendanceToday.attendances[0].id,
      },
      data: {
        clock_out_at: nowHourString,
        status: "ATTEND",
      },
    });

    console.log(updatedAttendance);

    const validQrCode = await prisma.validQRCode.findFirst();

    if (validQrCode) {
      await prisma.validQRCode.delete({
        where: {
          id: validQrCode.id,
        },
      });
    }

    return successResponse(undefined, "Berhasil mencatat kehadiran");
  } catch (error) {
    console.log(error);

    redirect("/presensi/gagal/Terjadi kesalahan saat mencatat kehadiran");
  }
}
