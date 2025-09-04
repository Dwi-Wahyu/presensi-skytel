"use server";

import {
  InputPermissionSchemaType,
  UpdatePermissionSchemaType,
} from "@/validations/schemas/permission";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { LocalStorageService } from "@/services/storage_services";
import { ServerActionReturn } from "@/types/server-action";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { unlinkSync } from "fs";
import { join } from "path";

export async function uploadProof(file: File, userId: string) {
  const storageService = new LocalStorageService();

  const proofUrl = await storageService.uploadImage(file, userId, "proof");

  return proofUrl;
}

export async function createPermission(
  payload: InputPermissionSchemaType,
  sender_name: string
): Promise<ServerActionReturn<void>> {
  try {
    const create = await prisma.permission.create({
      data: {
        reason: payload.reason,
        days_count: payload.days_count,
        proof: payload.proof,
        status: "PENDING",
        type: payload.type,
        user_id: payload.user_id,
        date_start: payload.date_start,
        date_end: payload.date_end,
      },
    });

    const admins = await prisma.user.findMany({
      where: {
        role: "admin",
      },
      select: {
        id: true,
      },
    });

    const notificationData = admins.map((admin) => ({
      recipient_id: admin.id,
      sender_id: payload.user_id,
      title: "Pengajuan Izin Baru",
      message: `Pengajuan izin baru dari ${sender_name} telah masuk. Silakan tinjau permohonan tersebut.`,
      resource_path: `/admin/pengajuan-izin/${create.id}`,
    }));

    if (notificationData.length > 0) {
      await prisma.notification.createMany({
        data: notificationData,
      });
    }

    console.log("Izin berhasil dibuat dan notifikasi dikirim.");

    return successResponse(undefined, "Permohonan izin berhasil diajukan");
  } catch (e: any) {
    console.error("Error creating permission:", e);

    // ... penanganan error yang sudah ada
    if (e instanceof PrismaClientKnownRequestError) {
      // ...
    }

    return errorResponse(
      "Terjadi kesalahan saat mengajukan permohonan izin: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function updatePermission(
  payload: UpdatePermissionSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const { id, ...dataToUpdate } = payload;

    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      return errorResponse("Izin tidak ditemukan", "NOT_FOUND");
    }

    if (permission.status !== "PENDING") {
      return errorResponse(
        "Izin tidak dapat diubah karena statusnya sudah bukan PENDING",
        "VALIDATION_ERROR"
      );
    }

    const updatedPermission = await prisma.permission.update({
      where: {
        id: id,
      },
      data: {
        reason: dataToUpdate.reason,
        days_count: dataToUpdate.days_count,
        proof: dataToUpdate.proof,
        type: dataToUpdate.type,
        date_start: dataToUpdate.date_start,
        date_end: dataToUpdate.date_end,
      },
    });

    if (!updatedPermission) {
      return errorResponse(
        "Anda tidak memiliki izin untuk mengedit permohonan ini.",
        "FORBIDDEN"
      );
    }

    return successResponse(undefined, "Permohonan izin berhasil diperbarui.");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return errorResponse("Data yang dikirim tidak valid", "VALIDATION_ERROR");
    }
    return errorResponse(
      "Terjadi kesalahan saat memperbarui permohonan",
      "SERVER_ERROR"
    );
  }
}
