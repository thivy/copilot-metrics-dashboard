import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AcceptanceCountChart } from "./acceptance-count-chart";
import { Legend } from "./chat-legend";

export const AcceptanceCount = async () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Total Suggestions and Acceptances</CardTitle>
        <CardDescription className="text-xs">
          The total number of Copilot code completion suggestions shown to users
          and the total number accepted by users.
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-[40vh] h-[40vh]">
        <AcceptanceCountChart></AcceptanceCountChart>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 py-2 text-xs">
          <Legend name="Lines suggested" className="bg-[#F47560]" />
          <Legend name="Lines accepted" className="bg-[#E8C1A0]" />
        </div>
      </CardFooter>
    </Card>
  );
};
