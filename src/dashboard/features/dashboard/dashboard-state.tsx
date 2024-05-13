"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface State {
  data: APIResponse[];
  setData: (data: APIResponse[]) => void;
  filterLanguage: (language: string) => void;
  filterEditor: (editor: string) => void;
}

interface IProps extends PropsWithChildren {
  apiData: APIResponse[];
}

const DashboardContext = createContext<State | undefined>(undefined);

const DashboardProvider: React.FC<IProps> = ({ children, apiData }: IProps) => {
  const [response, setResponse] = useState<APIResponse[]>(apiData);
  const [data, _setData] = useState<APIResponse[]>(apiData);
  const [languages, setLanguages] = useState<string[]>([]);
  const [editors, setEditors] = useState<string[]>([]);

  const setData = (data: APIResponse[]) => {
    _setData(data);
  };

  useEffect(() => {
    const applyFilters = () => {
      const items: Array<APIResponse> = [...response];

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

  const filterEditor = (editor: string) => {
    setEditors((prevEditors) =>
      prevEditors.includes(editor) ? prevEditors : [...prevEditors, editor]
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        data,
        setData,
        filterLanguage,
        filterEditor,
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

export interface APIResponse {
  total_suggestions_count: number;
  total_acceptances_count: number;
  total_lines_suggested: number;
  total_lines_accepted: number;
  total_active_users: number;
  total_chat_acceptances: number;
  total_chat_turns: number;
  total_active_chat_users: number;
  day: string;
  breakdown: Breakdown[];
}

export interface Breakdown {
  language: string;
  editor: string;
  suggestions_count: number;
  acceptances_count: number;
  lines_suggested: number;
  lines_accepted: number;
  active_users: number;
}
