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

export const Language = async () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>Number of active users per language</CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageChart />
      </CardContent>
    </Card>
  );
};

export interface PieChartData {
  id: string;
  name: string;
  value: number;
}

export const LanguageChart = () => {
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

import { ScrollArea } from "@/components/ui/scroll-area";

export function ListItems(props: { items: PieChartData[] }) {
  return (
    <ScrollArea className="h-72 rounded-md">
      <div className="gap-1 flex flex-col">
        {props.items.map((item) => (
          <div
            className="px-4 py-2 text-sm flex items-center border-b border-muted"
            key={item.name}
          >
            <span className="flex-1">{item.name}</span>
            <span className="p-1 px-2 border bg-primary-foreground rounded-full text-xs">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function useData() {
  const { data } = useDashboardData();
  const languages: Array<PieChartData> = [];

  data.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const { language } = breakdown;
      const languageToEdit = languages.find((e) => e.id === language);

      if (languageToEdit) {
        languageToEdit.value += breakdown.active_users;
        return;
      }
      languages.push({
        id: language,
        name: language,
        value: breakdown.active_users,
      });
    });
  });
  // sort by value
  languages.sort((a, b) => b.value - a.value);

  return languages;
}
