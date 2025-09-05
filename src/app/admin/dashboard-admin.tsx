import DashboardCard from "../_components/dashboard-card";
import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { IconQrcode, IconUsers, IconUserScan } from "@tabler/icons-react";
import { countAllEmployee, getAllEmployee } from "./karyawan/queries";
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
import {
  getTodayAttendanceDataForDashboard,
  getTopTenEmployeesByAttendance,
} from "./kehadiran/queries";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatToHour } from "@/helper/hour-helper";
import { AdminNotificationSection } from "./admin-notification-section";
import { countAllNotifications, getNotifications } from "../notifikasi/queries";
import { getPendingPermissionCount } from "./pengajuan-izin/queries";

export async function DashboardAdmin() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const employeeTotal = await countAllEmployee();

  const pendingPermissionCount = await getPendingPermissionCount();

  const topTenEmployeeByAttendance = await getTopTenEmployeesByAttendance();

  const {
    recentAttendanceToday,
    notPresentEmployeeToday,
    presentEmployeeToday,
  } = await getTodayAttendanceDataForDashboard();

  const recentNotifications = await getNotifications(session.user.id, 3);

  const totalNotifications = await countAllNotifications(session.user.id);

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <div>
      <div className="grid mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Karyawan"
          value={employeeTotal.toString()}
          icon={<IconUsers width={48} height={48} />}
        />

        <DashboardCard
          title="Telah Presensi"
          value={presentEmployeeToday.toString()}
          icon={<ScanText width={48} height={48} />}
        />

        <DashboardCard
          title="Belum Presensi"
          value={notPresentEmployeeToday.toString()}
          icon={<ScanLine width={48} height={48} />}
        />

        <DashboardCard
          title="Pengajuan Izin"
          value={pendingPermissionCount.toString()}
          icon={<Mails width={48} height={48} />}
        />
      </div>

      <div className="flex flex-col md:flex-row w-full mb-7">
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
          {recentAttendanceToday.length !== 0 ? (
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recentAttendanceToday.map((attendance, idx) => {
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
          ) : (
            <CardContent className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <IconUserScan className="w-16 h-16" />
              <p className="mt-2 text-sm">
                Belum Ada Karyawan Yang Melakukan Presensi Hari Ini.
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-6 mb-7 items-stretch">
        <Link
          className="flex min-w-[25vw] flex-col gap-2 justify-center w-full border items-center bg-gradient-to-tr from-primary to-primary/60 p-10 md:w-fit rounded-2xl hover:scale-105  duration-300 transition-all ease-in-out shadow-lg text-white"
          href={"/admin/qrcode"}
        >
          <h1 className="font-semibold text-lg">Tampilkan QR Code</h1>
          <IconQrcode className="w-16 h-16" />
          <h1 className="text-sm">Untuk Mencatat Kehadiran</h1>
        </Link>

        <AdminNotificationSection
          notifications={recentNotifications}
          user_id={session.user.id}
          total={totalNotifications}
          show_all_notifications_button
        />
      </div>

      <TopTenEmployeeChart data={topTenEmployeeByAttendance} />
    </div>
  );
}
