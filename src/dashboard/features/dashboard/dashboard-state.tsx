"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { APIResponse } from "./api-data";

interface State {
  data: APIResponse[];
  allLanguages: DropdownItem[];
  allEditors: DropdownItem[];
  filterLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;
  filterEditor: (editor: string) => void;
  removeEditor: (editor: string) => void;
  resetAllFilters: () => void;
}

interface IProps extends PropsWithChildren {
  apiData: APIResponse[];
}

export interface DropdownItem {
  name: string;
  count: number;
}

const DashboardContext = createContext<State | undefined>(undefined);

const uniqueLanguages = (response: APIResponse[]) => {
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

const uniqueEditors = (response: APIResponse[]) => {
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
  const [response, setResponse] = useState<APIResponse[]>(apiData);
  const [data, setData] = useState<APIResponse[]>(apiData);
  const [languages, setLanguages] = useState<string[]>([]);
  const [editors, setEditors] = useState<string[]>([]);
  const [allLanguages, _setLanguages] = useState<DropdownItem[]>(
    uniqueLanguages(response)
  );

  const [allEditors, _setAllEditors] = useState<DropdownItem[]>(
    uniqueEditors(response)
  );

  useEffect(() => {
    const applyFilters = () => {
      // deep clone response including the breakdowns
      const items = JSON.parse(JSON.stringify(response)) as Array<APIResponse>;

      if (languages.length !== 0) {
        items.forEach((item) => {
          const filtered = item.breakdown.filter((breakdown) =>
            languages.includes(breakdown.language)
          );

          item.breakdown = filtered;
        });
      }

      if (editors.length !== 0) {
        items.forEach((item) => {
          const filtered = item.breakdown.filter((breakdown) =>
            editors.includes(breakdown.editor)
          );
          item.breakdown = filtered;
        });
      }

      // items with more than 0 breakdowns
      const filtered = items.filter((item) => item.breakdown.length > 0);

      setData(filtered);
    };

    applyFilters();
  }, [languages, editors, response]);

  const filterLanguage = (language: string) => {
    setLanguages((prevLanguages) =>
      prevLanguages.includes(language)
        ? prevLanguages
        : [...prevLanguages, language]
    );
  };

  const removeLanguage = (language: string) => {
    setLanguages((prevLanguages) =>
      prevLanguages.filter((prevLanguage) => prevLanguage !== language)
    );
  };

  const filterEditor = (editor: string) => {
    setEditors((prevEditors) =>
      prevEditors.includes(editor) ? prevEditors : [...prevEditors, editor]
    );
  };

  const removeEditor = (editor: string) => {
    setEditors((prevEditors) =>
      prevEditors.filter((prevEditor) => prevEditor !== editor)
    );
  };

  const resetAllFilters = () => {
    setLanguages([]);
    setEditors([]);
  };

  return (
    <DashboardContext.Provider
      value={{
        data,
        allLanguages,
        allEditors,
        filterLanguage,
        removeLanguage,
        filterEditor,
        removeEditor,
        resetAllFilters,
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
