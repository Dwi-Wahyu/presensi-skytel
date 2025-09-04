"use server";

import { PermissionStatus } from "@/app/generated/prisma";
import { auth } from "@/config/auth";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { unlinkSync } from "fs";
import { revalidatePath } from "next/cache";
import { join } from "path";

export async function approvePermission(
  permission_id: number,
  user_id: string
): Promise<ServerActionReturn<void>> {
  try {
    const approvedPermission = await prisma.permission.update({
      where: {
        id: permission_id,
        status: PermissionStatus.PENDING,
      },
      data: {
        status: PermissionStatus.APPROVED,
        reason: "",
      },
      select: {
        user_id: true,
      },
    });

    await prisma.notification.create({
      data: {
        recipient_id: approvedPermission.user_id,
        sender_id: user_id,
        title: "Permohonan Izin Disetujui",
        message:
          "Selamat, permohonan izin Anda telah disetujui oleh administrator.",
        resource_path: `/pengajuan-izin/${permission_id}`,
      },
    });

    revalidatePath("/admin/pengajuan-izin/" + permission_id);

    return successResponse(undefined, "Permohonan izin berhasil disetujui.");
  } catch (e: any) {
    console.error("Error approving permission:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse(
          "Permohonan izin tidak ditemukan atau sudah diproses.",
          "NOT_FOUND"
        );
      }
    }

    return errorResponse(
      "Terjadi kesalahan saat menyetujui permohonan izin: " + e.message,
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
        status: PermissionStatus.PENDING,
      },
      data: {
        status: PermissionStatus.REJECTED,
      },
      select: {
        user_id: true,
      },
    });

    let notificationMessage =
      "Mohon maaf, permohonan izin Anda telah ditolak oleh administrator.";
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

    return successResponse(undefined, "Permohonan izin berhasil ditolak.");
  } catch (e: any) {
    console.error("Error rejecting permission:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse(
          "Permohonan izin tidak ditemukan atau sudah diproses.",
          "NOT_FOUND"
        );
      }
    }

    return errorResponse(
      "Terjadi kesalahan saat menolak permohonan izin: " + e.message,
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
          "Mohon maaf, permohonan izin Anda telah dihapus oleh administrator.",
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
      "Terjadi kesalahan saat menghapus permohonan izin: " + e.message,
      "SERVER_ERROR"
    );
  }
}
