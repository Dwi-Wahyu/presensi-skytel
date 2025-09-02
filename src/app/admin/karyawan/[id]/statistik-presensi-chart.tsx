"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EmployeeAttendancesStatistics } from "@/app/presensi/queries";

const colors: Record<string, string> = {
  Hadir: "var(--chart-1)",
  "Tidak Hadir": "var(--chart-2)",
  Izin: "var(--chart-3)",
  Terlambat: "var(--chart-4)",
  Lembur: "var(--chart-5)",
};

export function StatistikPresensiChart({
  data,
}: {
  data: Awaited<ReturnType<typeof EmployeeAttendancesStatistics>>;
}) {
  const formattedData = data.map((item) => ({
    ...item,
    fill: colors[item.status] || "var(--chart-1)",
  }));

  const chartConfig: ChartConfig = {
    count: { label: "Jumlah" },
    Hadir: { label: "Hadir", color: "var(--chart-1)" },
    "Tidak Hadir": { label: "Tidak Hadir", color: "var(--chart-2)" },
    Izin: { label: "Izin", color: "var(--chart-3)" },
    Terlambat: { label: "Terlambat", color: "var(--chart-4)" },
    Lembur: { label: "Lembur", color: "var(--chart-5)" },
  };

  return (
    <Card className="flex flex-col  relative">
      <CardHeader className="flex-row items-start justify-between pb-0 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Statistik Kehadiran</CardTitle>
          <CardDescription>Status kehadiran keseluruhan</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex absolute top-6 right-6 flex-col items-end gap-2 text-sm text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">Hadir</span>
            <div className="w-4 h-4 bg-chart-1"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">Tidak Hadir</span>
            <div className="w-4 h-4 bg-chart-2"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">Izin</span>
            <div className="w-4 h-4 bg-chart-3"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">Terlambat</span>
            <div className="w-4 h-4 bg-chart-4"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">Lembur</span>
            <div className="w-4 h-4 bg-chart-5"></div>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="status" hideLabel />}
            />
            {/* Menggunakan formattedData yang sudah memiliki properti fill */}
            <Pie data={formattedData} dataKey="count" nameKey="status" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
