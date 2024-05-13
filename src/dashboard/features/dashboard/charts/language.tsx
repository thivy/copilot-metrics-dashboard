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
        <CardTitle>Language</CardTitle>
        <CardDescription>Number of active users per language</CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageChart />
      </CardContent>
    </Card>
  );
};
