"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { formatDate } from "../api-data";
import { useDashboardData } from "../dashboard-state";
import { Legend } from "./chat-legend";

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

      <CardContent className="min-h-[40vh] h-[40vh]">
        <BarChart />
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

export const BarChart = () => {
  const data = useData();
  return (
    <ResponsiveBar
      data={data}
      keys={["total_lines_accepted", "total_lines_suggested"]}
      indexBy="dayAndMonth"
      groupMode="grouped"
      margin={{ top: 10, right: 3, bottom: 35, left: 40 }}
      padding={0.3}
      enableLabel={false}
      colors={{ scheme: "nivo" }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -30,
        legendOffset: 62,
        truncateTickAt: 0,
      }}
    />
  );
};

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
      total_lines_accepted,
      total_lines_suggested,
      day,
      dayAndMonth: formatDate(day),
    };
  });

  return rates;
}
