"use client";
import { Card, CardContent } from "@/components/ui/card";

import { ListItems, PieChartData } from "./language";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDashboard } from "../dashboard-state";
import { CopilotUsageOutput } from "../services/copilot-metrics-service";
import { ChartHeader } from "./chart-header";

export const Editor = () => {
  const { filteredData } = useDashboard();
  const data = computeEditorData(filteredData);
  return (
    <Card className="col-span-4 md:col-span-2">
      <ChartHeader
        title="Editor"
        description="Percentage of active users per editor"
      />
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

const chartConfig = {} satisfies ChartConfig;

export const computeEditorData = (
  filteredData: CopilotUsageOutput[]
): Array<PieChartData> => {
  const editorMap = new Map<string, PieChartData>();

  // Aggregate data
  filteredData.forEach(({ breakdown }) => {
    breakdown.forEach(({ editor, active_users }) => {
      const editorData = editorMap.get(editor) || {
        id: editor,
        name: editor,
        value: 0,
        fill: "",
      };
      editorData.value += active_users;
      editorMap.set(editor, editorData);
    });
  });

  // Convert Map to Array and calculate percentages
  let totalSum = 0;
  const editors = Array.from(editorMap.values()).map((editor) => {
    totalSum += editor.value;
    return editor;
  });

  // Calculate percentage values
  editors.forEach((editor) => {
    editor.value = Number(((editor.value / totalSum) * 100).toFixed(2));
  });

  // Sort by value
  editors.sort((a, b) => b.value - a.value);

  // Assign colors
  editors.forEach((editor, index) => {
    editor.fill = `hsl(var(--chart-${index < 4 ? index + 1 : 5}))`;
  });

  return editors;
};
