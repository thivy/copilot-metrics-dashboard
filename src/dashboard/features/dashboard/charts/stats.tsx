"use client";
import StatsCard from "./stats-card";

export const Stats = () => {
  return (
    <div className="grid grid-cols-4 gap-4 col-span-4">
      <StatsCard
        title="Completion"
        description="Total number of code suggestions made by GitHub Copilot"
        value="88%"
      ></StatsCard>
      <StatsCard
        title="Chat"
        description="Total number of suggestions accepted by the users"
        value="66%"
      ></StatsCard>
      <StatsCard
        title="Total Rejection"
        description="Total number of suggestions rejected by the users"
        value="200"
      ></StatsCard>
      <StatsCard
        title="Acceptance Rate"
        description="Percentage of suggestions accepted by the users"
        value="80%"
      ></StatsCard>
    </div>
  );
};
