using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DevOpsDashboard.DataIngestion.Domain;

namespace Microsoft.DevOpsDashboard.DataIngestion.Functions
{
    public class CoPilotUsageDataFunction
    {
        [Function("CoPilotYesterdayUsageData")]
        public async Task<IActionResult> CoPilotMonthDayUsageData(
            [HttpTrigger(AuthorizationLevel.Function, "get",
                Route = "copilotusage/yesterday")]
            HttpRequest req,
            [CosmosDBInput(
                databaseName: "platform-engineering",
                containerName: "history",
                Connection = "AZURE_COSMOSDB_CONNECTION_STRING")]
            Container container)
        {
            var yesterday = DateTimeOffset.UtcNow.AddDays(-1);

            var item = await container.ReadItemAsync<CopilotUsageMetrics>(
                yesterday.ToString("yyyy-MM-dd"),
                new PartitionKey(yesterday.ToString("yyyy/MM"))
            );
            
            if (item.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return new NotFoundObjectResult(new
                {
                    error = "No data found for yesterday"
                });
            }
            
            return new OkObjectResult(item.Resource);
        }

        [Function("CoPilotMonthUsageData")]
        public async Task<IActionResult> CoPilotMonthUsageData(
            [HttpTrigger(AuthorizationLevel.Function, "get",
                Route = "copilotusage/{year:range(2023, 2099)}/{month:regex(^\\d\\d$)}")]
            HttpRequest req,
            int year,
            string month,
            [CosmosDBInput(
                databaseName: "platform-engineering",
                containerName: "history",
                Connection = "AZURE_COSMOSDB_CONNECTION_STRING")]
            Container container)
        {
            if (!int.TryParse(month, NumberStyles.None, CultureInfo.InvariantCulture, out var monthNumber))
            {
                return new BadRequestObjectResult(new
                {
                    error = "Invalid month. Month must be 2 digits, and between 01 and 12"
                });
            }
            var date = $"{year:0000}/{monthNumber:00}";

            var items = container.GetItemLinqQueryable<CopilotUsageMetrics>();
            var matches = items.Where(x => x.Month == date);
            using FeedIterator<CopilotUsageMetrics> linqFeed = matches.ToFeedIterator();

            var results = new List<CopilotUsageMetrics>();
            while (linqFeed.HasMoreResults)
            {
                FeedResponse<CopilotUsageMetrics> response = await linqFeed.ReadNextAsync();

                // Iterate query results
                foreach (CopilotUsageMetrics item in response)
                {
                    results.Add(item);
                }
            }

            return new OkObjectResult(results);
        }

        [Function("CoPilotRangeUsageData")]
        public async Task<IActionResult> CoPilotRangeUsageData(
            [HttpTrigger(AuthorizationLevel.Function, "get",
                Route = "copilotusage")]
            HttpRequest req,
            [CosmosDBInput(databaseName: "platform-engineering", containerName: "history",
                Connection = "AZURE_COSMOSDB_CONNECTION_STRING")]
            Container container)
        {
            if (!DateTimeOffset.TryParseExact(req.Query["from"].ToString(), "yyyy/MM/dd", CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal, out var from) &
                !DateTimeOffset.TryParseExact(req.Query["to"].ToString(), "yyyy/MM/dd", CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal, out var to))
            {
                return new BadRequestObjectResult(new
                {
                    error = "Invalid date range. You must supply a from and to date, in the format yyyy/MM/dd, e.g. 2024/03/16"
                });
            }

            var items = container.GetItemLinqQueryable<CopilotUsageMetrics>();
            var matches = items.Where(x => x.Date >= from.Date && x.Date < to.Date);
            using FeedIterator<CopilotUsageMetrics> linqFeed = matches.ToFeedIterator();

            var results = new List<CopilotUsageMetrics>();
            while (linqFeed.HasMoreResults)
            {
                FeedResponse<CopilotUsageMetrics> response = await linqFeed.ReadNextAsync();

                // Iterate query results
                foreach (CopilotUsageMetrics item in response)
                {
                    results.Add(item);
                }
            }

            return new OkObjectResult(results);
        }
    }
}