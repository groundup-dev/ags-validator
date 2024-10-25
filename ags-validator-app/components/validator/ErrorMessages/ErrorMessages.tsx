import React, { useMemo, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ErrorMessage from "./ErrorMessage";
import SortErrors, { sortOptions, SortOptionKey } from "./SortErrors";
import { AgsError } from "@groundup/ags";
import { Separator } from "@/components/ui/separator";
import { CircleAlert, CircleX, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";

interface ErrorTableProps {
  goToError: (error: AgsError) => void;
}

export default function ErrorMessages({ goToError }: ErrorTableProps) {
  const errors = useAppSelector((state) => state.ags.errors);
  const isLoading = useAppSelector((state) => state.ags.loading);

  const [severityFilter, setSeverityFilter] = useState<
    "error" | "warning" | null
  >(null);

  const filteredErrors = useMemo(() => {
    return severityFilter
      ? errors.filter((error) => error.severity === severityFilter)
      : errors;
  }, [errors, severityFilter]);

  const [sortOptionKey, setSortOptionKey] = useState<SortOptionKey | null>(
    null
  );
  const sortedErrors = useMemo(() => {
    return sortOptionKey
      ? [...filteredErrors].sort(sortOptions[sortOptionKey].compareFn)
      : filteredErrors;
  }, [sortOptionKey, filteredErrors]);

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedErrors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 justify-between border-b p-4 items-center">
        <h3 className="text-xl font-semibold">Errors</h3>
        <div className="flex gap-4 items-center">
          {isLoading && <LoaderCircle className="animate-spin w-4 h-4" />}
          <div className="flex gap-2">
            <button
              onClick={() =>
                setSeverityFilter(severityFilter === "error" ? null : "error")
              }
            >
              <Badge
                variant="destructive"
                className={cn(
                  "h-7 m-0 gap-1",
                  severityFilter === "error"
                    ? "ring-2 ring-offset-2 ring-destructive"
                    : null
                )}
              >
                <CircleX size={16} />
                {errors.filter((error) => error.severity === "error").length}
              </Badge>
            </button>
            <button
              onClick={() =>
                setSeverityFilter(
                  severityFilter === "warning" ? null : "warning"
                )
              }
            >
              <Badge
                variant="warning"
                className={cn(
                  "h-7 m-0 gap-1",
                  severityFilter === "warning"
                    ? "ring-2 ring-offset-2 ring-warning"
                    : null
                )}
              >
                <CircleAlert size={16} />
                {errors.filter((error) => error.severity === "warning").length}
              </Badge>
            </button>
          </div>
          <SortErrors
            activeSortOptionKey={sortOptionKey}
            onChange={setSortOptionKey}
          />
        </div>
      </div>

      <div ref={parentRef} className="overflow-auto h-full relative p-4">
        {errors.length > 0 ? (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const error = sortedErrors[virtualRow.index];

              return (
                <div
                  key={`error-message-${virtualRow.index}`}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {virtualRow.index > 0 && <Separator className="my-2" />}
                  <ErrorMessage error={error} onView={() => goToError(error)} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 w-full text-center">No errors or warnings found</p>
        )}
      </div>
    </div>
  );
}
