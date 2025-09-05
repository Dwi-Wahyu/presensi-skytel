"use server";

import {
  AttendanceStatus,
  PermissionStatus,
  PermissionType,
} from "@/app/generated/prisma";
import { auth } from "@/config/auth";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { unlinkSync } from "fs";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { getClockInTime, getClockOutTime } from "../pengaturan/queries";

export async function approvePermission(
  permission_id: number,
  user_id: string
): Promise<ServerActionReturn<void>> {
  try {
    const permission = await prisma.permission.findUnique({
      where: {
        id: permission_id,
      },
      select: {
        user_id: true,
        type: true,
        date_start: true,
        date_end: true,
      },
    });

    if (!permission) {
      return errorResponse("Pengajuan izin tidak ditemukan.", "NOT_FOUND");
    }

    const approvedPermission = await prisma.permission.update({
      where: {
        id: permission_id,
      },
      data: {
        status: PermissionStatus.APPROVED,
        rejected_reason: null,
      },
      select: {
        user_id: true,
        type: true,
        date_start: true,
        date_end: true,
      },
    });

    await prisma.notification.create({
      data: {
        recipient_id: approvedPermission.user_id,
        sender_id: user_id,
        title: "Permohonan Izin Disetujui",
        message:
          "Selamat, pengajuan izin Anda telah disetujui oleh administrator.",
        resource_path: `/pengajuan-izin/${permission_id}`,
      },
    });

    const clockInTime = await getClockInTime();
    const clockOutTime = await getClockOutTime();

    let currentDate = new Date(approvedPermission.date_start);
    const endDate = new Date(approvedPermission.date_end);

    while (currentDate <= endDate) {
      const attendanceDate = new Date(currentDate);
      const attendanceData: any = {
        user_id: approvedPermission.user_id,
        date: attendanceDate,
      };

      switch (approvedPermission.type) {
        case PermissionType.FULL:
          attendanceData.status = AttendanceStatus.EXCUSED;
          break;

        case PermissionType.LATE:
          if (clockInTime) {
            const [hours, minutes] = clockInTime.value.split(":").map(Number);
            const newDate = new Date(attendanceDate);
            newDate.setHours(hours, minutes, 0, 0);
            attendanceData.clock_in_at = newDate;
          }
          attendanceData.status = AttendanceStatus.ABSENT;
          break;

        case PermissionType.EARLY_LEAVE:
          if (clockOutTime) {
            const [hours, minutes] = clockOutTime.value.split(":").map(Number);
            const newDate = new Date(attendanceDate);
            newDate.setHours(hours, minutes, 0, 0);
            attendanceData.clock_out_at = newDate;
          }
          attendanceData.status = AttendanceStatus.ABSENT;
          break;
      }

      await prisma.attendance.upsert({
        where: {
          date_user_id: {
            date: attendanceDate,
            user_id: approvedPermission.user_id,
          },
        },
        update: attendanceData,
        create: attendanceData,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    revalidatePath("/admin/pengajuan-izin/" + permission_id);

    return successResponse(undefined, "Pengajuan izin berhasil disetujui.");
  } catch (e: any) {
    console.error("Error approving permission:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse(
          "Pengajuan izin tidak ditemukan atau sudah diproses.",
          "NOT_FOUND"
        );
      }
    }

    return errorResponse(
      "Terjadi kesalahan saat menyetujui pengajuan izin: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function rejectPermission(
  permission_id: number,
  admin_id: string,
  reason?: string
): Promise<ServerActionReturn<void>> {
  try {
    const rejectedPermission = await prisma.permission.update({
      where: {
        id: permission_id,
      },
      data: {
        status: PermissionStatus.REJECTED,
        rejected_reason: reason,
      },
      select: {
        user_id: true,
      },
    });

    let notificationMessage =
      "Mohon maaf, pengajuan izin Anda telah ditolak oleh administrator.";
    if (reason) {
      notificationMessage += ` Alasan: ${reason}`;
    }

    await prisma.notification.create({
      data: {
        recipient_id: rejectedPermission.user_id,
        sender_id: admin_id,
        title: "Permohonan Izin Ditolak",
        message: notificationMessage,
        resource_path: `/pengajuan-izin/${permission_id}`,
      },
    });

    return successResponse(undefined, "Pengajuan izin berhasil ditolak.");
  } catch (e: any) {
    console.error("Error rejecting permission:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse(
          "Pengajuan izin tidak ditemukan atau sudah diproses.",
          "NOT_FOUND"
        );
      }
    }

    return errorResponse(
      "Terjadi kesalahan saat menolak pengajuan izin: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function deletePermission(
  permission_id: number
): Promise<ServerActionReturn<void>> {
  const session = await auth();

  if (!session)
    return errorResponse(
      "Sesi Login Tidak Terbaca, Silahkan Login Ulang",
      "SERVER_ERROR"
    );

  try {
    const permission = await prisma.permission.findUnique({
      where: {
        id: permission_id,
      },
      select: {
        user_id: true,
        proof: true,
      },
    });

    if (!permission) {
      return errorResponse("Pengajuan tidak ditemukan.", "NOT_FOUND");
    }

    if (permission.proof) {
      const absolutePath = join(process.cwd(), "public", permission.proof);
      unlinkSync(absolutePath);
    }

    await prisma.permission.delete({
      where: {
        id: permission_id,
      },
    });

    await prisma.notification.create({
      data: {
        recipient_id: permission.user_id,
        sender_id: session.user.id,
        title: "Pengajuan Dihapus",
        message:
          "Mohon maaf, pengajuan izin Anda telah dihapus oleh administrator.",
        resource_path: null,
      },
    });

    revalidatePath("/admin/pengajuan-izin");

    return successResponse(undefined, "Pengajuan berhasil dihapus.");
  } catch (e: any) {
    console.error("Error deleting permission:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse("Pengajuan tidak ditemukan.", "NOT_FOUND");
      }
    }

    return errorResponse(
      "Terjadi kesalahan saat menghapus pengajuan izin: " + e.message,
      "SERVER_ERROR"
    );
  }
}
