"use client";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "japan",
    color: "hsl(348, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 272,
      },
      {
        x: "helicopter",
        y: 149,
      },
      {
        x: "boat",
        y: 0,
      },
      {
        x: "train",
        y: 121,
      },
      {
        x: "subway",
        y: 242,
      },
      {
        x: "bus",
        y: 29,
      },
      {
        x: "car",
        y: 125,
      },
      {
        x: "moto",
        y: 130,
      },
      {
        x: "bicycle",
        y: 124,
      },
      {
        x: "horse",
        y: 292,
      },
      {
        x: "skateboard",
        y: 4,
      },
      {
        x: "others",
        y: 232,
      },
    ],
  },
  {
    id: "france",
    color: "hsl(359, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 112,
      },
      {
        x: "helicopter",
        y: 55,
      },
      {
        x: "boat",
        y: 241,
      },
      {
        x: "train",
        y: 136,
      },
      {
        x: "subway",
        y: 281,
      },
      {
        x: "bus",
        y: 108,
      },
      {
        x: "car",
        y: 92,
      },
      {
        x: "moto",
        y: 14,
      },
      {
        x: "bicycle",
        y: 30,
      },
      {
        x: "horse",
        y: 15,
      },
      {
        x: "skateboard",
        y: 46,
      },
      {
        x: "others",
        y: 168,
      },
    ],
  },
  {
    id: "us",
    color: "hsl(286, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 128,
      },
      {
        x: "helicopter",
        y: 295,
      },
      {
        x: "boat",
        y: 78,
      },
      {
        x: "train",
        y: 211,
      },
      {
        x: "subway",
        y: 71,
      },
      {
        x: "bus",
        y: 295,
      },
      {
        x: "car",
        y: 244,
      },
      {
        x: "moto",
        y: 2,
      },
      {
        x: "bicycle",
        y: 184,
      },
      {
        x: "horse",
        y: 222,
      },
      {
        x: "skateboard",
        y: 259,
      },
      {
        x: "others",
        y: 243,
      },
    ],
  },
  {
    id: "germany",
    color: "hsl(176, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 145,
      },
      {
        x: "helicopter",
        y: 148,
      },
      {
        x: "boat",
        y: 109,
      },
      {
        x: "train",
        y: 40,
      },
      {
        x: "subway",
        y: 81,
      },
      {
        x: "bus",
        y: 226,
      },
      {
        x: "car",
        y: 42,
      },
      {
        x: "moto",
        y: 44,
      },
      {
        x: "bicycle",
        y: 64,
      },
      {
        x: "horse",
        y: 20,
      },
      {
        x: "skateboard",
        y: 11,
      },
      {
        x: "others",
        y: 72,
      },
    ],
  },
  {
    id: "norway",
    color: "hsl(116, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 157,
      },
      {
        x: "helicopter",
        y: 120,
      },
      {
        x: "boat",
        y: 71,
      },
      {
        x: "train",
        y: 9,
      },
      {
        x: "subway",
        y: 281,
      },
      {
        x: "bus",
        y: 250,
      },
      {
        x: "car",
        y: 64,
      },
      {
        x: "moto",
        y: 203,
      },
      {
        x: "bicycle",
        y: 131,
      },
      {
        x: "horse",
        y: 259,
      },
      {
        x: "skateboard",
        y: 191,
      },
      {
        x: "others",
        y: 241,
      },
    ],
  },
];

export const HeroLineChart = () => (
  <ResponsiveLine
    data={data}
    margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "transportation",
      legendOffset: 36,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "count",
      legendOffset: -40,
      legendPosition: "middle",
      truncateTickAt: 0,
    }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    enableTouchCrosshair={true}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);
