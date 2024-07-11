using GitHub;
using GitHub.Models;
using GitHub.Octokit.Authentication;
using GitHub.Octokit.Client;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Kiota.Abstractions.Serialization;
using Microsoft.Kiota.Serialization.Json;

namespace Microsoft.DevOpsDashboard.DataIngestion.Functions;

public class CoPilotDataIngestion
{
    private readonly ILogger _logger;

    public CoPilotDataIngestion(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<CoPilotDataIngestion>();
    }

    [Function("CoPilotDataIngestion")]
    [CosmosDBOutput(databaseName: "platform-engineering", containerName: "history",
        Connection = "AZURE_COSMOSDB_CONNECTION_STRING", CreateIfNotExists = false)]
    public async Task<List<Domain.CopilotUsageMetrics>> Run(
    //[TimerTrigger("*/5 * * * * *")] TimerInfo myTimer)
    [TimerTrigger("0 0 1 * * *")] TimerInfo myTimer)
    {
        _logger.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

        List<Domain.CopilotUsageMetrics> usage;
        if (Environment.GetEnvironmentVariable("USE_TEST_DATA") == "true")
        {
            usage = await FetchGithubCoPilotUsageDataTest();
        }
        else
        {
            usage = await FetchGithubCoPilotUsageData();
        }

        if (myTimer.ScheduleStatus is not null)
        {
            _logger.LogInformation($"Finished ingestion. Next timer schedule at: {myTimer.ScheduleStatus.Next}");
        }

        return usage;
    }

    private Task<List<Domain.CopilotUsageMetrics>> FetchGithubCoPilotUsageDataTest()
    {
        ParseNodeFactoryRegistry.DefaultInstance.ContentTypeAssociatedFactories.AddOrUpdate("application/json",
            new JsonParseNodeFactory(), (_, _) => new JsonParseNodeFactory());

        var data = typeof(CoPilotDataIngestion).Assembly.GetManifestResourceStream(
            "Microsoft.DevOpsDashboard.DataIngestion.TestData.TestData.json")!;

        return Task.FromResult(KiotaJsonSerializer.DeserializeCollection<CopilotUsageMetrics>(data)
            .Select(Domain.CopilotUsageMetrics.FromOctokit).ToList());
    }

    private async Task<List<Domain.CopilotUsageMetrics>> FetchGithubCoPilotUsageData()
    {
        var githubClient = new GitHubClient(RequestAdapter.Create(
            new TokenAuthenticationProvider("AzureCoPilotUsageIngestion",
                Environment.GetEnvironmentVariable("GITHUB_TOKEN")!)));


        var githubType = Environment.GetEnvironmentVariable("GITHUB_TYPE");

        if (githubType == "organisation")
        {
            _logger.LogInformation("Fetching CoPilot data for Github Org for {Today}",
                DateTimeOffset.UtcNow.Date.ToString("R"));

            var usage = await githubClient.Orgs[Environment.GetEnvironmentVariable("GITHUB_NAME")].Copilot.Usage
                .GetAsync();

            return usage!.Select(Domain.CopilotUsageMetrics.FromOctokit).ToList();
        }
        else
        {
            _logger.LogInformation("Fetching CoPilot data for Github Enterprise {Today}",
                DateTimeOffset.UtcNow.Date.ToString("R"));

            var usage = await githubClient.Enterprises["GITHUB_NAME"].Copilot.Usage.GetAsync();

            return usage!.Select(Domain.CopilotUsageMetrics.FromOctokit).ToList();
        }
    }
}