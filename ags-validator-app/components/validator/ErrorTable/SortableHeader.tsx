import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TRow> {
  column: Column<TRow, unknown>;
  title: string;
}

function SortableHeader<TRow>({ column, title }: SortableHeaderProps<TRow>) {
  return (
    <div
      className="flex items-center group cursor-pointer"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4 opacity-100" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4 opacity-100" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100" />
      )}
    </div>
  );
}

export default SortableHeader;
