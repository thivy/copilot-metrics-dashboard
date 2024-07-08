"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CopilotUsage } from "./copilot-metrics-service";

interface State {
  data: CopilotUsage[];
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
  apiData: CopilotUsage[];
}

export interface DropdownItem {
  name: string;
  count: number;
}

const DashboardContext = createContext<State | undefined>(undefined);

const uniqueLanguages = (response: CopilotUsage[]) => {
  const languages: DropdownItem[] = [];
  response.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const index = languages.findIndex(
        (language) => language.name === breakdown.language
      );

      if (index === -1) {
        languages.push({ name: breakdown.language, count: 1 });
      } else {
        languages[index].count += 1;
      }
    });
  });

  return languages;
};

const uniqueEditors = (response: CopilotUsage[]) => {
  const editors: DropdownItem[] = [];
  response.forEach((item) => {
    item.breakdown.forEach((breakdown) => {
      const index = editors.findIndex(
        (editor) => editor.name === breakdown.editor
      );

      if (index === -1) {
        editors.push({ name: breakdown.editor, count: 1 });
      } else {
        editors[index].count += 1;
      }
    });
  });

  return editors;
};

const DashboardProvider: React.FC<IProps> = ({ children, apiData }: IProps) => {
  const [response, setResponse] = useState<CopilotUsage[]>(apiData);
  const [data, setData] = useState<CopilotUsage[]>(apiData);
  const [selectedLanguages, setSelectedLanguages] = useState<DropdownItem[]>(
    []
  );
  const [selectedEditors, setSelectedEditors] = useState<DropdownItem[]>([]);
  const [allLanguages, _setLanguages] = useState<DropdownItem[]>(
    uniqueLanguages(response)
  );

  const [allEditors, _setAllEditors] = useState<DropdownItem[]>(
    uniqueEditors(response)
  );

  const filterEditor = (editor: string) => {
    const index = selectedEditors.findIndex((l) => l.name === editor);

    if (index === -1) {
      const item = allEditors.find((l) => l.name === editor);
      if (item) {
        setSelectedEditors([...selectedEditors, item]);
      }
    } else {
      setSelectedEditors(
        selectedEditors.filter((item) => item.name !== editor)
      );
    }
  };

  const filterLanguage = (language: string) => {
    const index = selectedLanguages.findIndex((l) => l.name === language);

    if (index === -1) {
      const item = allLanguages.find((l) => l.name === language);
      if (item) {
        setSelectedLanguages([...selectedLanguages, item]);
      }
    } else {
      setSelectedLanguages(
        selectedLanguages.filter((item) => item.name !== language)
      );
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      // deep clone response including the breakdowns
      const items = JSON.parse(JSON.stringify(response)) as Array<CopilotUsage>;

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

      // items with more than 0 breakdowns
      const filtered = items.filter((item) => item.breakdown.length > 0);

      setData(filtered);
    };

    applyFilters();
  }, [selectedLanguages, selectedEditors, response]);

  const resetAllFilters = () => {
    setSelectedLanguages([]);
    setSelectedEditors([]);
  };

  const editorIsSelected = (editor: string) => {
    return selectedEditors.some((item) => item.name === editor);
  };

  const languageIsSelected = (language: string) => {
    return selectedLanguages.some((item) => item.name === language);
  };

  return (
    <DashboardContext.Provider
      value={{
        data,
        allLanguages,
        allEditors,
        selectedLanguages,
        selectedEditors,
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
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { DashboardProvider, useDashboardData };
