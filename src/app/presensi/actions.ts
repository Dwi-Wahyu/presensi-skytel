"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { Attendance } from "../generated/prisma";
import { formatToHour } from "@/helper/hour-helper";

export async function catatPresensi(
  username: string
): Promise<
  ServerActionReturn<{ attendance: Attendance; clockedOut: boolean }>
> {
  try {
    const findEmployeeAndExistingAttendanceToday = await prisma.user.findFirst({
      where: {
        username,
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

    const clockedOut =
      findEmployeeAndExistingAttendanceToday.attendances[0].clock_out_at !==
      null;

    if (clockedOut) {
      return successResponse(
        {
          attendance: findEmployeeAndExistingAttendanceToday.attendances[0],
          clockedOut: true,
        },
        "Berhasil mencatat kehadiran"
      );
    }

    const nowHourString = formatToHour(new Date());

    const validQrCode = await prisma.validQRCode.findFirst();

    if (validQrCode) {
      await prisma.validQRCode.delete({
        where: {
          id: validQrCode.id,
        },
      });
    }

    if (!clockedIn) {
      const createdAttendance = await prisma.attendance.create({
        data: {
          clock_in_at: nowHourString,
          status: "ABSENT",
          user_id: findEmployeeAndExistingAttendanceToday.id,
        },
      });

      return successResponse(
        { attendance: createdAttendance, clockedOut: false },
        "Berhasil mencatat kehadiran"
      );
    }

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: findEmployeeAndExistingAttendanceToday.attendances[0].id,
      },
      data: {
        clock_out_at: nowHourString,
        status: "ATTEND",
      },
    });

    return successResponse(
      { attendance: updatedAttendance, clockedOut: true },
      "Berhasil mencatat kehadiran"
    );
  } catch (error) {
    console.log(error);

    return errorResponse(
      "Terjadi kesalahan saat mencatat kehadiran",
      "SERVER_ERROR"
    );
  }
}

// export async function catatPresensi(
//   username: string
// ): Promise<ServerActionReturn<Attendance[]>> {
//   try {
//     const employee = await prisma.user.findFirst({
//       where: {
//         username,
//       },
//       include: {
//         attendances: {
//           where: {
//             date: {
//               gte: new Date(new Date().setHours(0, 0, 0, 0)),
//               lte: new Date(new Date().setHours(23, 59, 59, 999)),
//             },
//           },
//         },
//       },
//     });

//     if (!employee) {
//       return errorResponse(
//         "Data Karyawan Tidak Dapat Ditemukan",
//         "SERVER_ERROR"
//       );
//     }

//     if (employee.attendances.length === 2) {
//       return errorResponse(
//         "Anda Telah Clock In dan Clock Out Hari Ini",
//         "SERVER_ERROR"
//       );
//     }

//     let attendance_status: AttendanceStatus = "ATTEND";
//     let clock_type: ClockType = "IN";

//     const MINIMUM_LATE_THRESHOLD = await prisma.appSettings.findFirst({
//       where: { key: "MINIMUM_LATE_THRESHOLD" },
//     });

//     const OVERTIME_THRESHOLD = await prisma.appSettings.findFirst({
//       where: { key: "OVERTIME_THRESHOLD" },
//     });

//     const CLOCK_IN_TIME = await prisma.appSettings.findFirst({
//       where: { key: "CLOCK_IN_TIME" },
//     });

//     const CLOCK_OUT_TIME = await prisma.appSettings.findFirst({
//       where: { key: "CLOCK_OUT_TIME" },
//     });

//     if (
//       !MINIMUM_LATE_THRESHOLD ||
//       !OVERTIME_THRESHOLD ||
//       !CLOCK_IN_TIME ||
//       !CLOCK_OUT_TIME
//     ) {
//       return errorResponse(
//         "Terjadi kesalahan pada server: Pengaturan tidak ditemukan",
//         "SERVER_ERROR"
//       );
//     }

//     const now = new Date();

//     const lateThresholdMinutes = Number(MINIMUM_LATE_THRESHOLD.value);
//     const overtimeThresholdMinutes = Number(OVERTIME_THRESHOLD.value);
//     const clockInTimeString = CLOCK_IN_TIME.value;
//     const clockOutTimeString = CLOCK_OUT_TIME.value;

//     const [clockInHour, clockInMinute] = clockInTimeString
//       .split(":")
//       .map(Number);
//     const clockInTime = setMinutes(setHours(now, clockInHour), clockInMinute);

//     const [clockOutHour, clockOutMinute] = clockOutTimeString
//       .split(":")
//       .map(Number);
//     const clockOutTime = setMinutes(
//       setHours(now, clockOutHour),
//       clockOutMinute
//     );

//     const lateClockInTime = addMinutes(clockInTime, lateThresholdMinutes);
//     const overtimeClockOutTime = addMinutes(
//       clockOutTime,
//       overtimeThresholdMinutes
//     );

//     const isBeforeClockIn = isBefore(now, clockInTime);

//     if (isBeforeClockIn) {
//       return errorResponse(
//         "Anda belum bisa melakukan presensi, silahkan tunggu sampai " +
//           clockInTimeString,
//         "SERVER_ERROR"
//       );
//     }

//     const isLate = isAfter(now, lateClockInTime);
//     const isOvertime = isAfter(now, overtimeClockOutTime);

//     if (isLate) {
//       attendance_status = "LATE";
//     }

//     if (employee.attendances.length === 1) {

//       if (isOvertime) {
//         attendance_status = "OVERTIME";
//       }
//     }

//     await prisma.attendance.create({
//       data: {
//         status: attendance_status,
//         user_id: employee.id,
//         clock_in_at:
//       },
//     });

//     const employeeAttendanceToday = await prisma.attendance.findMany({
//       where: {
//         date: {
//           gte: new Date(new Date().setHours(0, 0, 0, 0)),
//           lte: new Date(new Date().setHours(23, 59, 59, 999)),
//         },
//         user_id: employee.id,
//       },
//     });

//     const validQrCode = await prisma.validQRCode.findFirst();

//     if (validQrCode) {
//       await prisma.validQRCode.delete({
//         where: {
//           id: validQrCode.id,
//         },
//       });
//     }

//     return successResponse(
//       employeeAttendanceToday,
//       "Kehadiran berhasil dicatat"
//     );
//   } catch (error) {
//     return errorResponse(
//       "Terjadi kesalahan saat mencatat kehadiran",
//       "SERVER_ERROR"
//     );
//   }
// }

export async function getEmployeeAttendancesToday(user_id: string) {
  return await prisma.attendance.findFirst({
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      user_id,
    },
    orderBy: {
      date: "asc",
    },
  });
}
