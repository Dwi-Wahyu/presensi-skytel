import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import {
  IconCircleDashedCheck,
  IconClipboardData,
  IconDoorEnter,
  IconDoorExit,
  IconDownload,
  IconHome,
} from "@tabler/icons-react";
import { getEmployeeAttendancesToday } from "./actions";
import Link from "next/link";

export default async function SuksesPresensi({
  attendance,
}: {
  attendance: NonNullable<
    Awaited<ReturnType<typeof getEmployeeAttendancesToday>>
  >;
}) {
  return (
    <div className="w-full relative min-h-svh bg-primary text-primary-foreground p-6 md:p-10 flex flex-col justify-center">
      <div className="flex w-full justify-between absolute top-0 left-0 p-6">
        <Button asChild variant={"outline"} size={"lg"}>
          <Link href={"/home"}>
            <IconHome />
          </Link>
        </Button>
        <Button asChild variant={"outline"} size={"lg"}>
          <Link href={"/presensi/history"}>
            <IconClipboardData />
          </Link>
        </Button>
      </div>

      <div className="flex justify-center mb-10 x items-center w-full">
        <div className="p-5 bg-card rounded-full shadow-lg">
          <IconCircleDashedCheck
            width={100}
            height={100}
            className="text-primary"
          />
        </div>
      </div>
      <Card className="shadow-lg">
        <CardContent className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold text-center">
            Berhasil Mencatat Presensi
          </h1>

          <div>
            <h1 className="font-semibold">Tanggal</h1>
            <h1 className="text-muted-foreground">
              {formatDate(attendance.date)}
            </h1>
          </div>

          <Separator />

          <div>
            <h1 className="font-semibold mb-2">Riwayat Presensi Hari Ini</h1>
            <div className="flex gap-2 mb-3">
              <Badge variant={"outline"}>
                <IconDoorEnter />
                Clock In
              </Badge>
              <h1 className="text-muted-foreground">
                {attendance.clock_in_at}
              </h1>
            </div>
            <div className="flex gap-2">
              <Badge variant={"outline"}>
                <IconDoorExit />
                Clock Out
              </Badge>
              <h1 className="text-muted-foreground">
                {attendance.clock_out_at}
              </h1>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Button size={"lg"}>
              <IconDownload />
              Download Bukti
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
