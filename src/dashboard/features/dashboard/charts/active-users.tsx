"use client";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "../copilot-metrics-service";
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

export const ActiveUsers = () => {
  const data = useData();
  const config = chartConfig();

  return (
    <Card className="col-span-4">
      <ChartHeader
        title="Active Users"
        description="The total number active users per day using the chat and inline suggestions."
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
              dataKey={config.dayAndMonth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar
              dataKey={config.totalUsers}
              fill="hsl(var(--chart-2))"
              radius={4}
            />{" "}
            <Bar
              dataKey={config.totalChatUsers}
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
  const totalUsers: DataKey = "totalUsers";
  const totalChatUsers: DataKey = "totalChatUsers";
  const dayAndMonth: DataKey = "dayAndMonth";

  const config = {
    [totalUsers]: {
      label: "Total users",
    },
    [totalChatUsers]: {
      label: "Total chat users",
    },
  } satisfies ChartConfig;

  return {
    config,
    dayAndMonth,
    totalUsers,
    totalChatUsers,
  };
};

interface Data {
  totalUsers: number;
  totalChatUsers: number;
  day: string;
  dayAndMonth: string;
}

type DataKey = keyof Data;

export function useData(): Data[] {
  const { data } = useDashboardData();

  const rates = data.map((item) => {
    const { day } = item;

    let totalUsers = item.total_active_users;
    let totalChatUsers = item.total_active_chat_users;

    return {
      totalUsers,
      totalChatUsers,
      day,
      dayAndMonth: formatDate(day),
    };
  });

  return rates;
}
