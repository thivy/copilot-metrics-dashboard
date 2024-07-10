import { format, startOfWeek } from "date-fns";
import { data } from "./sample-data";

export type Trend = "up" | "down";

export interface CopilotUsage {
  total_suggestions_count: number;
  total_acceptances_count: number;
  total_lines_suggested: number;
  total_lines_accepted: number;
  total_active_users: number;
  total_chat_acceptances: number;
  total_chat_turns: number;
  total_active_chat_users: number;
  day: string;
  breakdown: Breakdown[];
}

export interface CopilotUsageOutput extends CopilotUsage {
  time_frame_week: string;
  time_frame_month: string;
  time_frame_display: string;
}

export interface Breakdown {
  language: string;
  editor: string;
  suggestions_count: number;
  acceptances_count: number;
  lines_suggested: number;
  lines_accepted: number;
  active_users: number;
}

export const getCopilotMetrics = async () => {
  const response = await fetch(
    `https://api.github.com/orgs/${process.env.GITHUB_ENTERPRISE}/copilot/usage`,
    {
      headers: {
        Accept: `application/vnd.github+json`,
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    // TODO: Handle error
    return [];
  }

  const data = await response.json();
  const weekly = groupDataByTimeFrame(data);
  return weekly;
};

export const _getCopilotMetrics = (): Promise<CopilotUsageOutput[]> => {
  const promise = new Promise<CopilotUsageOutput[]>((resolve) => {
    setTimeout(() => {
      const weekly = groupDataByTimeFrame(data);
      resolve(weekly);
    }, 1000);
  });

  return promise;
};

export const groupDataByTimeFrame = (
  data: CopilotUsage[]
): CopilotUsageOutput[] => {
  // Sort data by 'day'
  const sortedData = data.sort(
    (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
  );

  const weekGroups: CopilotUsageOutput[] = [];

  sortedData.forEach((item) => {
    // Convert 'day' to a Date object and find the start of its week
    const date = new Date(item.day);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });

    // Create a unique week identifier
    const weekIdentifier = format(weekStart, "MMM yy 'W'I");
    const monthIdentifier = format(date, "MMM yy");

    const output: CopilotUsageOutput = {
      ...item,
      time_frame_week: weekIdentifier,
      time_frame_month: monthIdentifier,
      time_frame_display: weekIdentifier,
    };
    weekGroups.push(output);
  });

  return weekGroups;
};
