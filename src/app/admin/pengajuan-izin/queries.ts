"server only";

import { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { PermissionSearchParamsType } from "@/validations/search-params/permission-search-params";

export async function getPermissionsData(input: PermissionSearchParamsType) {
  type PermissionWhereClause = Prisma.PermissionWhereInput;
  let permissionWhereClause: PermissionWhereClause = {};

  if (input.date) {
    permissionWhereClause["created_at"] = {
      gte: new Date(new Date(input.date).setHours(0, 0, 0, 0)),
      lte: new Date(new Date(input.date).setHours(23, 59, 59, 999)),
    };
  }

  if (input.nama) {
    permissionWhereClause["user"] = {
      name: { contains: input.nama },
    };
  }

  const filtered = await prisma.permission.count({
    where: permissionWhereClause,
  });

  const data = await prisma.permission.findMany({
    take: input.perPage,
    skip: (input.page - 1) * input.perPage,
    where: permissionWhereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const pageCount = Math.ceil(filtered / input.perPage);

  return { data, pageCount, filtered };
}

export async function getPermissionById(id: number) {
  return await prisma.permission.findFirst({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getPendingPermissionCount() {
  return await prisma.permission.count({
    where: {
      status: "PENDING",
    },
  });
}
