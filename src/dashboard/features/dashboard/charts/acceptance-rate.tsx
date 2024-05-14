"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ResponsiveLine, Serie } from "@nivo/line";
import { formatDate } from "../api-data";
import { useDashboardData } from "../dashboard-state";

export const AcceptanceRate = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Acceptance rate</CardTitle>
        <CardDescription>
          The ratio of accepted lines to the total lines suggested by GitHub
          Copilot
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[40dvh]">
        <AcceptanceRateChart></AcceptanceRateChart>
      </CardContent>
    </Card>
  );
};

export const AcceptanceRateChart = () => {
  const data = useData();
  return (
    <ResponsiveLine
      data={data}
      curve="catmullRom"
      margin={{ top: 10, right: 10, bottom: 40, left: 45 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      enableGridX={false}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 0,
      }}
      colors={{ scheme: "nivo" }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
    />
  );
};

function useData() {
  const { data } = useDashboardData();

  const rates = data.map((item) => {
    const { day } = item;

    let total_lines_accepted = 0;
    let total_lines_suggested = 0;

    item.breakdown.forEach((breakdown) => {
      total_lines_accepted += breakdown.lines_accepted;
      total_lines_suggested += breakdown.lines_suggested;
    });

    const completionAcceptanceRate =
      (total_lines_accepted / total_lines_suggested) * 100;
    return {
      completionAcceptanceRate: completionAcceptanceRate.toFixed(2),
      day,
      dayAndMonth: formatDate(day),
    };
  });

  const completion = rates.map((item) => {
    return {
      x: item.dayAndMonth,
      y: item.completionAcceptanceRate,
    };
  });

  const series: Serie[] = [
    {
      id: "completion",
      data: completion,
    },
  ];
  return series;
}
