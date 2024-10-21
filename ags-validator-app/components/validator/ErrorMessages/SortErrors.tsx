import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { AgsError } from "@groundup/ags";

export type SortOptionKey = "rule" | "lineNumberAsc" | "lineNumberDesc";

export type SortOption = {
  name: string;
  compareFn: (_e1: AgsError, _e2: AgsError) => number;
};

function parseRule(rule: string | number): number {
  return parseInt(rule.toString().match(/\d+/)![0]);
}

export const sortOptions: Record<SortOptionKey, SortOption> = {
  rule: {
    name: "Rule",
    compareFn: (e1, e2) => parseRule(e1.rule) - parseRule(e2.rule),
  },
  lineNumberAsc: {
    name: "Line number (Asc)",
    compareFn: (e1, e2) => e1.lineNumber - e2.lineNumber,
  },
  lineNumberDesc: {
    name: "Line number (Desc)",
    compareFn: (e1, e2) => e2.lineNumber - e1.lineNumber,
  },
};

interface SortErrorsProps {
  activeSortOptionKey: SortOptionKey | null;
  onChange: (_sortOptionKey: SortOptionKey | null) => void;
}

export default function SortErrors({
  activeSortOptionKey,
  onChange,
}: SortErrorsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <ArrowUpDown className="mr-1" size={16} /> Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {Object.entries(sortOptions).map(([sortOptionKey, sortOption]) => {
          const checked = sortOptionKey === activeSortOptionKey;
          return (
            <DropdownMenuCheckboxItem
              key={sortOptionKey}
              checked={checked}
              onCheckedChange={() =>
                onChange(checked ? null : (sortOptionKey as SortOptionKey))
              }
            >
              {sortOption.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
