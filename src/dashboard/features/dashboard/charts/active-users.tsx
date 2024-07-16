"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "../dashboard-state";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CopilotUsageOutput } from "../services/copilot-metrics-service";
import { ChartHeader } from "./chart-header";

export const ActiveUsers = () => {
  const { filteredData } = useDashboard();
  const data = getActiveUsers(filteredData);

  return (
    <Card className="col-span-4">
      <ChartHeader
        title="Active Users"
        description="The total number active users per day using the chat and inline suggestions."
      />
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-80">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDataOverflow
            />
            <XAxis
              dataKey={chartConfig.timeFrameDisplay.key}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar
              dataKey={chartConfig.totalUsers.key}
              fill="hsl(var(--chart-2))"
              radius={4}
            />{" "}
            <Bar
              dataKey={chartConfig.totalChatUsers.key}
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

const chartConfig: Record<
  DataKey,
  {
    label: string;
    key: DataKey;
  }
> = {
  ["totalUsers"]: {
    label: "Total users",
    key: "totalUsers",
  },
  ["totalChatUsers"]: {
    label: "Total chat users",
    key: "totalChatUsers",
  },
  ["timeFrameDisplay"]: {
    label: "Time frame display",
    key: "timeFrameDisplay",
  },
};

interface Data {
  totalUsers: number;
  totalChatUsers: number;
  timeFrameDisplay: string;
}

type DataKey = keyof Data;

export function getActiveUsers(filteredData: CopilotUsageOutput[]): Data[] {
  const rates = filteredData.map((item) => {
    return {
      totalUsers: item.total_active_users,
      totalChatUsers: item.total_active_chat_users,
      timeFrameDisplay: item.time_frame_display,
    };
  });

  return rates;
}
