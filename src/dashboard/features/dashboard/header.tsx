"use client";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/data-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import React from "react";
import { PageHeader, PageTitle } from "../page-header/page-header";
import { useDashboardData } from "./dashboard-state";

export const Header = () => {
  return (
    <PageHeader>
      <PageTitle>Dashboard</PageTitle>
      <div className="flex">
        <DatePickerWithRange />
        <ComboboxPopover />
      </div>
    </PageHeader>
  );
};

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

export function ComboboxPopover() {
  const [open, setOpen] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  );

  const { filterLanguage } = useDashboardData();

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Status</p>
      <Button
        onClick={() => {
          filterLanguage("html");
          filterLanguage("javascriptreact");
        }}
      >
        ww
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            we
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((option) => {
                  return (
                    <CommandItem key={option.value}>
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary"
                        )}
                      >
                        <CheckIcon className={cn("h-4 w-4")} />
                      </div>

                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
