import React from "react";
import { AgsError } from "@groundup/ags";
import { Button } from "@/components/ui/button";
import { CircleAlert, SquareArrowUpLeft } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";

const severityColor: Record<AgsError["severity"], string> = {
  error: "text-red-600",
  warning: "text-amber-500",
};

interface ErrorMessageProps {
  error: AgsError;
  setTableRowErrorNumber: React.Dispatch<React.SetStateAction<number>>;
  onView: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
  setSelectedErrorGroup: React.Dispatch<React.SetStateAction<string>>;

}

export default function ErrorMessage({
  error,
  onView,
  onMouseEnter,
  onMouseLeave,
  setSelectedGroup,
  setTableRowErrorNumber,
  setSelectedErrorGroup,
}: ErrorMessageProps) {
  return (
    <div
      className="flex flex-col p-2 gap-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex gap-2 justify-between items-center">
        <div
          className={cn(
            "flex gap-2 items-center",
            severityColor[error.severity]
          )}
        >
          <CircleAlert size={20} />
          <p className="font-semibold">
            {capitalize(error.severity)} at line {error.lineNumber}
          </p>
        </div>
        <Button variant="ghost" size="sm" color="red"   onClick={() => {
          onView(); 
          setSelectedGroup(error.group ?? "");
          setTableRowErrorNumber(error.tableRowLineNumber)
          setSelectedErrorGroup(error.group ?? "")
        }}>
          <SquareArrowUpLeft size={16} className="mr-2" />
          View
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-4">
          <p>
            <strong>Rule: </strong>
            {error.rule}
          </p>
          <p>
            <strong> Group: </strong>
            {error.group ?? "n/a"}
          </p>
          <p>
            <strong> Heading: </strong>
            {error.field ?? "n/a"}
          </p>
        </div>
        <p>
          <strong>Message: </strong>
          {error.message}
        </p>
      </div>
    </div>
  );
}
