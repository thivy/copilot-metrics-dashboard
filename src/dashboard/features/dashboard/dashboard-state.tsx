"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CopilotUsageOutput, formatDate } from "./copilot-metrics-service";
import { useTimeFrame } from "./filter/time-frame-toggle";

interface State {
  data: CopilotUsageOutput[];
  allLanguages: DropdownItem[];
  allEditors: DropdownItem[];
  selectedLanguages: DropdownItem[];
  selectedEditors: DropdownItem[];
  filterLanguage: (language: string) => void;
  filterEditor: (editor: string) => void;
  resetAllFilters: () => void;
  editorIsSelected: (editor: string) => boolean;
  languageIsSelected: (language: string) => boolean;
}

interface IProps extends PropsWithChildren {
  apiData: CopilotUsageOutput[];
}

export interface DropdownItem {
  name: string;
}

export type TimeFrame = "daily" | "weekly" | "monthly";

const DashboardContext = createContext<State | undefined>(undefined);

const uniqueLanguages = (response: CopilotUsageOutput[]) => {
  const languages: DropdownItem[] = [];
  response.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const index = languages.findIndex(
        (language) => language.name === breakdown.language
      );

      if (index === -1) {
        languages.push({ name: breakdown.language });
      }
    });
  });

  return languages;
};

const uniqueEditors = (response: CopilotUsageOutput[]) => {
  const editors: DropdownItem[] = [];
  response.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const index = editors.findIndex(
        (editor) => editor.name === breakdown.editor
      );

      if (index === -1) {
        editors.push({ name: breakdown.editor });
      }
    });
  });

  return editors;
};

const DashboardProvider: React.FC<IProps> = ({ children, apiData }: IProps) => {
  const [response, setResponse] = useState<CopilotUsageOutput[]>(apiData);
  const [data, setData] = useState<CopilotUsageOutput[]>([]);

  const [languages, setLanguages] = useState<DropdownItem[]>([]);
  const [editors, setEditors] = useState<DropdownItem[]>([]);

  const [allLanguages] = useState<DropdownItem[]>(uniqueLanguages(response));
  const [allEditors] = useState<DropdownItem[]>(uniqueEditors(response));

  const { selectedTimeFrame } = useTimeFrame();
  const filteredData = useFilteredData(languages, editors, response);

  const filterEditor = (editor: string) => {
    const index = editors.findIndex((l) => l.name === editor);

    if (index === -1) {
      const item = allEditors.find((l) => l.name === editor);
      if (item) {
        setEditors([...editors, item]);
      }
    } else {
      setEditors(editors.filter((item) => item.name !== editor));
    }
  };

  const filterLanguage = (language: string) => {
    const index = languages.findIndex((l) => l.name === language);

    if (index === -1) {
      const item = allLanguages.find((l) => l.name === language);
      if (item) {
        setLanguages([...languages, item]);
      }
    } else {
      setLanguages(languages.filter((item) => item.name !== language));
    }
  };

  useEffect(() => {
    const dataByWeek = aggregatedDataByTimeFrame(apiData, selectedTimeFrame);
    setResponse(dataByWeek);
  }, [apiData, selectedTimeFrame]);

  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  const resetAllFilters = () => {
    setLanguages([]);
    setEditors([]);
  };

  const editorIsSelected = (editor: string) => {
    return editors.some((item) => item.name === editor);
  };

  const languageIsSelected = (language: string) => {
    return languages.some((item) => item.name === language);
  };

  return (
    <DashboardContext.Provider
      value={{
        data,
        allLanguages,
        allEditors,
        selectedLanguages: languages,
        selectedEditors: editors,
        filterLanguage,
        filterEditor,
        resetAllFilters,
        editorIsSelected,
        languageIsSelected,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

function useDashboardData() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardData must be used within a CountProvider");
  }
  return context;
}

function useFilteredData(
  selectedLanguages: DropdownItem[],
  selectedEditors: DropdownItem[],
  response: CopilotUsageOutput[]
) {
  const [data, setData] = useState<CopilotUsageOutput[]>([]);

  useEffect(() => {
    const applyFilters = () => {
      const items = JSON.parse(
        JSON.stringify(response)
      ) as Array<CopilotUsageOutput>;

      if (selectedLanguages.length !== 0) {
        items.forEach((item) => {
          const filtered = item.breakdown.filter((breakdown) =>
            selectedLanguages.some(
              (selectedLanguage) => selectedLanguage.name === breakdown.language
            )
          );
          item.breakdown = filtered;
        });
      }

      if (selectedEditors.length !== 0) {
        items.forEach((item) => {
          const filtered = item.breakdown.filter((breakdown) =>
            selectedEditors.some((editor) => editor.name === breakdown.editor)
          );
          item.breakdown = filtered;
        });
      }

      const filtered = items.filter((item) => item.breakdown.length > 0);
      setData(filtered);
    };

    applyFilters();
  }, [selectedLanguages, selectedEditors, response]);

  return data;
}

const aggregatedDataByTimeFrame = (
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

export { DashboardProvider, useDashboardData };
