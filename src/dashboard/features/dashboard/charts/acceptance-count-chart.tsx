"use client";
import { BarDatum, ResponsiveBar } from "@nivo/bar";

export const AcceptanceCountChart = (props: { data: BarDatum[] }) => {
  console.log(props.data);
  return (
    <div>
      day
      <ResponsiveBar
        data={props.data}
        keys={["total_lines_accepted", "total_lines_suggested"]}
        indexBy="day"
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
      qweqwewe
    </div>
  );
};
