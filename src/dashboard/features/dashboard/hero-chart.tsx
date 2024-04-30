import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeroLineChart } from "./hero-line-chart";

export const HeroChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Acceptance rate</CardTitle>
        <CardDescription>
          Used to identify your store in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[40dvh]">
        <HeroLineChart></HeroLineChart>
      </CardContent>
    </Card>
  );
};
