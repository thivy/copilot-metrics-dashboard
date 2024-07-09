"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardData } from "../dashboard-state";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartHeader } from "./chart-header";

export const TotalCodeLineSuggestionsAndAcceptances = () => {
  const data = useData();
  const config = chartConfig();

  return (
    <Card className="col-span-4">
      <ChartHeader
        title="Total code lines suggestions and acceptances"
        description="The total number of lines of code completions suggested by Copilot vs the total number of lines of code completions accepted by users."
      />
      <CardContent>
        <ChartContainer config={config.config} className="w-full h-80">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDataOverflow
            />
            <XAxis
              dataKey={config.timeFrameDisplay}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar
              dataKey={config.totalLinesSuggested}
              fill="hsl(var(--chart-2))"
              radius={4}
            />{" "}
            <Bar
              dataKey={config.totalLinesAccepted}
              fill="hsl(var(--chart-1))"
              radius={4}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const chartConfig = () => {
  const totalLinesAccepted: DataKey = "totalLinesAccepted";
  const totalLinesSuggested: DataKey = "totalLinesSuggested";
  const timeFrameDisplay: DataKey = "timeFrameDisplay";

  const config = {
    [totalLinesAccepted]: {
      label: "Total lines accepted",
    },
    [totalLinesSuggested]: {
      label: "Total lines suggested",
    },
  } satisfies ChartConfig;

  return {
    config,
    timeFrameDisplay,
    totalLinesAccepted,
    totalLinesSuggested,
  };
};

interface Data {
  totalLinesAccepted: number;
  totalLinesSuggested: number;
  timeFrameDisplay: string;
}

type DataKey = keyof Data;

export function useData(): Data[] {
  const { data } = useDashboardData();
  const rates = data.map((item) => {
    let total_lines_accepted = 0;
    let total_lines_suggested = 0;

    item.breakdown.forEach((breakdown) => {
      total_lines_accepted += breakdown.lines_accepted;
      total_lines_suggested += breakdown.lines_suggested;
    });

    return {
      totalLinesAccepted: total_lines_accepted,
      totalLinesSuggested: total_lines_suggested,
      timeFrameDisplay: item.time_frame_display,
    };
  });

  return rates;
}
