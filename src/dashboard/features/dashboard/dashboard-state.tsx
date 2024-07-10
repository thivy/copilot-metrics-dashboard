"use client";

import { PropsWithChildren } from "react";
import { CopilotUsageOutput } from "./copilot-metrics-service";
import {
  aggregatedDataByTimeFrame,
  extractUniqueEditors,
  extractUniqueLanguages,
} from "./filter/helpers";

import { proxy, useSnapshot } from "valtio";

interface State {
  data: CopilotUsageOutput[];
  allLanguages: DropdownFilterItem[];
  allEditors: DropdownFilterItem[];
  selectedLanguages: DropdownFilterItem[];
  selectedEditors: DropdownFilterItem[];
  filterLanguage: (language: string) => void;
  filterEditor: (editor: string) => void;
  resetAllFilters: () => void;
  editorIsSelected: (editor: string) => boolean;
  languageIsSelected: (language: string) => boolean;
}

interface IProps extends PropsWithChildren {
  apiData: CopilotUsageOutput[];
}

export interface DropdownFilterItem {
  value: string;
  isSelected: boolean;
}

export type TimeFrame = "daily" | "weekly" | "monthly";

class DashboardState {
  public filteredData: CopilotUsageOutput[] = [];
  public languages: DropdownFilterItem[] = [];
  public editors: DropdownFilterItem[] = [];
  public timeFrame: TimeFrame = "weekly";

  private apiData: CopilotUsageOutput[] = [];

  public initData(data: CopilotUsageOutput[]): void {
    this.apiData = [...data];
    this.onTimeFrameChange(this.timeFrame);
    this.languages = extractUniqueLanguages(data);
    this.editors = extractUniqueEditors(data);
  }

  public filterLanguage(language: string): void {
    const item = this.languages.find((l) => l.value === language);
    if (item) {
      item.isSelected = !item.isSelected;
      this.applyFilters();
    }
  }

  public filterEditor(editor: string): void {
    const item = this.editors.find((l) => l.value === editor);
    if (item) {
      item.isSelected = !item.isSelected;
      this.applyFilters();
    }
  }

  public resetAllFilters(): void {
    this.languages.forEach((item) => (item.isSelected = false));
    this.editors.forEach((item) => (item.isSelected = false));
    this.applyFilters();
  }

  public onTimeFrameChange(timeFrame: TimeFrame): void {
    const dataByWeek = aggregatedDataByTimeFrame(this.apiData, timeFrame);
    this.filteredData = dataByWeek;
  }

  private applyFilters(): void {
    const items = JSON.parse(
      JSON.stringify(this.apiData)
    ) as Array<CopilotUsageOutput>;

    const selectedLanguages = this.languages.filter((item) => item.isSelected);
    const selectedEditors = this.editors.filter((item) => item.isSelected);

    if (selectedLanguages.length !== 0) {
      items.forEach((item) => {
        const filtered = item.breakdown.filter((breakdown) =>
          selectedLanguages.some(
            (selectedLanguage) => selectedLanguage.value === breakdown.language
          )
        );
        item.breakdown = filtered;
      });
    }

    if (selectedEditors.length !== 0) {
      items.forEach((item) => {
        const filtered = item.breakdown.filter((breakdown) =>
          selectedEditors.some((editor) => editor.value === breakdown.editor)
        );
        item.breakdown = filtered;
      });
    }

    const filtered = items.filter((item) => item.breakdown.length > 0);
    this.filteredData = filtered;
  }
}

export const dashboardStore = proxy(new DashboardState());

export const useDashboard = () => {
  return useSnapshot(dashboardStore, { sync: true }) as DashboardState;
};

export const DataProvider = ({ children, apiData }: IProps) => {
  dashboardStore.initData(apiData);
  return <>{children}</>;
};
