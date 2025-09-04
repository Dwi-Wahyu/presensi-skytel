"server only";

import { prisma } from "@/lib/prisma";

export async function getAllAppSettings() {
  const settings = await prisma.appSettings.findMany();
  return settings;
}

export async function getMinimumLateThreshold() {
  return await prisma.appSettings.findFirst({
    where: {
      key: "MINIMUM_LATE_THRESHOLD",
    },
  });
}

export async function getOvertimeThreshold() {
  return await prisma.appSettings.findFirst({
    where: {
      key: "OVERTIME_THRESHOLD",
    },
  });
}

export async function getClockInTime() {
  return await prisma.appSettings.findFirst({
    where: {
      key: "CLOCK_IN_TIME",
    },
  });
}

export async function getClockOutTime() {
  return await prisma.appSettings.findFirst({
    where: {
      key: "CLOCK_OUT_TIME",
    },
  });
}
