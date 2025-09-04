"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Attendance } from "@/app/generated/prisma";
import { formatDate } from "@/helper/date-helper";
import { IconCheck, IconX } from "@tabler/icons-react";
import { AlarmClockOff, ClockPlus, Mail } from "lucide-react";
import { attendanceStatusMapping } from "@/constant/attendance-status-mapping";
import { formatToHour } from "@/helper/hour-helper";

export function HistoryPresensiClient({
  attendances,
}: {
  attendances: Attendance[];
}) {
  return (
    <ScrollArea className="h-[55vh]">
      {attendances.map((attendance, idx) => (
        <div
          key={idx}
          className="p-3 border justify-between flex items-center mx-6 border-primary mb-4 first:mt-6 gap-2 rounded-lg shadow"
        >
          <div>
            <h1 className=" font-semibold">{formatDate(attendance.date)}</h1>

            {attendance.status === "ATTEND" ? (
              <h1 className="">
                {formatToHour(attendance.clock_in_at)} -{" "}
                {formatToHour(attendance.clock_out_at)}{" "}
              </h1>
            ) : (
              <h1>-</h1>
            )}
          </div>

          <Badge
            variant={attendance.status === "ATTEND" ? "default" : "destructive"}
          >
            {attendance.status === "ATTEND" && <IconCheck />}

            {attendance.status === "ABSENT" && <IconX />}

            {attendance.status === "EXCUSED" && <Mail />}

            {attendanceStatusMapping[attendance.status]}
          </Badge>
        </div>
      ))}
    </ScrollArea>
  );
}
