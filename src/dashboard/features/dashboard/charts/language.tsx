"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardData } from "../dashboard-state";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
export const Language = () => {
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
  fill: string;
}

const chartConfig = {} satisfies ChartConfig;

export const LanguageChart = () => {
  const data = useData();

  return (
    <div className="w-full h-full flex flex-col gap-4 ">
      <div className="">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              paddingAngle={1}
              data={data}
              dataKey="value"
              nameKey="name"
              cornerRadius={5}
              innerRadius={40}
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
      console.log(breakdown.active_users);
      languages.push({
        id: language,
        name: language,
        value: breakdown.active_users,
        fill: ``,
      });
    });
  });

  // sort by value
  languages.sort((a, b) => b.value - a.value);

  languages.forEach((language, index) => {
    language.fill =
      index < 4 ? `hsl(var(--chart-${index + 1}))` : `hsl(var(--chart-${5}))`;
  });

  return languages;
}
