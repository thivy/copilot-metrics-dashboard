"use client";
import { Trend } from "../copilot-metrics-service";
import { useDashboard } from "../dashboard-state";
import { useCompletionAverage } from "./acceptance-rate";
import StatsCard from "./stats-card";

export const Stats = () => {
  const data = useCompletionAverage();
  const {
    total_active_users,
    total_active_chat_users,
    activeUsersTrend,
    activeChatUsersTrend,
  } = useDailyAverageUsers();
  return (
    <div className="grid grid-cols-4 gap-4 col-span-4">
      <StatsCard
        title="Completion Average"
        description="Inline code acceptance average"
        value={data.average.toFixed(2) + "%"}
        trend={data.trend}
      ></StatsCard>
      <StatsCard
        title="Adoption rate"
        description="Copilot adoption rate by active users"
        value={total_active_chat_users.toFixed(0) + "%"}
        trend={activeChatUsersTrend}
      ></StatsCard>
      <StatsCard
        title="Active users"
        description="Average active users"
        value={total_active_users.toFixed(0) + ""}
        trend={activeUsersTrend}
      ></StatsCard>
      <StatsCard
        title="Active chat users"
        description="Average active chat users"
        value={total_active_chat_users.toFixed(0) + ""}
        trend={activeChatUsersTrend}
      ></StatsCard>
    </div>
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
