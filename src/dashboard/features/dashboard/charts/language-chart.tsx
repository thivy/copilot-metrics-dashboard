"use client";
import { cn } from "@/lib/utils";
import { ResponsivePie } from "@nivo/pie";

export interface LanguageChartData {
  id: string;
  name: string;
  value: number;
}

export const LanguageChart = ({ data }: { data: LanguageChartData[] }) => {
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

export const Legend = ({
  className,
  name,
}: {
  name: string;
  className: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className={cn("w-4 h-4 rounded-full", className)}></div>
      <div>{name}</div>
    </div>
  );
};
