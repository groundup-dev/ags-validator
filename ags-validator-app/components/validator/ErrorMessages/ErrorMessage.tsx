import React from "react";
import { AgsError } from "@groundup/ags";
import { Button } from "@/components/ui/button";
import { CircleAlert, SquareArrowUpLeft } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";

const severityColor: Record<AgsError["severity"], string> = {
  error: "text-destructive",
  warning: "text-warning",
};

interface ErrorMessageProps {
  error: AgsError;
  onView: () => void;
}

export default function ErrorMessage({ error, onView }: ErrorMessageProps) {
  return (
    <div className="flex flex-col p-2 gap-1">
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
        <Button
          variant="ghost"
          size="sm"
          color="red"
          onClick={() => {
            onView();
          }}
        >
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
