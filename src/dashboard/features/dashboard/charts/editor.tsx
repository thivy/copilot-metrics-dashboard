"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ResponsivePie } from "@nivo/pie";
import { useDashboardData } from "../dashboard-state";
import { ListItems, PieChartData } from "./language";

export const Editor = async () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Editor</CardTitle>
        <CardDescription>
          Number of active users per code editor
        </CardDescription>
      </CardHeader>
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
      <div className="min-h-[40vh] h-[40vh]">
        <ResponsivePie
          data={data}
          sortByValue={true}
          margin={{ top: 10, right: 0, bottom: 10, left: 0 }}
          innerRadius={0.5}
          padAngle={2}
          cornerRadius={8}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.5]],
          }}
          enableArcLinkLabels={false}
          enableArcLabels={true}
          arcLabel={"name"}
          colors={{ scheme: "nivo" }}
        />
      </div>
      <div className="flex flex-col gap-4 text-sm flex-wrap">
        <ListItems items={data} />
      </div>
    </div>
  );
};

function useData() {
  const { data } = useDashboardData();
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
      });
    });
  });

  return editors;
}
