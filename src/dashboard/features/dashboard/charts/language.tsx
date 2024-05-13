import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LanguageChart } from "./language-chart";

export const Language = async () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Acceptance rate</CardTitle>
        <CardDescription>
          Used to identify your store in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageChart />
      </CardContent>
    </Card>
  );
};
