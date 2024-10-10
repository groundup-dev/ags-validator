import React, { useMemo, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import SortErrors, { sortOptions, SortOptionKey } from "./SortErrors";
import { AgsError } from "@groundup/ags";
import { Separator } from "@/components/ui/separator";

interface ErrorTableProps {
  errors: AgsError[];
  setActiveLineNumber: (lineNumber: number) => void;
  setHoverLineNumber: (hoverLineNumber: number | null) => void;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
  setTableRowErrorNumber: React.Dispatch<React.SetStateAction<number>>;
  setTableHeaderErrorNumber: React.Dispatch<React.SetStateAction<number>>;
  setSelectedErrorGroup: React.Dispatch<React.SetStateAction<string>>;
}

export default function ErrorMessages({
  errors,
  setActiveLineNumber,
  setHoverLineNumber,
  setSelectedGroup,
  setTableRowErrorNumber,
  setTableHeaderErrorNumber,
  setSelectedErrorGroup,
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
        <h2 className="text-xl font-semibold mb-4">Errors</h2>
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
                setTableRowErrorNumber={setTableRowErrorNumber}
                setTableHeaderErrorNumber={setTableHeaderErrorNumber}
                onView={() => setActiveLineNumber(error.lineNumber)}
                onMouseEnter={() => setHoverLineNumber(error.lineNumber)}
                onMouseLeave={() => setHoverLineNumber(null)}
                setSelectedGroup={setSelectedGroup}
                setSelectedErrorGroup={setSelectedErrorGroup}

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
