import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AcceptanceRateChart } from "./acceptance-rate-chart";

export const AcceptanceRate = async () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Acceptance rate</CardTitle>
        <CardDescription>
          The ratio of accepted lines to the total lines suggested by GitHub
          Copilot
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[40dvh]">
        <AcceptanceRateChart></AcceptanceRateChart>
      </CardContent>
    </Card>
  );
};
