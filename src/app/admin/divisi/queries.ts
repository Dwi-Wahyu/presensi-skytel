"server only";

import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
    },
  });
}

export async function getDivisionById(id: string) {
  return await prisma.division.findFirst({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      leader: {
        select: {
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getAllDivisions(limit?: number) {
  if (limit) {
    return await prisma.division.findMany({
      take: limit,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        leader: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  return await prisma.division.findMany({
    include: {
      users: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
      leader: {
        select: {
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
}
