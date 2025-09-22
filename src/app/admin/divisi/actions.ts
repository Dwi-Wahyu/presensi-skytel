"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import {
  InputDivisionSchemaType,
  UpdateDivisionSchemaType,
} from "@/validations/schemas/division";
import { revalidatePath } from "next/cache";

export async function createDivision(
  payload: InputDivisionSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const create = await prisma.division.create({
      data: {
        name: payload.name,
        leader_id: payload.leader_id,
        users: {
          connect: payload.users.map((user) => ({ id: user.value })),
        },
      },
    });

    console.log(create);

    return successResponse(undefined, "Berhasil Input Divisi");
  } catch (e: any) {
    console.error("Error creating employee:", e);

    return errorResponse(
      "Terjadi kesalahan saat input divisi: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function updateDivision(
  payload: UpdateDivisionSchemaType
): Promise<ServerActionReturn<void>> {
  const { id, ...data } = payload;
  try {
    const existing = await prisma.division.findFirst({
      where: {
        id,
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existing) {
      return errorResponse("Divisi tidak ditemukan", "SERVER_ERROR");
    }

    const update = await prisma.division.update({
      where: {
        id,
      },
      data: {
        name: payload.name,
        leader_id: payload.leader_id,
        users: {
          disconnect: existing.users.map((user) => ({ id: user.id })),
          connect: payload.users.map((user) => ({ id: user.value })),
        },
      },
    });

    console.log(update);

    return successResponse(undefined, "Berhasil Input Divisi");
  } catch (e: any) {
    console.error("Error creating employee:", e);

    return errorResponse(
      "Terjadi kesalahan saat menambahkan divisi: " + e.message,
      "SERVER_ERROR"
    );
  }
}

export async function deleteDivision(
  id: string
): Promise<ServerActionReturn<void>> {
  try {
    await prisma.division.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/divisi");

    return successResponse(undefined, "Berhasil Input Divisi");
  } catch (error) {
    return errorResponse(
      "Terjadi kesalahan saat menghapus divisi",
      "SERVER_ERROR"
    );
  }
}
