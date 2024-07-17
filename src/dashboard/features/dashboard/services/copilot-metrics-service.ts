import {
  formatResponseError,
  unknownResponseError,
} from "@/features/common/response-error";
import { ServerActionResponse } from "@/features/common/server-action-response";
import { SqlQuerySpec } from "@azure/cosmos";
import { format, startOfWeek } from "date-fns";
import { cosmosClient, cosmosConfiguration } from "./cosmos-db-service";
import { ensureGitHubEnvConfig } from "./env-service";
import { data } from "./sample-data";

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

export interface IFilter {
  startDate?: Date;
  endDate?: Date;
}

export const getCopilotMetricsForOrgs = async (
  filter: IFilter
): Promise<ServerActionResponse<CopilotUsageOutput[]>> => {
  try {
    const isCosmosConfig = cosmosConfiguration();
    // If we have the required environment variables, we can use the database
    if (isCosmosConfig) {
      return getCopilotMetricsForOrgsFromDatabase(filter);
    }

    return getCopilotMetricsForOrgsFromApi();
  } catch (e) {
    return {
      status: "ERROR",
      errors: [{ message: "" + e }],
    };
  }
};

export const getCopilotMetricsForOrgsFromApi = async (): Promise<
  ServerActionResponse<CopilotUsageOutput[]>
> => {
  const env = ensureGitHubEnvConfig();

  if (env.status !== "OK") {
    return env;
  }

  const { organization, token, version } = env.response;

  try {
    const response = await fetch(
      `https://api.github.com/orgs/${organization}/copilot/usage`,
      {
        cache: "no-store",
        headers: {
          Accept: `application/vnd.github+json`,
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": version,
        },
      }
    );

    if (!response.ok) {
      return formatResponseError(organization, response);
    }

    const data = await response.json();
    const dataWithTimeFrame = applyTimeFrameLabel(data);
    return {
      status: "OK",
      response: dataWithTimeFrame,
    };
  } catch (e) {
    return unknownResponseError(e);
  }
};

export const getCopilotMetricsForOrgsFromDatabase = async (
  filter: IFilter
): Promise<ServerActionResponse<CopilotUsageOutput[]>> => {
  const client = cosmosClient();
  const database = client.database("platform-engineering");
  const container = database.container("history");

  let start = "";
  let end = "";
  const maxDays = 365 * 2; // maximum 2 years of data
  const maximumDays = 31;

  if (filter.startDate && filter.endDate) {
    start = format(filter.startDate, "yyyy-MM-dd");
    end = format(filter.endDate, "yyyy-MM-dd");
  } else {
    // set the start date to today and the end date to 31 days ago
    const todayDate = new Date();
    const startDate = new Date(todayDate);
    startDate.setDate(todayDate.getDate() - maximumDays);

    start = format(startDate, "yyyy-MM-dd");
    end = format(todayDate, "yyyy-MM-dd");
  }

  let querySpec: SqlQuerySpec = {
    query: `SELECT * FROM c WHERE c.day >= @start AND c.day <= @end`,
    parameters: [
      { name: "@start", value: start },
      { name: "@end", value: end },
    ],
  };

  const { resources } = await container.items
    .query<CopilotUsageOutput>(querySpec, {
      maxItemCount: maxDays,
    })
    .fetchAll();

  const dataWithTimeFrame = applyTimeFrameLabel(resources);
  return {
    status: "OK",
    response: dataWithTimeFrame,
  };
};

export const _getCopilotMetrics = (): Promise<CopilotUsageOutput[]> => {
  const promise = new Promise<CopilotUsageOutput[]>((resolve) => {
    setTimeout(() => {
      const weekly = applyTimeFrameLabel(data);
      resolve(weekly);
    }, 1000);
  });

  return promise;
};

export const applyTimeFrameLabel = (
  data: CopilotUsage[]
): CopilotUsageOutput[] => {
  // Sort data by 'day'
  const sortedData = data.sort(
    (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
  );

  const dataWithTimeFrame: CopilotUsageOutput[] = [];

  sortedData.forEach((item) => {
    // Convert 'day' to a Date object and find the start of its week
    const date = new Date(item.day);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });

    // Create a unique week identifier
    const weekIdentifier = format(weekStart, "MMM dd");
    const monthIdentifier = format(date, "MMM yy");

    const output: CopilotUsageOutput = {
      ...item,
      time_frame_week: weekIdentifier,
      time_frame_month: monthIdentifier,
      time_frame_display: weekIdentifier,
    };
    dataWithTimeFrame.push(output);
  });

  return dataWithTimeFrame;
};
