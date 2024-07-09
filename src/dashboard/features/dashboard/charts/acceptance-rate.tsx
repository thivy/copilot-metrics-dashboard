"use client";
import { Card, CardContent } from "@/components/ui/card";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Trend } from "../copilot-metrics-service";
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
              dataKey={config.timeFrameDisplay}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              dataKey={config.completionAcceptanceRate}
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
  const timeFrameDisplay: DataKey = "timeFrameDisplay";

  const config = {
    completionAcceptanceRate: {
      label: "Acceptance rate (%) ",
    },
  } satisfies ChartConfig;

  return {
    config,
    timeFrameDisplay,
    completionAcceptanceRate,
  };
};

interface Data {
  // day: string;
  completionAcceptanceRate: number;
  timeFrameDisplay: string;
}

type DataKey = keyof Data;

function useData(): Data[] {
  const { data } = useDashboardData();

  const rates = data.map((item) => {
    const rate =
      item.total_lines_suggested !== 0
        ? (item.total_lines_accepted / item.total_lines_suggested) * 100
        : 0;

    return {
      completionAcceptanceRate: parseFloat(rate.toFixed(2)),
      timeFrameDisplay: item.time_frame_display,
    };
  });

  return rates;
}

export const useCompletionAverage = () => {
  const { data } = useDashboardData();
  let sum = 0;
  let trend: Trend = "up";
  let lastValue = 0;

  const rates = data.map((item) => {
    let total_lines_accepted = 0;
    let total_lines_suggested = 0;

    item.breakdown.forEach((breakdown) => {
      const { lines_accepted, lines_suggested } = breakdown;
      total_lines_accepted += lines_accepted;
      total_lines_suggested += lines_suggested;
    });

    const completionAcceptanceRate =
      total_lines_suggested !== 0
        ? (total_lines_accepted / total_lines_suggested) * 100
        : 0;

    trend = completionAcceptanceRate < lastValue ? "down" : "up";

    sum += completionAcceptanceRate;

    lastValue = completionAcceptanceRate;
    return {
      completionAcceptanceRate,
    };
  });

  return { average: sum / rates.length, trend };
};
