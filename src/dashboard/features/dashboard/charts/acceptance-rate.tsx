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
  const data = useData();
  const xAxisLabel: DataKey = "completionAcceptanceRate";
  const yAxisLabel: DataKey = "dayAndMonth";

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Acceptance rate</CardTitle>
        <CardDescription>
          The ratio of accepted lines to the total lines suggested by GitHub
          Copilot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: -20,
              right: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={yAxisLabel}
              tickLine={false}
              axisLine={false}
              tickMargin={25}
              angle={-70}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              allowDataOverflow
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey={xAxisLabel}
              type="natural"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.4}
              stroke="hsl(var(--chart-1))"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const chartConfig = {
  completionAcceptanceRate: {
    label: "Acceptance rate (%) ",
  },
} satisfies ChartConfig;

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
