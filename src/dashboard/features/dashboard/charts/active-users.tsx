"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "../dashboard-state";

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
              dataKey={config.timeFrameDisplay}
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
  const timeFrameDisplay: DataKey = "timeFrameDisplay";

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
    timeFrameDisplay,
    totalUsers,
    totalChatUsers,
  };
};

interface Data {
  totalUsers: number;
  totalChatUsers: number;
  timeFrameDisplay: string;
}

type DataKey = keyof Data;

export function useData(): Data[] {
  const { filteredData } = useDashboard();

  const rates = filteredData.map((item) => {
    let totalUsers = item.total_active_users;
    let totalChatUsers = item.total_active_chat_users;

    return {
      totalUsers: totalUsers,
      totalChatUsers: totalChatUsers,
      timeFrameDisplay: item.time_frame_display,
    };
  });

  return rates;
}
