"use client";

import { useTheme } from "next-themes";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(theme);

  if (theme === undefined || theme.length === 0) {
    setCurrentTheme("system");
  }
  return (
    <Tabs defaultValue={currentTheme} className="">
      <TabsList className="flex items-stretch gap-2 rounded-full ">
        <TabsTrigger
          className="rounded-full"
          value="light"
          onClick={() => setTheme("light")}
        >
          <Sun size={18} />
        </TabsTrigger>
        <TabsTrigger
          className="rounded-full"
          value="dark"
          onClick={() => setTheme("dark")}
        >
          <Moon size={18} />
        </TabsTrigger>
        <TabsTrigger
          className="rounded-full"
          value="system"
          onClick={() => setTheme("system")}
        >
          <LaptopMinimal size={18} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
