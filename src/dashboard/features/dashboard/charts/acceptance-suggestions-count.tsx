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

export const AcceptanceSuggestionsCount = async () => {
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
        <CardTitle>Suggestions & Acceptance</CardTitle>
        <CardDescription>
          Total number of code suggestions made by GitHub Copilot and total
          number of suggestions accepted by the users
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[40dvh]">
        <AcceptanceRateChart data={data}></AcceptanceRateChart>
      </CardContent>
    </Card>
  );
};
