import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarDays } from "lucide-react";

export const TimeFrameToggle = () => {
  return (
    <Tabs defaultValue="monthly" className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="weekly" className="gap-2 font-normal">
          <Calendar size={16} /> Weekly
        </TabsTrigger>
        <TabsTrigger value="monthly" className="gap-2 font-normal">
          <CalendarDays size={16} /> Monthly
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
