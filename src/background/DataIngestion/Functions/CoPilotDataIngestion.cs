﻿using Microsoft.Azure.Functions.Worker;
using Microsoft.DevOpsDashboard.DataIngestion.Domain;
using Microsoft.Extensions.Logging;

namespace Microsoft.DevOpsDashboard.DataIngestion.Functions;

public class CoPilotDataIngestion
{
    private readonly ILogger _logger;
    private readonly GitHubCopilotUsageClient usageClient;

    public CoPilotDataIngestion(ILoggerFactory loggerFactory, GitHubCopilotUsageClient usageClient)
    {
        _logger = loggerFactory.CreateLogger<CoPilotDataIngestion>();
        this.usageClient = usageClient;
    }

    [Function("GitHubCopilotDataIngestion")]
    [CosmosDBOutput(databaseName: "platform-engineering", containerName: "history", Connection = "AZURE_COSMOSDB_CONNECTION_STRING", CreateIfNotExists = true)]
    public async Task<List<CopilotUsage>> Run(
    [TimerTrigger("*/5 * * * * *")] TimerInfo myTimer)
    //[TimerTrigger("0 0 1 * * *")] TimerInfo myTimer)
    {
        _logger.LogInformation($"GitHubCopilotDataIngestion timer trigger function executed at: {DateTime.Now}");
        List<CopilotUsage> usage = await usageClient.GetCopilotMetricsForOrgsAsync();

        if (myTimer.ScheduleStatus is not null)
        {
            _logger.LogInformation($"Finished ingestion. Next timer schedule at: {myTimer.ScheduleStatus.Next}");
        }

        return usage;
    }

}