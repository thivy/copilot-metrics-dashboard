"use client";
import { Card, CardContent } from "@/components/ui/card";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatDate } from "../api-data";
import { useDashboardData } from "../dashboard-state";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartHeader } from "./chart-header";

export const AcceptanceRate = () => {
  const data = useData();
  const config = chartConfig();

  return (
    <Card className="col-span-4">
      <ChartHeader
        title="Acceptance rate"
        description=" The ratio of accepted lines to the total lines suggested by GitHub
          Copilot"
      />

      <CardContent>
        <ChartContainer config={config.config} className="h-80 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: -20,
              right: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={config.completionAcceptanceRate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              dataKey={config.dayAndMonth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDataOverflow
              domain={[0, 100]}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Area
              dataKey={config.completionAcceptanceRate}
              type="natural"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const chartConfig = () => {
  const completionAcceptanceRate: DataKey = "completionAcceptanceRate";
  const day: DataKey = "day";
  const dayAndMonth: DataKey = "dayAndMonth";

  const config = {
    completionAcceptanceRate: {
      label: "Acceptance rate (%) ",
    },
  } satisfies ChartConfig;

  return {
    config,
    dayAndMonth,
    completionAcceptanceRate,
    day,
  };
};

interface Data {
  day: string;
  completionAcceptanceRate: number;
  dayAndMonth: string;
}

type DataKey = keyof Data;

function useData(): Data[] {
  const { data } = useDashboardData();

  const rates = data.map((item) => {
    const { day } = item;

    const rate =
      item.total_lines_suggested !== 0
        ? (item.total_lines_accepted / item.total_lines_suggested) * 100
        : 0;

    return {
      completionAcceptanceRate: parseFloat(rate.toFixed(2)),
      day,
      dayAndMonth: formatDate(day),
    };
  });

  return rates;
}
