"use server";

import { ServerActionReturn } from "@/types/server-action";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/helper/action-helpers";

import { Attendance, AttendanceStatus } from "@/app/generated/prisma";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

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

    const employeeEarlyLeavePermissions = await prisma.permission.findMany({
      where: {
        user_id,
        status: "APPROVED",
        type: "EARLY_LEAVE",
      },
    });

    let attendanceStatus: AttendanceStatus = "ABSENT";

    // ini jika belum absen sama sekali atau tidak ada izin hari ini
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

    // untuk memeriksa jika terdapat permission pulang lebih awal oleh pengguna yang telah disetujui
    for (const eachEarlyLeavePermission of employeeEarlyLeavePermissions) {
      const today = new Date();

      if (eachEarlyLeavePermission.days_count === 1) {
        if (
          today >= startOfDay(new Date(eachEarlyLeavePermission.date_start)) &&
          today <= endOfDay(new Date(eachEarlyLeavePermission.date_start))
        ) {
          const updatedAttendance = await prisma.attendance.update({
            where: {
              id: employeeExistingAttendanceToday.id,
            },
            data: {
              clock_in_at: today,
              status: "ATTEND",
            },
          });

          console.log(updatedAttendance);
          return successResponse(
            updatedAttendance,
            "Berhasil mencatat kehadiran"
          );
        }
      } else {
        // rentang date_start → date_end (inklusif)
        const inRange = isWithinInterval(today, {
          start: startOfDay(new Date(eachEarlyLeavePermission.date_start)),
          end: endOfDay(new Date(eachEarlyLeavePermission.date_end)),
        });

        if (inRange) {
          const updatedAttendance = await prisma.attendance.update({
            where: {
              id: employeeExistingAttendanceToday.id,
            },
            data: {
              clock_in_at: today,
              status: "ATTEND",
            },
          });

          console.log(updatedAttendance);
          return successResponse(
            updatedAttendance,
            "Berhasil mencatat kehadiran"
          );
        }
      }
    }

    if (employeeExistingAttendanceToday.status === "EXCUSED") {
      return successResponse(
        employeeExistingAttendanceToday,
        "Anda telah memiliki permohonan izin aktif pada hari ini"
      );
    }

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: employeeExistingAttendanceToday.id,
      },
      data: {
        clock_out_at: new Date(),
        status: "ATTEND",
      },
    });

    // console.log(updatedAttendance);
    // console.log("ini jalan");

    return successResponse(updatedAttendance, "Berhasil mencatat kehadiran");
  } catch (error) {
    console.log(error);
    return errorResponse("Terjadi Kesalahan Saat Mencatat Presensi");
  }
}
