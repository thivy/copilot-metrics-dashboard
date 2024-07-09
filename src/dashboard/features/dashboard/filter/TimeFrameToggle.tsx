"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarDays } from "lucide-react";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { TimeFrame } from "../dashboard-state";

export const TimeFrameToggle = () => {
  const { selectedTimeFrame, setSelectedTimeFrame } = useTimeFrame();
  return (
    <Tabs defaultValue={selectedTimeFrame} className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="weekly"
          className="gap-2 font-normal"
          onClick={() => {
            setSelectedTimeFrame("weekly");
          }}
        >
          <Calendar size={16} /> Weekly
        </TabsTrigger>
        <TabsTrigger
          value="monthly"
          className="gap-2 font-normal"
          onClick={() => {
            setSelectedTimeFrame("monthly");
          }}
        >
          <CalendarDays size={16} /> Monthly
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

interface IProps extends PropsWithChildren {}

interface TimeFrameState {
  selectedTimeFrame: TimeFrame;
  setSelectedTimeFrame: (timeFrame: TimeFrame) => void;
}

const TimeFrameContext = createContext<TimeFrameState | undefined>(undefined);

const TimeFrameProvider = ({ children }: IProps) => {
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>("weekly");

  return (
    <TimeFrameContext.Provider
      value={{
        selectedTimeFrame,
        setSelectedTimeFrame,
      }}
    >
      {children}
    </TimeFrameContext.Provider>
  );
};

function useTimeFrame() {
  const context = useContext(TimeFrameContext);
  if (context === undefined) {
    throw new Error("useTimeFrame must be used within a CountProvider");
  }
  return context;
}

export { TimeFrameProvider, useTimeFrame };
