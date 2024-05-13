import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AcceptanceRateChart } from "./acceptance-rate-chart";

export const AcceptanceSuggestionsCount = async () => {
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
        <AcceptanceRateChart></AcceptanceRateChart>
      </CardContent>
    </Card>
  );
};
