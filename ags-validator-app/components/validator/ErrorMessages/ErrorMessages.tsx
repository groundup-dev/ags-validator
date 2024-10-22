import React, { useMemo, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import ErrorMessage from "./ErrorMessage";
import SortErrors, { sortOptions, SortOptionKey } from "./SortErrors";
import { AgsError } from "@groundup/ags";
import { Separator } from "@/components/ui/separator";
import { CircleAlert, CircleX, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/redux/hooks";

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

  // Virtualization setup
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedErrors.length, // The number of rows (errors)
    getScrollElement: () => parentRef.current, // The parent container ref
    estimateSize: () => 150, // Estimated row size, can adjust based on your design
    overscan: 5, // Buffer items to render offscreen
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-4">
          <h2 className="text-xl font-semibold mb-4">Errors</h2>

          <button
            onClick={() =>
              setSeverityFilter(severityFilter === "error" ? null : "error")
            }
          >
            <Badge
              variant="destructive"
              className={
                severityFilter === "error"
                  ? "h-7 gap-1 ring-2 ring-offset-2 ring-destructive"
                  : "h-7 gap-1 "
              }
            >
              <CircleX size={16} />
              {errors.filter((error) => error.severity === "error").length}
            </Badge>
          </button>
          <button
            onClick={() =>
              setSeverityFilter(severityFilter === "warning" ? null : "warning")
            }
          >
            <Badge
              variant="warning"
              className={
                severityFilter === "warning"
                  ? "h-7 gap-1 ring-2 ring-offset-2 ring-warning"
                  : "h-7 gap-1"
              }
            >
              <CircleAlert size={16} />
              {errors.filter((error) => error.severity === "warning").length}
            </Badge>
          </button>
          {isLoading && <LoaderCircle className="animate-spin w-6 h-6 gap-1" />}
        </div>

        <SortErrors
          activeSortOptionKey={sortOptionKey}
          onChange={setSortOptionKey}
        />
      </div>

      <div
        ref={parentRef}
        className="overflow-auto h-full relative" // Added relative positioning for virtualization
      >
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
          <p className="text-muted-foreground">No errors or warnings found</p>
        )}
      </div>
    </div>
  );
}
