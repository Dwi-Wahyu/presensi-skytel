"server only";

import { attendanceStatusMapping } from "@/constant/attendance-status-mapping";
import { prisma } from "@/lib/prisma";

export async function EmployeeAttendancesStatistics(user_id: string) {
  const userData = await prisma.user.findFirst({
    where: {
      id: user_id,
    },
  });

  if (!userData) {
    return [];
  }

  const attendanceStatistics = await prisma.attendance.groupBy({
    by: ["status"],
    where: {
      user_id: user_id,
    },
    _count: {
      _all: true,
    },
  });

  const formattedStatistics = attendanceStatistics.map((item) => ({
    status: attendanceStatusMapping[item.status] || item.status,
    count: item._count._all,
  }));

  return formattedStatistics;
}
