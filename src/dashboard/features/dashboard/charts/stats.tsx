"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "../dashboard-state";
import { CopilotUsageOutput } from "../services/copilot-metrics-service";
import { ChartHeader } from "./chart-header";
import StatsCard from "./stats-card";

export const Stats = () => {
  const { seatManagement, filteredData } = useDashboard();
  const acceptanceAverage = computeAcceptanceAverage(filteredData);
  const averageActiveUsers = computeActiveUserAverage(filteredData);
  const adoptionRate = computeAdoptionRate(seatManagement);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 col-span-4">
      <StatsCard
        title="Acceptance average"
        description="Inline code acceptance average"
        value={acceptanceAverage.toFixed(2) + "%"}
      ></StatsCard>
      <StatsCard
        title="Active users"
        description="Average active users"
        value={averageActiveUsers.toFixed(0) + ""}
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

const computeActiveUserAverage = (filteredData: CopilotUsageOutput[]) => {
  const activeUsersSum: number = filteredData.reduce(
    (sum: number, item: { total_active_users: number }) =>
      sum + item.total_active_users,
    0
  );

  const averageActiveUsers = activeUsersSum / filteredData.length;
  return averageActiveUsers;
};

const computeAdoptionRate = (seatManagement: any) => {
  const adoptionRate =
    (seatManagement.seat_breakdown.active_this_cycle /
      seatManagement.seat_breakdown.total) *
    100;
  return adoptionRate;
};

const computeAcceptanceAverage = (filteredData: CopilotUsageOutput[]) => {
  const acceptanceAverages = filteredData.map((item) => {
    let cumulatedLinesAccepted = 0;
    let cumulatedLinesSuggested = 0;

    item.breakdown.forEach((breakdown) => {
      const { lines_accepted, lines_suggested } = breakdown;
      cumulatedLinesAccepted += lines_accepted;
      cumulatedLinesSuggested += lines_suggested;
    });

    const acceptanceAverage =
      cumulatedLinesSuggested !== 0
        ? (cumulatedLinesAccepted / cumulatedLinesSuggested) * 100
        : 0;

    return acceptanceAverage;
  });

  const totalAcceptanceRate = acceptanceAverages.reduce(
    (sum, rate) => sum + rate,
    0
  );

  return totalAcceptanceRate / acceptanceAverages.length;
};
