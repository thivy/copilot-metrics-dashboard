import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Trend } from "../services/copilot-metrics-service";
import { ChartHeader } from "./chart-header";

interface StatsCardProps {
  title: string;
  description: string;
  value: string;
  trend?: Trend;
}

export default function StatsCard(props: StatsCardProps) {
  return (
    <Card className="flex flex-col">
      <ChartHeader title={props.title} description={props.description} />
      <CardContent className="flex items-center justify-center flex-1 py-0">
        <CardTitle className="text-[2.8rem] flex-1 tracking-tighter font-bold">
          {props.value}
        </CardTitle>
        {props.trend &&
          (props.trend === "up" ? (
            <TrendingUp size={16} className="stroke-lime-500" />
          ) : (
            <TrendingDown size={18} className="stroke-rose-500" />
          ))}
      </CardContent>
    </Card>
  );
}
