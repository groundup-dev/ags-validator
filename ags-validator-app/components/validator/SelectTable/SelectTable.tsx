"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AgsRaw } from "@groundup/ags";
import { Label } from "@/components/ui/label";

type Props = {
  parsedAgs: AgsRaw | undefined;
  selectedGroup: string;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
};

export default function SelectTable({
  parsedAgs,
  selectedGroup,
  setSelectedGroup,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const groups = parsedAgs
    ? Object.keys(parsedAgs).map((key) => ({
        value: key,
        label: key,
      }))
    : [];
    
  return (
    <div className="grid items-center gap-1.5 mb-4">
      <Label htmlFor="selectTable">Select Group</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            id="selectTable"
          >
            {selectedGroup
              ? groups.find((group) => group.value === selectedGroup)?.label
              : ""}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search group..." />
            <CommandList>
              <CommandEmpty>No group found.</CommandEmpty>
              <CommandGroup>
                {groups.map((group) => (
                  <CommandItem
                    key={group.value}
                    value={group.value}
                    onSelect={(currentValue) => {
                      setSelectedGroup(
                        currentValue === selectedGroup ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedGroup === group.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {group.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
