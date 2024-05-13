import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditorChart } from "./editor-chart";

export const Editor = async () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Editor</CardTitle>
        <CardDescription>
          Number of active users per code editor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EditorChart />
      </CardContent>
    </Card>
  );
};
