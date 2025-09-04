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
import { getWorkDurationData } from "./queries";

export const description = "A bar chart with a label";

const chartConfig = {
  workDuration: {
    label: "Durasi Kerja",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function WorkDurationChart({
  data,
}: {
  data: Awaited<ReturnType<typeof getWorkDurationData>>;
}) {
  return (
    <Card className="mt-7">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Statistik Jam Kerja</CardTitle>
          <CardDescription>Senin - Jumat</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
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
        {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
      </CardFooter>
    </Card>
  );
}
