"use client";
import { Card, CardContent } from "@/components/ui/card";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDashboard } from "../dashboard-state";

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
              dataKey={config.acceptanceRate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDataOverflow
              domain={[0, 100]}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Area
              dataKey={config.acceptanceRate}
              type="linear"
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
  const acceptanceRate: DataKey = "acceptanceRate";
  const timeFrameDisplay: DataKey = "timeFrameDisplay";

  const config = {
    acceptanceRate: {
      label: "Acceptance rate (%) ",
    },
  } satisfies ChartConfig;

  return {
    config,
    timeFrameDisplay,
    acceptanceRate,
  };
};

interface Data {
  acceptanceRate: number;
  timeFrameDisplay: string;
}

type DataKey = keyof Data;

function useData(): Data[] {
  const { filteredData } = useDashboard();

  const rates = filteredData.map((item) => {
    const rate =
      item.total_lines_suggested !== 0
        ? (item.total_lines_accepted / item.total_lines_suggested) * 100
        : 0;

    return {
      acceptanceRate: parseFloat(rate.toFixed(2)),
      timeFrameDisplay: item.time_frame_display,
    };
  });

  return rates;
}
