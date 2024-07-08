"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatDate } from "../api-data";
import { useDashboardData } from "../dashboard-state";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const AcceptanceRate = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Acceptance rate</CardTitle>
        <CardDescription>
          The ratio of accepted lines to the total lines suggested by GitHub
          Copilot
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <AcceptanceRateChart></AcceptanceRateChart>
      </CardContent>
    </Card>
  );
};

enum keys {
  date = "date",
  "completion acceptance rate" = "completion acceptance rate",
}

const chartConfig = {
  [keys.date]: {
    label: "date",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AcceptanceRateChart() {
  const data = useData();
  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: -20,
          right: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={keys.date}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey={keys["completion acceptance rate"]}
          type="natural"
          fill="var(--color-date)"
          fillOpacity={0.4}
          stroke="var(--color-date)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

function useData() {
  const { data } = useDashboardData();

  const rates = data.map((item) => {
    const { day } = item;

    let total_lines_accepted = 0;
    let total_lines_suggested = 0;

    item.breakdown.forEach((breakdown) => {
      total_lines_accepted += breakdown.lines_accepted;
      total_lines_suggested += breakdown.lines_suggested;
    });

    const completionAcceptanceRate =
      (total_lines_accepted / total_lines_suggested) * 100;
    return {
      completionAcceptanceRate: completionAcceptanceRate.toFixed(2),
      day,
      dayAndMonth: formatDate(day),
    };
  });

  const completion = rates.map((item) => {
    return {
      [keys.date]: item.dayAndMonth,
      [keys["completion acceptance rate"]]: item.completionAcceptanceRate,
    };
  });

  return completion;
}
