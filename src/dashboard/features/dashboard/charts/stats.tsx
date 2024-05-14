"use client";
import { useDashboardData } from "../dashboard-state";
import StatsCard from "./stats-card";

export const Stats = () => {
  const inline = useInlineAcceptanceAverage();
  const { total_active_users, total_active_chat_users } =
    useDailyAverageUsers();
  return (
    <div className="grid grid-cols-3 gap-4 col-span-4">
      <StatsCard
        title="Completion Average"
        description="Inline code acceptance average"
        value={inline.toFixed(2) + "%"}
      ></StatsCard>

      <StatsCard
        title="Active users"
        description="Daily average active users"
        value={total_active_users.toFixed(0) + ""}
      ></StatsCard>
      <StatsCard
        title="Active chat users"
        description="Daily average active chat users"
        value={total_active_chat_users.toFixed(0) + ""}
      ></StatsCard>
    </div>
  );
};

// inline code completion acceptance rate average
const useInlineAcceptanceAverage = () => {
  const { data } = useDashboardData();
  let sum = 0;

  const rates = data.map((item) => {
    let total_lines_accepted = 0;
    let total_lines_suggested = 0;

    item.breakdown.forEach((breakdown) => {
      total_lines_accepted += breakdown.lines_accepted;
      total_lines_suggested += breakdown.lines_suggested;
    });

    const completionAcceptanceRate =
      (total_lines_accepted / total_lines_suggested) * 100;
    sum += completionAcceptanceRate;
    return {
      completionAcceptanceRate,
    };
  });

  return sum / rates.length;
};

// daily average active users
const useDailyAverageUsers = () => {
  const { data } = useDashboardData();
  let sum = 0;
  let chatSum = 0;
  const rates = data.map((item) => {
    sum += item.total_active_users;
    chatSum += item.total_active_chat_users;
    return {
      total_active_users: item.total_active_users,
      total_active_chat_users: item.total_active_chat_users,
    };
  });

  return {
    total_active_users: sum / rates.length,
    total_active_chat_users: chatSum / rates.length,
  };
};
