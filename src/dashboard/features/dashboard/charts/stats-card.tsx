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
    <Card>
      <ChartHeader title={props.title} description={props.description} />
      <CardContent className="flex items-center">
        <CardTitle className="text-4xl flex-1">{props.value}</CardTitle>
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
