import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  description: string;
  value: string;
}

export default function StatsCard(props: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="">
        <CardDescription className="text-xs">{props.title}</CardDescription>
        <CardTitle className="text-4xl">{props.value}</CardTitle>
      </CardHeader>
      <CardFooter>
        <CardDescription className="text-xs">
          {props.description}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
