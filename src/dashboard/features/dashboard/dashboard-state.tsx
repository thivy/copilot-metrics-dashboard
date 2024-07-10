"use client";

import { PropsWithChildren } from "react";
import { CopilotUsageOutput } from "./services/copilot-metrics-service";
import { formatDate } from "./utils/helpers";

import { proxy, useSnapshot } from "valtio";
import { groupByTimeFrame } from "./utils/data-mapper";

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
    this.languages = this.extractUniqueLanguages();
    this.editors = this.extractUniqueEditors();
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
    const dataByWeek = this.aggregatedDataByTimeFrame(timeFrame);
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

  private extractUniqueLanguages(): DropdownFilterItem[] {
    const languages: DropdownFilterItem[] = [];

    this.apiData.forEach((item) => {
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
  }

  private extractUniqueEditors(): DropdownFilterItem[] {
    const editors: DropdownFilterItem[] = [];
    this.apiData.forEach((item) => {
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
  }

  private aggregatedDataByTimeFrame(timeFrame: TimeFrame) {
    const items = JSON.parse(
      JSON.stringify(this.apiData)
    ) as Array<CopilotUsageOutput>;

    if (timeFrame === "daily") {
      items.forEach((item) => {
        item.time_frame_display = formatDate(item.day);
      });
      return items;
    }

    const groupedByTimeFrame = items.reduce((acc, item) => {
      const timeFrameLabel =
        timeFrame === "weekly" ? item.time_frame_week : item.time_frame_month;
      if (!acc[timeFrameLabel]) {
        acc[timeFrameLabel] = [];
      }
      acc[timeFrameLabel].push(item);
      return acc;
    }, {} as Record<string, CopilotUsageOutput[]>);

    const updatedResponse: CopilotUsageOutput[] =
      groupByTimeFrame(groupedByTimeFrame);

    return updatedResponse;
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
