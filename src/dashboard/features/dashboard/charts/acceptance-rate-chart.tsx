"use client";
import { ResponsiveLine, Serie } from "@nivo/line";

export const AcceptanceRateChart = (props: { data: Serie[] }) => (
  <ResponsiveLine
    data={props.data}
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
      tickSize: 10,
      tickPadding: 10,
      tickRotation: -45,
    }}
    axisLeft={{
      tickSize: 10,
      tickPadding: 10,
      tickRotation: 0,
    }}
    colors={{ scheme: "set2" }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    enableTouchCrosshair={true}
    useMesh={true}
  />
);
