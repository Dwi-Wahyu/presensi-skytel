"server only";

import { Prisma, Role } from "@/app/generated/prisma";
import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { UserSearchParamsType } from "@/validations/search-params/user-search-params";

export async function getEmployeeData(input: UserSearchParamsType) {
  type WhereClause = Prisma.UserWhereInput;
  let whereClause: WhereClause = {
    deleted_at: null,
  };

  const session = await auth();

  if (!session) {
    return { data: [], pageCount: 1, filtered: [] };
  }

  if (input.nama) {
    whereClause["name"] = {
      contains: input.nama,
    };
  }

  whereClause["role"] = {
    equals: "employee",
  };

  const filtered = await prisma.user.count({
    where: whereClause,
  });

  const data = await prisma.user.findMany({
    take: input.perPage,
    skip: (input.page - 1) * input.perPage,
    where: whereClause,
    orderBy: {
      created_at: "desc",
    },
  });

  const pageCount = Math.ceil(filtered / input.perPage);

  return { data, pageCount, filtered };
}

export async function getEmployeeById(id: string) {
  const prajurit = await prisma.user.findUnique({
    where: { id, deleted_at: null },
  });
  return prajurit;
}

export async function getAllEmployee() {
  return await prisma.user.count({
    where: {
      role: "employee",
      deleted_at: null,
    },
  });
}

export async function countAllEmployee() {
  return await prisma.user.count({
    where: {
      role: "employee",
      deleted_at: null,
    },
  });
}
