"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "../api-data";
import { useDashboardData } from "../dashboard-state";
import { Legend } from "./chat-legend";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const TotalSuggestionsAndAcceptances = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Total code suggestions and acceptance</CardTitle>
        <CardDescription>
          The total number of Copilot code completion suggestions shown to users
          vs the total number of Copilot code completion suggestions accepted by
          users.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <TotalSuggestionsAndAcceptancesChart />
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 py-2 text-xs">
          <Legend name="Code suggested" className="bg-[#F47560]" />
          <Legend name="Code accepted" className="bg-[#E8C1A0]" />
        </div>
      </CardFooter>
    </Card>
  );
};

const chartConfig = {
  desktop: {
    label: "total acceptances count",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "total suggestions count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TotalSuggestionsAndAcceptancesChart() {
  const data = useData();
  return (
    <ChartContainer config={chartConfig} className="w-full h-80">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar
          dataKey="total acceptances count"
          fill="var(--color-desktop)"
          radius={4}
        />
        <Bar
          dataKey="total suggestions count"
          fill="var(--color-mobile)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function useData() {
  const { data } = useDashboardData();
  const rates = data.map((item) => {
    const { day } = item;

    let total_acceptances_count = 0;
    let total_suggestions_count = 0;

    item.breakdown.forEach((breakdown) => {
      total_acceptances_count += breakdown.acceptances_count;
      total_suggestions_count += breakdown.suggestions_count;
    });

    return {
      "total acceptances count": total_acceptances_count,
      "total suggestions count": total_suggestions_count,
      day,
      dayAndMonth: formatDate(day),
    };
  });

  return rates;
}
