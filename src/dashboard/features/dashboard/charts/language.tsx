import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLanguageData } from "../api-data";
import { LanguageChart } from "./language-chart";

const data = [
  {
    id: "stylus",
    label: "stylus",
    value: 437,
    color: "hsl(151, 70%, 50%)",
  },
  {
    id: "ruby",
    label: "ruby",
    value: 253,
    color: "hsl(118, 70%, 50%)",
  },
  {
    id: "c",
    label: "c",
    value: 522,
    color: "hsl(347, 70%, 50%)",
  },
  {
    id: "lisp",
    label: "lisp",
    value: 533,
    color: "hsl(105, 70%, 50%)",
  },
  {
    id: "hack",
    label: "hack",
    value: 145,
    color: "hsl(29, 70%, 50%)",
  },
];

export const Language = async () => {
  const ides = await getLanguageData();
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Acceptance rate</CardTitle>
        <CardDescription>
          Used to identify your store in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent className="mih-[30dvh]">
        <LanguageChart data={ides} />
      </CardContent>
    </Card>
  );
};
