import { CopilotUsageOutput, formatDate } from "../copilot-metrics-service";
import { DropdownFilterItem, TimeFrame } from "../dashboard-state";

export const extractUniqueLanguages = (response: CopilotUsageOutput[]) => {
  const languages: DropdownFilterItem[] = [];
  response.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const index = languages.findIndex(
        (language) => language.value === breakdown.language
      );

      if (index === -1) {
        languages.push({ value: breakdown.language, isSelected: false });
      }
    });
  });

  return languages;
};

export const extractUniqueEditors = (response: CopilotUsageOutput[]) => {
  const editors: DropdownFilterItem[] = [];
  response.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const index = editors.findIndex(
        (editor) => editor.value === breakdown.editor
      );

      if (index === -1) {
        editors.push({ value: breakdown.editor, isSelected: false });
      }
    });
  });

  return editors;
};

export const aggregatedDataByTimeFrame = (
  apiData: CopilotUsageOutput[],
  timeFrame: TimeFrame
) => {
  const items = JSON.parse(
    JSON.stringify(apiData)
  ) as Array<CopilotUsageOutput>;

  if (timeFrame === "daily") {
    items.forEach((item) => {
      item.time_frame_display = formatDate(item.day);
    });
    return items;
  }

  const updatedResponse: CopilotUsageOutput[] = [];

  const groupedByTimeFrame = items.reduce((acc, item) => {
    const timeFrameLabel =
      timeFrame === "weekly" ? item.time_frame_week : item.time_frame_month;
    if (!acc[timeFrameLabel]) {
      acc[timeFrameLabel] = [];
    }
    acc[timeFrameLabel].push(item);
    return acc;
  }, {} as Record<string, CopilotUsageOutput[]>);

  Object.keys(groupedByTimeFrame).forEach((week) => {
    const aggregatedData: CopilotUsageOutput = {
      total_suggestions_count: 0,
      total_acceptances_count: 0,
      total_lines_suggested: 0,
      total_lines_accepted: 0,
      total_active_users: 0,
      total_chat_acceptances: 0,
      total_chat_turns: 0,
      total_active_chat_users: 0,
      day: "", // Decide how to handle this
      breakdown: [], // Decide how to handle this
      time_frame_month: "",
      time_frame_week: "",
      time_frame_display: week,
    };

    const timeFrameLength = groupedByTimeFrame[week].length;

    groupedByTimeFrame[week].forEach((item, index) => {
      aggregatedData.total_suggestions_count += item.total_suggestions_count;
      aggregatedData.total_acceptances_count += item.total_acceptances_count;
      aggregatedData.total_lines_suggested += item.total_lines_suggested;
      aggregatedData.total_lines_accepted += item.total_lines_accepted;
      aggregatedData.total_active_users += item.total_active_users;
      aggregatedData.total_chat_acceptances += item.total_chat_acceptances;
      aggregatedData.total_chat_turns += item.total_chat_turns;
      aggregatedData.total_active_chat_users += item.total_active_chat_users;

      // is last item
      if (index === timeFrameLength - 1) {
        aggregatedData.time_frame_month = item.time_frame_month;
        aggregatedData.time_frame_week = item.time_frame_week;
        aggregatedData.total_suggestions_count /= timeFrameLength;
        aggregatedData.total_acceptances_count /= timeFrameLength;
        aggregatedData.total_lines_suggested /= timeFrameLength;
        aggregatedData.total_lines_accepted /= timeFrameLength;
        aggregatedData.total_active_users /= timeFrameLength;
        aggregatedData.total_chat_acceptances /= timeFrameLength;
        aggregatedData.total_chat_turns /= timeFrameLength;
        aggregatedData.total_active_chat_users /= timeFrameLength;
      }

      const breakdownLength = item.breakdown.length;

      item.breakdown.forEach((breakdownItem) => {
        const existingIndex = aggregatedData.breakdown.findIndex(
          (bd) =>
            bd.language === breakdownItem.language &&
            bd.editor === breakdownItem.editor
        );

        if (existingIndex >= 0) {
          aggregatedData.breakdown[existingIndex].suggestions_count +=
            breakdownItem.suggestions_count;
          aggregatedData.breakdown[existingIndex].acceptances_count +=
            breakdownItem.acceptances_count;
          aggregatedData.breakdown[existingIndex].lines_suggested +=
            breakdownItem.lines_suggested;
          aggregatedData.breakdown[existingIndex].lines_accepted +=
            breakdownItem.lines_accepted;
          aggregatedData.breakdown[existingIndex].active_users +=
            breakdownItem.active_users;
        } else {
          aggregatedData.breakdown.push(breakdownItem);
        }

        // is last item
        if (index === breakdownLength - 1) {
          aggregatedData.breakdown.forEach((bd) => {
            bd.suggestions_count /= breakdownLength;
            bd.acceptances_count /= breakdownLength;
            bd.lines_suggested /= breakdownLength;
            bd.lines_accepted /= breakdownLength;
            bd.active_users /= breakdownLength;
          });
        }
      });
    });

    updatedResponse.push(aggregatedData);
  });

  return updatedResponse;
};
