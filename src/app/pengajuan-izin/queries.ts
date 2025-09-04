"server only";

import { prisma } from "@/lib/prisma";

export async function getPermissionsByEmployeeId(user_id: string) {
  return await prisma.permission.findMany({
    where: {
      user_id,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}
