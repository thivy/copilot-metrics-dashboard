"use client";
import { ResponsivePie } from "@nivo/pie";
import { useDashboardData } from "../dashboard-state";
import { Legend } from "./language-chart";

export interface EditorChartData {
  id: string;
  name: string;
  value: number;
}

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
      <div className="flex gap-4 text-sm flex-wrap">
        {data.map((d) => (
          <Legend key={d.id} name={d.name} className="bg-green-200" />
        ))}
      </div>
    </div>
  );
};

function useData() {
  const { data } = useDashboardData();
  const editors: Array<EditorChartData> = [];

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
