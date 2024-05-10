import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Serie } from "@nivo/line";
import { getAcceptanceRates } from "../api-data";
import { AcceptanceRateChart } from "./acceptance-rate-chart";

export const AcceptanceRate = async () => {
  const acceptance = await getAcceptanceRates();

  const completion = acceptance.map((item) => {
    return {
      x: item.day,
      y: item.completionAcceptanceRate,
    };
  });

  const data: Serie[] = [
    {
      id: "completion",
      data: completion,
    },
  ];

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
        <AcceptanceRateChart data={data}></AcceptanceRateChart>
      </CardContent>
    </Card>
  );
};
