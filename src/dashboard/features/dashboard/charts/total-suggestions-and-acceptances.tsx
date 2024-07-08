"use client";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "../api-data";
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
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDataOverflow
            />
            <XAxis
              dataKey={config.dayAndMonth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey={config.totalSuggestionsCount}
              fill="hsl(var(--chart-2))"
              radius={4}
            />
            <Bar
              dataKey={config.totalAcceptancesCount}
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
  const totalAcceptancesCount: DataKey = "totalAcceptancesCount";
  const totalSuggestionsCount: DataKey = "totalSuggestionsCount";
  const dayAndMonth: DataKey = "dayAndMonth";

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
    dayAndMonth,
    totalAcceptancesCount,
    totalSuggestionsCount,
  };
};

interface Data {
  totalAcceptancesCount: number;
  totalSuggestionsCount: number;
  day: string;
  dayAndMonth: string;
}

type DataKey = keyof Data;

export function useData(): Data[] {
  const { data } = useDashboardData();
  const rates = data.map((item) => {
    const { day } = item;

    let totalAcceptancesCount = 0;
    let totalSuggestionsCount = 0;

    item.breakdown.forEach((breakdown) => {
      totalAcceptancesCount += breakdown.acceptances_count;
      totalSuggestionsCount += breakdown.suggestions_count;
    });

    return {
      totalAcceptancesCount,
      totalSuggestionsCount,
      day,
      dayAndMonth: formatDate(day),
    };
  });

  return rates;
}
