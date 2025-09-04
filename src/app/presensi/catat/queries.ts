"server only";

import { ServerActionReturn } from "@/types/server-action";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";

import { Attendance, AttendanceStatus } from "@/app/generated/prisma";

export async function catatPresensi(
  user_id: string
): Promise<ServerActionReturn<Attendance>> {
  try {
    const employeeExistingAttendanceToday = await prisma.attendance.findFirst({
      where: {
        user_id,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    let attendanceStatus: AttendanceStatus = "ATTEND";

    if (!employeeExistingAttendanceToday) {
      const createdAttendance = await prisma.attendance.create({
        data: {
          clock_in_at: new Date(),
          status: attendanceStatus,
          user_id,
        },
      });

      console.log(createdAttendance);
      return successResponse(createdAttendance, "Berhasil mencatat kehadiran");
    }

    if (employeeExistingAttendanceToday.status === "ABSENT") {
      const updatedAttendance = await prisma.attendance.update({
        where: {
          id: employeeExistingAttendanceToday.id,
        },
        data: {
          clock_in_at: new Date(),
          status: attendanceStatus,
        },
      });

      console.log(updatedAttendance);
      return successResponse(updatedAttendance, "Berhasil mencatat kehadiran");
    }

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: employeeExistingAttendanceToday.id,
      },
      data: {
        clock_out_at: new Date(),
      },
    });

    console.log(updatedAttendance);
    return successResponse(updatedAttendance, "Berhasil mencatat kehadiran");
  } catch (error) {
    console.log(error);
    return errorResponse("Terjadi Kesalahan Saat Mencatat Presensi");
  }
}
