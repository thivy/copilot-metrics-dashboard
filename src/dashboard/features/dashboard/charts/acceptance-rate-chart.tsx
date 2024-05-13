"use client";
import { ResponsiveLine, Serie } from "@nivo/line";
import { useDashboardData } from "../dashboard-state";

export const AcceptanceRateChart = () => {
  const data = useData();
  return (
    <ResponsiveLine
      data={data}
      curve="catmullRom"
      margin={{ top: 40, right: 10, bottom: 80, left: 45 }}
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
    const { total_lines_accepted, total_lines_suggested, day } = item;
    const completionAcceptanceRate =
      Math.round((total_lines_accepted / total_lines_suggested) * 100 * 100) /
      100;
    return {
      completionAcceptanceRate,
      day,
    };
  });
  const completion = rates.map((item) => {
    return {
      x: item.day,
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
