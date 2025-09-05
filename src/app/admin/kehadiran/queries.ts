"server only";

import { AttendanceStatus, Prisma, Role } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";
import { AttendanceSearchParamsType } from "@/validations/search-params/attendance-search-params";
import { countAllEmployee } from "../karyawan/queries";

export async function getAttendancesData(input: AttendanceSearchParamsType) {
  type AttendanceWhereClause = Prisma.AttendanceWhereInput;
  let attendanceWhereClause: AttendanceWhereClause = {
    date: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)),
      lte: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  };

  if (input.date) {
    attendanceWhereClause["date"] = {
      gte: new Date(new Date(input.date).setHours(0, 0, 0, 0)),
      lte: new Date(new Date(input.date).setHours(23, 59, 59, 999)),
    };
  }

  if (input.nama) {
    attendanceWhereClause["user"] = {
      name: { contains: input.nama },
    };
  }

  const filtered = await prisma.attendance.count({
    where: attendanceWhereClause,
  });

  const data = await prisma.attendance.findMany({
    take: input.perPage,
    skip: (input.page - 1) * input.perPage,
    where: attendanceWhereClause,
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

export async function getAttendanceById(id: number) {
  const attendance = await prisma.attendance.findUnique({
    where: { id, user: { deleted_at: null } },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return attendance;
}

export async function getAllAttendance() {
  return await prisma.attendance.findMany({
    where: {
      user: {
        deleted_at: null,
      },
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

export async function getTopTenEmployeesByAttendance() {
  const topEmployees = await prisma.attendance.groupBy({
    by: ["user_id"],
    where: {
      status: AttendanceStatus.ATTEND,
    },
    _count: {
      status: true,
    },
    orderBy: {
      _count: {
        status: "desc",
      },
    },
    take: 10,
  });

  const userIds = topEmployees.map((e) => e.user_id);
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  });

  const result = topEmployees.map((e) => {
    const user = users.find((u) => u.id === e.user_id);
    return {
      name: user?.name,
      attendanceCount: e._count.status,
      avatar: user?.avatar,
    };
  });

  return result;
}

export async function getTodayAttendanceDataForDashboard() {
  const recentAttendanceToday = await prisma.attendance.findMany({
    take: 6,
    where: {
      OR: [{ clock_in_at: { not: null } }, { clock_out_at: { not: null } }],
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
    orderBy: {
      date: "desc",
    },
    include: {
      user: {
        select: {
          avatar: true,
          name: true,
        },
      },
    },
  });

  const employeeTotal = await countAllEmployee();

  const presentEmployeeToday = await prisma.attendance.count({
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      status: "ATTEND",
    },
  });

  const notPresentEmployeeToday = employeeTotal - presentEmployeeToday;

  return {
    recentAttendanceToday,
    presentEmployeeToday,
    notPresentEmployeeToday,
  };
}
