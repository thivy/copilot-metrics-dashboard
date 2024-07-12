import { ServerActionResponse } from "@/features/common/server-action-response";
import { CosmosClient } from "@azure/cosmos";
import {
  applyTimeFrameLabel,
  CopilotUsageOutput,
} from "./copilot-metrics-service";

export const cosmosClient = () => {
  const endpoint = process.env.AZURE_COSMOSDB_ENDPOINT;
  const key = process.env.AZURE_COSMOSDB_KEY;
  return new CosmosClient({ endpoint, key });
};

export const getCopilotMetricsForOrgsFromDatabase = async (): Promise<
  ServerActionResponse<CopilotUsageOutput[]>
> => {
  const client = cosmosClient();
  const database = client.database("platform-engineering");
  const container = database.container("history");

  const querySpec = {
    query: "SELECT * FROM c",
  };

  const { resources } = await container.items
    .query<CopilotUsageOutput>(querySpec)
    .fetchAll();

  const dataWithTimeFrame = applyTimeFrameLabel(resources);
  return {
    status: "OK",
    response: dataWithTimeFrame,
  };
};
