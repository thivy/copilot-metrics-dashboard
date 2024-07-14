"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "../dashboard-state";
import { Trend } from "../services/copilot-metrics-service";
import { useCompletionAverage } from "./acceptance-rate";
import { ChartHeader } from "./chart-header";
import StatsCard from "./stats-card";

export const Stats = () => {
  const data = useCompletionAverage();
  const {
    total_active_users,
    total_active_chat_users,
    activeUsersTrend,
    activeChatUsersTrend,
  } = useDailyAverageUsers();

  const { seatManagement } = useDashboard();

  const adoptionRate =
    (seatManagement.seat_breakdown.active_this_cycle /
      seatManagement.seat_breakdown.total) *
    100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 col-span-4">
      <StatsCard
        title="Acceptance average"
        description="Inline code acceptance average"
        value={data.average.toFixed(2) + "%"}
        trend={data.trend}
      ></StatsCard>
      <StatsCard
        title="Active users"
        description="Average active users"
        value={total_active_users.toFixed(0) + ""}
        trend={activeUsersTrend}
      ></StatsCard>
      <StatsCard
        title="Adoption rate"
        description="Copilot adoption rate by active users"
        value={adoptionRate.toFixed(0) + "%"}
      ></StatsCard>
      <Overview />
    </div>
  );
};

export const Overview = () => {
  const Item = ({ label, value }: { label: string; value: number }) => (
    <div className="flex-1 flex flex-row gap-2">
      <div className="text-xs flex-1 text-muted-foreground">{label}</div>
      <div className="text-xs ">{value}</div>
    </div>
  );

  const { seatManagement } = useDashboard();
  const { total, active_this_cycle, inactive_this_cycle } =
    seatManagement.seat_breakdown;

  return (
    <Card className="col-span-1">
      <ChartHeader
        title={"Seat information"}
        description={"Overview of GitHub Copilot seats"}
      />
      <CardContent className=" flex flex-col gap-2">
        <Item label="Total" value={total} />
        <Item label="Active" value={active_this_cycle} />
        <Item label="Inactive" value={inactive_this_cycle} />
      </CardContent>
    </Card>
  );
};

// daily average active users
const useDailyAverageUsers = () => {
  const { filteredData: data } = useDashboard();
  let sum = 0;
  let chatSum = 0;

  let lastActiveUsers = 0;
  let lastChatUsers = 0;

  let activeUsersTrend: Trend = "up";
  let activeChatUsersTrend: Trend = "up";

  const rates = data.map((item) => {
    sum += item.total_active_users;
    chatSum += item.total_active_chat_users;

    activeUsersTrend =
      item.total_active_users < lastActiveUsers ? "down" : "up";
    activeChatUsersTrend =
      item.total_active_chat_users < lastChatUsers ? "down" : "up";

    lastActiveUsers = item.total_active_users;
    lastChatUsers = item.total_active_chat_users;

    return {
      total_active_users: item.total_active_users,
      total_active_chat_users: item.total_active_chat_users,
    };
  });

  return {
    activeUsersTrend,
    activeChatUsersTrend,
    total_active_users: sum / rates.length,
    total_active_chat_users: chatSum / rates.length,
  };
};
