using System.Text.Json.Serialization;

namespace Microsoft.DevOpsDashboard.DataIngestion.Domain;

public class CopilotUsageMetricsBreakdown
{
    public static CopilotUsageMetricsBreakdown FromOctokit(GitHub.Models.CopilotUsageMetrics_breakdown usageMetrics)
    {
        return new CopilotUsageMetricsBreakdown()
        {
            Editor = usageMetrics.Editor,
            Language = usageMetrics.Language,
            LinesAccepted = usageMetrics.LinesAccepted,
            AcceptancesCount = usageMetrics.AcceptancesCount,
            AdditionalData = usageMetrics.AdditionalData,
            ActiveUsers = usageMetrics.ActiveUsers,
            LinesSuggested = usageMetrics.LinesSuggested,
            SuggestionsCount = usageMetrics.SuggestionsCount,
        };
    }

    public int? LinesSuggested { get; set; }

    public int? SuggestionsCount { get; set; }

    public int? LinesAccepted { get; set; }

    public IDictionary<string,object>? AdditionalData { get; set; }

    public int? ActiveUsers { get; set; }

    public string? Language { get; set; }

    public string? Editor { get; set; }

    public int? AcceptancesCount { get; set; }
}

/// <summary>
/// Just to protect us should Github change their models. Want to ensure we have a consistent representation
/// in our store
/// </summary>
public class CopilotUsageMetrics
{
    public static CopilotUsageMetrics FromOctokit(GitHub.Models.CopilotUsageMetrics usageMetrics)
    {
        return new CopilotUsageMetrics
        {
            TotalAcceptancesCount = usageMetrics.TotalAcceptancesCount,
            Breakdown = usageMetrics.Breakdown?.Select(CopilotUsageMetricsBreakdown.FromOctokit).ToArray() ?? [],
            TotalChatAcceptances = usageMetrics.TotalChatAcceptances,
            TotalChatTurns = usageMetrics.TotalChatTurns,
            Month = new DateOnly(usageMetrics.Day!.Value.Year, usageMetrics.Day.Value.Month, 1).ToString("yyyy/MM"),
            Id = new DateOnly(usageMetrics.Day!.Value.Year, usageMetrics.Day!.Value.Month, usageMetrics.Day!.Value.Day).ToString("O"),
            Date = usageMetrics.Day.Value.DateTime,
            TotalActiveUsers = usageMetrics.TotalActiveUsers,
            TotalLinesAccepted = usageMetrics.TotalLinesAccepted,
            TotalLinesSuggested = usageMetrics.TotalLinesSuggested,
            TotalSuggestionsCount = usageMetrics.TotalSuggestionsCount,
            TotalActiveChatUsers = usageMetrics.TotalActiveChatUsers,
        };
    }

    public DateTime Date { get; set; } = default!;

    /// <summary>
    /// Give a spread of partiton key - thinking out loud, month by month comparisons might be a common type of query
    /// </summary>
    public string Month { get; set; } = default!;

    /// <summary>
    /// Id within a partition is the day of the month. Usage data is a daily thing
    /// </summary>
    [JsonPropertyName("id")]
    public string Id { get; set; } = default!;

    public CopilotUsageMetricsBreakdown[] Breakdown { get; set; } = default!;

    public int? TotalActiveChatUsers { get; set; }

    public int? TotalSuggestionsCount { get; set; }

    public int? TotalLinesSuggested { get; set; }

    public int? TotalLinesAccepted { get; set; }

    public int? TotalChatTurns { get; set; }

    public int? TotalChatAcceptances { get; set; }

    public int? TotalActiveUsers { get; set; }

    public int? TotalAcceptancesCount { get; set; }
}