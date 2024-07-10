import { ServerActionResponse } from "@/features/common/server-action-response";

interface Environment {
  organization: string;
  enterprise: string;
  token: string;
  version: string;
}

export const ensureEnvironmentConfiguration =
  (): ServerActionResponse<Environment> => {
    const organization = process.env.GITHUB_ORGANIZATION;
    const enterprise = process.env.GITHUB_ENTERPRISE;
    const token = process.env.GITHUB_TOKEN;
    const version = process.env.GITHUB_API_VERSION;

    if (!organization || !token || !enterprise || !version) {
      return {
        status: "ERROR",
        errors: [
          {
            message:
              "Missing required environment variables for organization, GitHub token or enterprise",
          },
        ],
      };
    }

    return {
      status: "OK",
      response: {
        organization,
        enterprise,
        token,
        version,
      },
    };
  };
