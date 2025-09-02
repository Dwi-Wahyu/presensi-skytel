"use client";

import { AlertCircle, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

export const description = "A bar chart with a label";

// Fungsi untuk menghitung total menit dari jam masuk dan keluar
const calculateWorkDuration = (clockIn: string, clockOut: string): number => {
  const [inHour, inMinute] = clockIn.split(":").map(Number);
  const [outHour, outMinute] = clockOut.split(":").map(Number);
  const totalMinutes = outHour * 60 + outMinute - (inHour * 60 + inMinute);
  return totalMinutes;
};

// Data yang telah diolah
const chartData = [
  {
    month: "Senin",
    clockIn: "08:42",
    clockOut: "16:10",
    workDuration: calculateWorkDuration("08:42", "16:10"),
  },
  {
    month: "Selasa",
    clockIn: "08:23",
    clockOut: "16:32",
    workDuration: calculateWorkDuration("08:23", "16:32"),
  },
  {
    month: "Rabu",
    clockIn: "08:16",
    clockOut: "16:43",
    workDuration: calculateWorkDuration("08:16", "16:43"),
  },
  {
    month: "Kamis",
    clockIn: "08:27",
    clockOut: "16:23",
    workDuration: calculateWorkDuration("08:27", "16:23"),
  },
  {
    month: "Jumat",
    clockIn: "08:01",
    clockOut: "16:44",
    workDuration: calculateWorkDuration("08:01", "16:44"),
  },
];

const chartConfig = {
  workDuration: {
    label: "Durasi Kerja",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function JamKerjaChart() {
  return (
    <Card className="mt-7">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Statistik Jam Kerja</CardTitle>
          <CardDescription>Senin - Jumat</CardDescription>
        </div>

        <div className="text-sm flex items-center text-muted-foreground gap-1">
          <AlertCircle width={15} height={15} />
          <h1>Belum valid</h1>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            /> */}
            <Bar dataKey="workDuration" fill="var(--color-chart-1)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) =>
                  `${Math.floor(value / 60)}j ${value % 60}m`
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
