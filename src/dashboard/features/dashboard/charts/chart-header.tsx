import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartHeaderProps {
  title: string;
  description: string;
}

export const ChartHeader = (props: ChartHeaderProps) => {
  return (
    <CardHeader className="border-b mb-6 space-y-2">
      <CardTitle>{props.title}</CardTitle>
      <CardDescription className="text-xs">{props.description}</CardDescription>
    </CardHeader>
  );
};
