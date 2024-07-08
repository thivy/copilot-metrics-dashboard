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
export const TotalCodeLineSuggestionsAndAcceptances = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Total code lines suggestions and acceptances</CardTitle>
        <CardDescription className="text-xs">
          The total number of lines of code completions suggested by Copilot vs
          the total number of lines of code completions accepted by users.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <TotalCodeLineSuggestionsAndAcceptancesChart />
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 py-2 text-xs">
          <Legend name="Lines suggested" className="bg-[#F47560]" />
          <Legend name="Lines accepted" className="bg-[#E8C1A0]" />
        </div>
      </CardFooter>
    </Card>
  );
};

const chartConfig = {
  desktop: {
    label: "total lines accepted",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "total lines suggested",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TotalCodeLineSuggestionsAndAcceptancesChart() {
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
          dataKey="total lines accepted"
          fill="var(--color-desktop)"
          radius={4}
        />
        <Bar
          dataKey="total lines suggested"
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

    let total_lines_accepted = 0;
    let total_lines_suggested = 0;

    item.breakdown.forEach((breakdown) => {
      total_lines_accepted += breakdown.lines_accepted;
      total_lines_suggested += breakdown.lines_suggested;
    });

    return {
      "total lines accepted": total_lines_accepted,
      "total lines suggested": total_lines_suggested,
      day,
      dayAndMonth: formatDate(day),
    };
  });

  return rates;
}
