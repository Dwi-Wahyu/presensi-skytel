import NotFoundResource from "@/app/_components/not-found-resource";
import { getAttendanceById } from "../queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/helper/date-helper";
import {
  getClockInStatus,
  getClockOutStatus,
} from "@/helper/clock-status-helper";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { formatToHour } from "@/helper/hour-helper";
import { attendanceStatusMapping } from "@/constant/attendance-status-mapping";
import { BackButton } from "@/app/_components/navigation-button";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default async function AttendanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(parseInt(id))) {
    return <NotFoundResource />;
  }

  const attendance = await getAttendanceById(parseInt(id));

  if (!attendance) {
    return <NotFoundResource />;
  }

  const clockInStatus = await getClockInStatus(attendance.clock_in_at);
  const clockOutStatus = await getClockOutStatus(attendance.clock_out_at);

  return (
    <div className="container ">
      <div className="flex w-full justify-center">
        <div className="md:inline-flex absolute left-14 hidden ">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <IconChevronLeft />
            <span>Kembali</span>
          </Link>
        </div>
        <Card className="w-lg mx-auto">
          <CardHeader>
            <CardTitle>Detail Kehadiran</CardTitle>
            <CardDescription>
              Informasi lengkap kehadiran {attendance.user.name} pada tanggal{" "}
              {formatDate(attendance.date)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Tanggal</h1>
              <h1 className="text-muted-foreground">
                {formatDate(attendance.date)}
              </h1>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Clock In</h1>
              <div className="flex flex-col items-end">
                <h1 className="text-muted-foreground">
                  {formatToHour(attendance.clock_in_at)}
                </h1>
                <h1 className="text-muted-foreground text-sm">
                  {clockInStatus}
                </h1>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Clock Out</h1>
              <div className="flex flex-col items-end">
                <h1 className="text-muted-foreground">
                  {formatToHour(attendance.clock_out_at)}
                </h1>
                <h1 className="text-muted-foreground text-sm">
                  {clockOutStatus}
                </h1>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Status Kehadiran</h1>
              <h1 className="text-muted-foreground">
                {attendanceStatusMapping[attendance.status]}
              </h1>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Jam Lembur</h1>
              <h1 className="text-muted-foreground">
                {attendance.overtime_hours ?? "-"}
              </h1>
            </div>

            <div className="flex justify-center mt-2 gap-2">
              <BackButton />

              <Button asChild>
                <Link href={"/admin/kehadiran/edit/" + attendance.id}>
                  <Edit />
                  Edit Data
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
