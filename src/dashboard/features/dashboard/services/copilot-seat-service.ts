import {
  formatResponseError,
  unknownResponseError,
} from "@/features/common/response-error";
import { ServerActionResponse } from "@/features/common/server-action-response";
import { ensureEnvironmentConfiguration } from "./env-service";

export interface SeatBreakdown {
  total: number;
  added_this_cycle: number;
  pending_invitation: number;
  pending_cancellation: number;
  active_this_cycle: number;
  inactive_this_cycle: number;
}

export interface SeatManagement {
  seat_breakdown: SeatBreakdown;
  seat_management_setting:
    | "assign_all"
    | "assign_selected"
    | "disabled"
    | "unconfigured";
  public_code_suggestions: "block" | "allow" | "unconfigured" | "unknown";
}

export const getCopilotSeatsForOrgs = async (): Promise<
  ServerActionResponse<SeatManagement[]>
> => {
  const env = ensureEnvironmentConfiguration();

  if (env.status !== "OK") {
    return env;
  }

  const { organization, token, version } = env.response;

  try {
    const response = await fetch(
      `https://api.github.com/orgs/${organization}/copilot/billing`,
      {
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
    console.log(data);
    return {
      status: "OK",
      response: [],
    };
  } catch (e) {
    return unknownResponseError(e);
  }
};
