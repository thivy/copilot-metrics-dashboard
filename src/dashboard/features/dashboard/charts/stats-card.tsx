import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChartHeader } from "./chart-header";

interface StatsCardProps {
  title: string;
  description: string;
  value: string;
}

export default function StatsCard(props: StatsCardProps) {
  return (
    <Card>
      <ChartHeader title={props.title} description={props.description} />
      <CardContent>
        <CardTitle className="text-4xl">{props.value}</CardTitle>
      </CardContent>
    </Card>
  );
}
