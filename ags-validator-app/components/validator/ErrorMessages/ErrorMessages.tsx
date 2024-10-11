import React, { useMemo, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import SortErrors, { sortOptions, SortOptionKey } from "./SortErrors";
import { AgsError } from "@groundup/ags";
import { Separator } from "@/components/ui/separator";
import { CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ErrorTableProps {
  errors: AgsError[];

  setHoverLineNumber: (hoverLineNumber: number | null) => void;
  goToError: (error: AgsError) => void;
}

export default function ErrorMessages({
  errors,
  goToError,
  setHoverLineNumber,
}: ErrorTableProps) {
  const [sortOptionKey, setSortOptionKey] = useState<SortOptionKey | null>(
    null
  );
  const sortedErrors = useMemo(
    () =>
      sortOptionKey
        ? errors.sort(sortOptions[sortOptionKey].compareFn)
        : errors,
    [errors, sortOptionKey]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 justify-between">
        <div className="flex gap-4">
          <h2 className="text-xl font-semibold mb-4">Errors</h2>

          <Badge variant="destructive" className="h-8 gap-1">
            <CircleX size={16} />
            {errors.filter((error) => error.severity === "error").length}
          </Badge>
          <Badge variant="warning" className="h-8 gap-1">
            <CircleX size={16} />
            {errors.filter((error) => error.severity === "warning").length}
          </Badge>
        </div>

        <SortErrors
          activeSortOptionKey={sortOptionKey}
          onChange={setSortOptionKey}
        />
      </div>
      <div className="overflow-auto h-full">
        {errors.length > 0 ? (
          sortedErrors.map((error, index) => (
            <React.Fragment key={`error-message-${index}`}>
              {index > 0 && <Separator className="my-2" />}
              <ErrorMessage
                error={error}
                onView={() => goToError(error)}
                onMouseEnter={() => setHoverLineNumber(error.lineNumber)}
                onMouseLeave={() => setHoverLineNumber(null)}
              />
            </React.Fragment>
          ))
        ) : (
          <p className="text-muted-foreground">No errors or warnings found</p>
        )}
      </div>
    </div>
  );
}
