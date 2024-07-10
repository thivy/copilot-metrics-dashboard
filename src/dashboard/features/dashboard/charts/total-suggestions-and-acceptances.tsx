"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "../dashboard-state";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartHeader } from "./chart-header";

export const TotalSuggestionsAndAcceptances = () => {
  const data = useData();
  const config = chartConfig();
  return (
    <Card className="col-span-4">
      <ChartHeader
        title="Total code suggestions and acceptance"
        description="The total number of Copilot code completion suggestions shown to users vs the total number of Copilot code completion suggestions accepted by users."
      />
      <CardContent>
        <ChartContainer config={config.config} className="w-full h-80">
          <AreaChart accessibilityLayer data={data}>
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
            <Area
              dataKey={config.totalSuggestionsCount}
              type="natural"
              fill="hsl(var(--chart-2))"
              stroke="hsl(var(--chart-2))"
            />
            <Area
              dataKey={config.totalAcceptancesCount}
              type="natural"
              fill="hsl(var(--chart-1))"
              stroke="hsl(var(--chart-1))"
              fillOpacity={0.6}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const chartConfig = () => {
  const totalAcceptancesCount: DataKey = "totalAcceptancesCount";
  const totalSuggestionsCount: DataKey = "totalSuggestionsCount";
  const timeFrameDisplay: DataKey = "timeFrameDisplay";

  const config = {
    [totalAcceptancesCount]: {
      label: "Total acceptances",
    },
    [totalSuggestionsCount]: {
      label: "Total suggestions",
    },
  } satisfies ChartConfig;

  return {
    config,
    timeFrameDisplay,
    totalAcceptancesCount,
    totalSuggestionsCount,
  };
};

interface Data {
  totalAcceptancesCount: number;
  totalSuggestionsCount: number;
  timeFrameDisplay: string;
}

type DataKey = keyof Data;

export function useData(): Data[] {
  const { filteredData: data } = useDashboard();
  const rates = data.map((item) => {
    let totalAcceptancesCount = 0;
    let totalSuggestionsCount = 0;

    item.breakdown.forEach((breakdown) => {
      totalAcceptancesCount += breakdown.acceptances_count;
      totalSuggestionsCount += breakdown.suggestions_count;
    });

    return {
      totalAcceptancesCount,
      totalSuggestionsCount,
      timeFrameDisplay: item.time_frame_display,
    };
  });

  return rates;
}
