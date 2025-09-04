import DashboardCard from "../_components/dashboard-card";
import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { IconQrcode, IconUsers } from "@tabler/icons-react";
import { getAllEmployee } from "./karyawan/queries";
import Link from "next/link";
import { Mails, ScanLine, ScanText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopTenEmployeeChart } from "./top-ten-employee-chart";
import { getTopTenEmployeesByAttendance } from "./kehadiran/queries";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatToHour } from "@/helper/hour-helper";
import { AdminNotificationSection } from "./admin-notification-section";
import { getNotifications } from "../notifikasi/queries";

export async function DashboardAdmin() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const allEmployee = await getAllEmployee();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const topTenEmployeeByAttendance = await getTopTenEmployeesByAttendance();

  const recentAttendance = await prisma.attendance.findMany({
    take: 6,
    where: {
      OR: [{ clock_in_at: { not: null } }, { clock_out_at: { not: null } }],
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

  const recentNotifications = await getNotifications(session.user.id, 5);

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <div>
      <div className="grid mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Karyawan"
          value={allEmployee.length.toString()}
          icon={<IconUsers width={48} height={48} />}
        />

        <DashboardCard
          title="Telah Presensi"
          value={"20"}
          icon={<ScanText width={48} height={48} />}
        />

        <DashboardCard
          title="Belum Presensi"
          value={"20"}
          icon={<ScanLine width={48} height={48} />}
        />

        <DashboardCard
          title="Permohonan Izin"
          value={"4"}
          icon={<Mails width={48} height={48} />}
        />
      </div>

      <div className="flex flex-col md:flex-row w-full gap-6 mb-6 items-stretch">
        <Link
          className="flex flex-col gap-2 justify-center w-full border items-center bg-gradient-to-tr from-primary to-primary/60 p-10 md:w-fit rounded-2xl hover:scale-105  duration-300 transition-all ease-in-out shadow-lg text-white"
          href={"/admin/qrcode"}
        >
          <h1 className="font-semibold text-lg">Tampilkan QR Code</h1>
          <IconQrcode className="w-16 h-16" />
          <h1 className="text-sm">Untuk Mencatat Kehadiran</h1>
        </Link>

        <Card className="grow">
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Presensi Terbaru</CardTitle>
              <CardDescription>
                Daftar karyawan yang baru saja melakukan presensi hari ini
              </CardDescription>
            </div>

            <Link passHref href={"/admin/kehadiran"}>
              <Button variant={"link"} className="p-0">
                Selengkapnya
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentAttendance.map((attendance, idx) => {
              const avatarUrl = ADMIN_URL! + attendance.user.avatar;

              return (
                <div key={idx} className="flex gap-2 items-center">
                  <img
                    className="rounded-lg"
                    src={avatarUrl}
                    alt="User Avatar"
                    width={50}
                    height={50}
                  />

                  <div className="">
                    <h1 className="font-semibold">{attendance.user.name}</h1>

                    <div className="flex gap-2">
                      <Badge variant={"outline"}>
                        {attendance.clock_out_at === null
                          ? "Clock In"
                          : "Clock Out"}
                      </Badge>

                      <Badge variant={"outline"}>
                        {attendance.clock_out_at === null ? (
                          <>{formatToHour(attendance.clock_in_at)}</>
                        ) : (
                          <>{formatToHour(attendance.clock_out_at)}</>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <AdminNotificationSection notifications={recentNotifications} />

      <TopTenEmployeeChart data={topTenEmployeeByAttendance} />
    </div>
  );
}
