import React from "react";
import { AgsError } from "@groundup/ags";
import ErrorMessage from "./ErrorMessage";
import { Separator } from "@/components/ui/separator";

interface ErrorTableProps {
  errors: AgsError[];
  setActiveLineNumber: (lineNumber: number) => void;
  setHoverLineNumber: (hoverLineNumber: number | null) => void;
}

export default function ErrorMessages({
  errors,
  setActiveLineNumber,
  setHoverLineNumber,
}: ErrorTableProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">Errors</h2>
      <div className="overflow-auto h-full">
        {errors.length > 0 ? (
          errors.map((error, index) => (
            <React.Fragment key={`error-message-${index}`}>
              {index > 0 && <Separator className="my-2" />}
              <ErrorMessage
                error={error}
                onView={() => setActiveLineNumber(error.lineNumber)}
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
