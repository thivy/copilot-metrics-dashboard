"use client";
import { ResponsiveBar } from "@nivo/bar";
import { formatDate } from "../api-data";
import { useDashboardData } from "../dashboard-state";

export const AcceptanceCountChart = () => {
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
    const { total_lines_accepted, total_lines_suggested, day } = item;

    return {
      total_lines_accepted,
      total_lines_suggested,
      day,
      dayAndMonth: formatDate(day),
    };
  });

  return rates;
}
