import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Serie } from "@nivo/line";
import { getAcceptanceRates } from "./api-data";
import { HeroLineChart } from "./hero-line-chart";

export const HeroChart = async () => {
  const acceptance = await getAcceptanceRates();

  const chat = acceptance.map((item) => {
    return {
      x: item.day,
      y: item.chatAcceptanceRate,
    };
  });

  const completion = acceptance.map((item) => {
    return {
      x: item.day,
      y: item.completionAcceptanceRate,
    };
  });

  const data: Serie[] = [
    {
      id: "chat",
      data: chat,
    },
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
          Used to identify your store in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[40dvh]">
        <HeroLineChart data={data}></HeroLineChart>
      </CardContent>
    </Card>
  );
};
