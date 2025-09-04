"server only";

import { prisma } from "@/lib/prisma";

export async function getNotifications(recipient_id: string, take?: number) {
  if (take) {
    return await prisma.notification.findMany({
      where: {
        recipient_id,
      },
      take: 3,
    });
  }

  return await prisma.notification.findMany({
    where: {
      recipient_id,
    },
  });
}
