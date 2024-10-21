import React, { useMemo, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import SortErrors, { sortOptions, SortOptionKey } from "./SortErrors";
import { AgsError } from "@groundup/ags";
import { Separator } from "@/components/ui/separator";
import { CircleX, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/redux/hooks";

interface ErrorTableProps {
  goToError: (error: AgsError) => void;
}

export default function ErrorMessages({ goToError }: ErrorTableProps) {
  const errors = useAppSelector((state) => state.ags.errors);
  const isLoading = useAppSelector((state) => state.ags.loading);

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

          <Badge variant="destructive" className="h-7 gap-1 ">
            <CircleX size={16} />
            {errors.filter((error) => error.severity === "error").length}
          </Badge>
          <Badge variant="warning" className="h-7 gap-1">
            <CircleX size={16} />
            {errors.filter((error) => error.severity === "warning").length}
          </Badge>
          {isLoading && <LoaderCircle className="animate-spin w-6 h-6 gap-1" />}
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
              <ErrorMessage error={error} onView={() => goToError(error)} />
            </React.Fragment>
          ))
        ) : (
          <p className="text-muted-foreground">No errors or warnings found</p>
        )}
      </div>
    </div>
  );
}
