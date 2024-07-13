import { CosmosClient } from "@azure/cosmos";

export const cosmosClient = () => {
  const endpoint = process.env.AZURE_COSMOSDB_ENDPOINT;
  const key = process.env.AZURE_COSMOSDB_KEY;
  return new CosmosClient({ endpoint, key });
};

export const cosmosConfiguration = (): boolean => {
  const endpoint = process.env.AZURE_COSMOSDB_ENDPOINT;
  const key = process.env.AZURE_COSMOSDB_KEY;

  return (
    endpoint !== undefined &&
    endpoint.trim() !== "" &&
    key !== undefined &&
    key.trim() !== ""
  );
};
