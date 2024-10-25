import React from "react";
import { AgsError } from "@groundup/ags";
import { Button } from "@/components/ui/button";
import { CircleAlert, CircleX } from "lucide-react";
import { MdOutlineOpenInNew } from "react-icons/md";
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
          {error.severity === "error" ? (
            <CircleX size={20} />
          ) : (
            <CircleAlert size={20} />
          )}

          <p className="font-medium">
            {capitalize(error.severity)} at line {error.lineNumber}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          color="red"
          onClick={() => {
            onView();
          }}
        >
          <MdOutlineOpenInNew size={16} className="mr-2" />
          View
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-4">
          <p>
            <span className="font-medium">Rule: </span>
            {error.rule}
          </p>
          <p>
            <span className="font-medium"> Group: </span>
            {error.group ?? "n/a"}
          </p>
          <p>
            <span className="font-medium"> Heading: </span>
            {error.field ?? "n/a"}
          </p>
        </div>
        <p>
          <span className="font-medium">Message: </span>
          {error.message}
        </p>
      </div>
    </div>
  );
}
