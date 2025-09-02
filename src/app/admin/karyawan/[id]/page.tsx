import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { getEmployeeById } from "../queries";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/helper/date-helper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { EmployeeAttendancesStatistics } from "@/app/presensi/queries";
import { StatistikPresensiChart } from "./statistik-presensi-chart";

export default async function DetailEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  const userData = await getEmployeeById(id);

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <h1 className="text-2xl font-bold text-destructive">
          Data Pengguna tidak ditemukan.
        </h1>
      </div>
    );
  }

  const statistikPresensiData = await EmployeeAttendancesStatistics(id);

  return (
    <div className="relative">
      {/* <div className="absolute bg-gradient-to-tl from-primary to-primary/50 rounded-xl left-0 top-0 h-[30vh] w-full z-0"></div> */}

      <div className="relative z-10 flex flex-col md:flex-row gap-6 mb-6">
        <Card className="animate-in w-full md:w-72 fade-in duration-500">
          <CardContent className="space-y-8 z-10 relative">
            <div className="flex flex-col items-center">
              <Avatar className="h-36 w-36 border-4 border-accent shadow-lg">
                <AvatarImage
                  src={
                    ADMIN_URL! + userData.avatar ||
                    "/uploads/avatar/default-avatar.jpg"
                  }
                  alt={userData.name || "User Avatar"}
                />
                <AvatarFallback className="bg-muted text-muted-foreground text-4xl font-bold">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center mt-6">
                <h1 className="text-2xl font-bold leading-tight">
                  {userData.name}
                </h1>
                <p className="text-lg">{userData.username}</p>
                {userData.last_login && (
                  <p className="text-center text-sm text-muted-foreground">
                    Terakhir Login Pada {formatDate(userData.last_login)}
                  </p>
                )}
                <p className="text-muted-foreground mt-1 text-sm">
                  Akun Dibuat Pada {formatDate(userData.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="grow">
          <CardContent>
            <h1>Tabel Kehadiran</h1>
          </CardContent>
          {/* todo: mending disini tampilkan tabel untuk kehadiran karyawan na, untuk setiap tanggal */}
        </Card>
      </div>

      <div className="md:w-lg w-full">
        <StatistikPresensiChart data={statistikPresensiData} />
      </div>
    </div>
  );
}
