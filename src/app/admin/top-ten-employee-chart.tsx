"use client";

import { Crown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getTopTenEmployeesByAttendance } from "./kehadiran/queries";
import { Button } from "@/components/ui/button";

type TopTenAttendanceData = Awaited<
  ReturnType<typeof getTopTenEmployeesByAttendance>
>;

export function TopTenEmployeeChart({ data }: { data: TopTenAttendanceData }) {
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <Card className="hidden md:flex mt-7">
      <CardHeader className="flex justify-between items-center flex-col md:flex-row">
        <div>
          <CardTitle>Peringkat Karyawan Paling Rajin</CardTitle>
          <CardDescription>
            Diurutkan berdasarkan jumlah kehadiran.
          </CardDescription>
        </div>

        {/* <div className="flex gap-2 items-center">
          <Button variant={"outline"}>Bulan Ini</Button>
          <Button variant={"default"}>Keseluruhan</Button>
        </div> */}
      </CardHeader>
      <CardContent className="flex gap-3 w-full">
        <div className="grid grid-cols-10 w-full place-items-end gap-5">
          {data.map((employee, idx) => (
            <div key={idx}>
              <div
                style={{ height: `${(10 - idx + 1) * 100}px` }}
                className="shadow relative bg-gradient-to-t mt-2 from-primary to-primary/50 flex flex-col items-center rounded-lg w-full p-3 text-white"
              >
                {idx === 0 && (
                  <Crown className="absolute -top-5 -right-5 rotate-45 text-primary" />
                )}

                <img
                  className="rounded-lg mb-1"
                  src={ADMIN_URL! + employee.avatar}
                  alt="User Avatar"
                />

                <h1 className="text-center font-semibold text-sm mb-1">
                  {employee.name}
                </h1>

                {/* <h1 className="font-semibold mt-1 text-sm">
                  {employee.attendanceCount}
                </h1> */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
