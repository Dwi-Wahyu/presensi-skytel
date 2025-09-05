"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { UpdateSettingSchemaType } from "@/validations/schemas/setting";

export async function updateSettings(
  payload: UpdateSettingSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const {
      CLOCK_IN_TIME,
      CLOCK_OUT_TIME,
      MINIMUM_LATE_THRESHOLD,
      OVERTIME_THRESHOLD,
    } = payload;

    await prisma.appSettings.update({
      where: {
        key: "CLOCK_IN_TIME",
      },
      data: {
        value: CLOCK_IN_TIME,
      },
    });

    await prisma.appSettings.update({
      where: {
        key: "CLOCK_OUT_TIME",
      },
      data: {
        value: CLOCK_OUT_TIME,
      },
    });

    await prisma.appSettings.update({
      where: {
        key: "MINIMUM_LATE_THRESHOLD",
      },
      data: {
        value: MINIMUM_LATE_THRESHOLD.toString(),
      },
    });

    await prisma.appSettings.update({
      where: {
        key: "OVERTIME_THRESHOLD",
      },
      data: {
        value: OVERTIME_THRESHOLD.toString(),
      },
    });

    return successResponse(
      undefined,
      "Pengaturan aplikasi berhasil diperbarui."
    );
  } catch (error) {
    return errorResponse(
      "Terjadi kesalahan saat memperbarui pengaturan",
      "SERVER_ERROR"
    );
  }
}
