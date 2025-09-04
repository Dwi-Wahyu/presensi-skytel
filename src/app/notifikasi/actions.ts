"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { PrismaClientKnownRequestError } from "../generated/prisma/runtime/library";

export async function deleteNotification(
  notificationId: number,
  userId: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
        recipient_id: userId,
      },
    });

    return successResponse(undefined, "Notifikasi berhasil dihapus.");
  } catch (e: any) {
    console.error("Error deleting notification:", e);

    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return errorResponse("Notifikasi tidak ditemukan.", "NOT_FOUND");
      }
    }

    return errorResponse(
      "Terjadi kesalahan saat menghapus notifikasi: " + e.message,
      "SERVER_ERROR"
    );
  }
}
