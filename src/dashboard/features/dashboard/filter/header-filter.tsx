"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { DropdownItem, useDashboardData } from "../dashboard-state";
import { DropdownFilter } from "./dropdown-filter";

export function ComboboxPopover() {
  const { onEditorSelected, editorIsSelected, selectedEditors, allEditors } =
    useEditorSelection();

  const {
    onLanguageSelected,
    languageIsSelected,
    allLanguages,
    selectedItems,
  } = useLanguageSelection();

  const { resetAllFilters } = useDashboardData();

  return (
    <div className="flex gap-2">
      <DropdownFilter
        name={"Language"}
        allItems={allLanguages}
        itemIsSelected={languageIsSelected}
        onSelect={onLanguageSelected}
        selectedItems={selectedItems}
      />
      <DropdownFilter
        name={"Editor"}
        allItems={allEditors}
        itemIsSelected={editorIsSelected}
        onSelect={onEditorSelected}
        selectedItems={selectedEditors}
      />
      <Button variant={"secondary"} onClick={() => resetAllFilters()}>
        Reset
      </Button>
    </div>
  );
}

// Hook for editor selection
export const useEditorSelection = () => {
  const [selectedEditors, setSelectedEditors] = React.useState<DropdownItem[]>(
    []
  );
  const { filterEditor, removeEditor, allEditors } = useDashboardData();

  const onEditorSelected = (editor: string) => {
    const index = selectedEditors.findIndex((l) => l.name === editor);

    if (index === -1) {
      const item = allEditors.find((l) => l.name === editor);
      if (item) {
        setSelectedEditors([...selectedEditors, item]);
        filterEditor(editor);
      }
    } else {
      setSelectedEditors(
        selectedEditors.filter((item) => item.name !== editor)
      );
      removeEditor(editor);
    }
  };

  const editorIsSelected = (editor: string) => {
    return selectedEditors.some((item) => item.name === editor);
  };

  return { onEditorSelected, editorIsSelected, selectedEditors, allEditors };
};

// Hook for language selection
export const useLanguageSelection = () => {
  const [selectedLanguages, setSelectedLanguages] = React.useState<
    DropdownItem[]
  >([]);
  const { filterLanguage, removeLanguage, allLanguages } = useDashboardData();

  const onLanguageSelected = (language: string) => {
    const index = selectedLanguages.findIndex((l) => l.name === language);

    if (index === -1) {
      const item = allLanguages.find((l) => l.name === language);
      if (item) {
        setSelectedLanguages([...selectedLanguages, item]);
        filterLanguage(language);
      }
    } else {
      setSelectedLanguages(
        selectedLanguages.filter((item) => item.name !== language)
      );
      removeLanguage(language);
    }
  };

  const languageIsSelected = (language: string) => {
    return selectedLanguages.some((item) => item.name === language);
  };

  return {
    onLanguageSelected,
    languageIsSelected,
    allLanguages,
    selectedItems: selectedLanguages,
  };
};
