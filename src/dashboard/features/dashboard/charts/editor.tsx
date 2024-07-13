"use client";
import { Card, CardContent } from "@/components/ui/card";

import { useDashboard } from "../dashboard-state";
import { ListItems, PieChartData } from "./language";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartHeader } from "./chart-header";
export const Editor = () => {
  return (
    <Card className="col-span-4 md:col-span-2">
      <ChartHeader
        title="Editor"
        description="Percentage of active users per editor"
      />
      <CardContent>
        <EditorChart />
      </CardContent>
    </Card>
  );
};

export const EditorChart = () => {
  const data = useData();
  return (
    <div className="w-full h-full flex flex-col gap-4 ">
      <div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              paddingAngle={1}
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              cornerRadius={5}
            />
          </PieChart>
        </ChartContainer>
      </div>
      <div className="flex flex-col gap-4 text-sm flex-wrap">
        <ListItems items={data} />
      </div>
    </div>
  );
};

const chartConfig = {} satisfies ChartConfig;

function useData() {
  const { filteredData: data } = useDashboard();
  const editors: Array<PieChartData> = [];

  data.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const { editor } = breakdown;
      const editorToEdit = editors.find((e) => e.id === editor);

      if (editorToEdit) {
        editorToEdit.value += breakdown.active_users;
        return;
      }

      editors.push({
        id: editor,
        name: editor,
        value: breakdown.active_users,
        fill: ``,
      });
    });
  });

  // sort by value
  editors.sort((a, b) => b.value - a.value);

  editors.forEach((editorData, index) => {
    editorData.fill =
      index < 4 ? `hsl(var(--chart-${index + 1}))` : `hsl(var(--chart-${5}))`;
  });
  return editors;
}
