import React from "react";
import { AgsError } from "@groundup/ags";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { SquareArrowUpLeft } from "lucide-react";
import SortableHeader from "./SortableHeader";
import DataTable from "./DataTable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalize } from "@/lib/utils";

interface ErrorTableProps {
  errors: AgsError[];
  setActiveLineNumber: (lineNumber: number) => void;
  setHoverLineNumber: (hoverLineNumber: number | null) => void;
}

export default function ErrorTable({
  errors,
  setActiveLineNumber,
  setHoverLineNumber,
}: ErrorTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<AgsError>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center w-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="opacity-0  group-hover:opacity-100" // Tailwind classes
                  onClick={() => setActiveLineNumber(row.original.lineNumber)}
                >
                  <SquareArrowUpLeft className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Go to line</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      accessorKey: "lineNumber",
      header: ({ column }) => <SortableHeader column={column} title="Line" />,
    },
    {
      id: "type",
      accessorFn: (error) => capitalize(error.severity),
      header: ({ column }) => <SortableHeader column={column} title="Type" />,
    },
    {
      accessorKey: "rule",
      header: ({ column }) => <SortableHeader column={column} title="Rule" />,
    },
    {
      accessorKey: "group",
      header: ({ column }) => <SortableHeader column={column} title="Group" />,
    },
    {
      accessorKey: "heading",
      header: ({ column }) => (
        <SortableHeader column={column} title="Heading" />
      ),
    },

    {
      accessorKey: "message",
      header: ({ column }) => (
        <SortableHeader column={column} title="Message" />
      ),
    },
  ];

  const table = useReactTable({
    data: errors,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Errors</h2>
      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        {errors.length > 0 ? (
          <DataTable
            table={table}
            onRowHover={(rowIndex) => {
              const error = table.getRowModel().rows[rowIndex]?.original;
              setHoverLineNumber(error?.lineNumber ?? null);
            }}
            onRowLeave={() => setHoverLineNumber(null)}
          />
        ) : (
          <p className="text-muted-foreground">No errors or warnings found</p>
        )}
      </div>
    </div>
  );
}
