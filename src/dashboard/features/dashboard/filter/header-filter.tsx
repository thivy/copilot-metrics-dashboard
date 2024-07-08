"use client";

import { Button } from "@/components/ui/button";
import { useDashboardData } from "../dashboard-state";
import { DropdownFilter } from "./dropdown-filter";

export function Filters() {
  const { selectedEditors, filterEditor, allEditors, editorIsSelected } =
    useDashboardData();

  const {
    selectedLanguages,
    filterLanguage,
    allLanguages,
    languageIsSelected,
  } = useDashboardData();

  const { resetAllFilters } = useDashboardData();

  return (
    <div className="flex gap-2">
      <DropdownFilter
        name={"Language"}
        allItems={allLanguages}
        itemIsSelected={languageIsSelected}
        onSelect={filterLanguage}
        selectedItems={selectedLanguages}
      />
      <DropdownFilter
        name={"Editor"}
        allItems={allEditors}
        itemIsSelected={editorIsSelected}
        onSelect={filterEditor}
        selectedItems={selectedEditors}
      />
      <Button variant={"secondary"} onClick={() => resetAllFilters()}>
        Reset
      </Button>
    </div>
  );
}
