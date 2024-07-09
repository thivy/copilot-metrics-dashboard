"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Sliders, Square, SquareCheck } from "lucide-react";
import { DropdownItem } from "../dashboard-state";

export function DropdownFilter({
  name,
  onSelect,
  selectedItems,
  allItems,
  itemIsSelected,
}: {
  name: string;
  onSelect: (name: string) => void;
  selectedItems: DropdownItem[];
  allItems: DropdownItem[];
  itemIsSelected: (name: string) => boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="space-x-2 font-normal">
            <Sliders size={16} />
            <span> {name}</span>
            <Badge variant={"secondary"}>{selectedItems.length}</Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {allItems.map((option) => {
                  return (
                    <CommandItem
                      key={option.name}
                      onSelect={onSelect}
                      value={option.name}
                    >
                      <div
                        className={cn("mr-2 flex items-center justify-center")}
                      >
                        {itemIsSelected(option.name) ? (
                          <SquareCheck
                            className={cn("text-muted-foreground")}
                            size={22}
                            strokeWidth={1.1}
                          />
                        ) : (
                          <Square
                            className={cn("text-muted-foreground")}
                            size={22}
                            strokeWidth={1.1}
                          />
                        )}
                      </div>
                      <span className="">
                        <span> {option.name} </span>
                      </span>
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
