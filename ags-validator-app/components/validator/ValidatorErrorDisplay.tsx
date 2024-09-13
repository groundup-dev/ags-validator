// ErrorDisplay.tsx
import { AgsError } from "ags/src/models";
import React from "react";
import ErrorTable from "./ErrorTable";

interface ValidatorErrorDisplayProps {
  errors: AgsError[];
}

const ValidatorErrorDisplay: React.FC<ValidatorErrorDisplayProps> = ({
  errors,
}) => {
  return (
    <div className="w-1/2 p-4 bg-gray-100 flex flex-col">
      <h2 className="text-xl mb-4">Errors</h2>
      <div className="flex-1 bg-white p-2 rounded border overflow-auto max-h-[82vh]">
        <pre className="whitespace-pre-wrap">
          <ErrorTable errors={errors} />
        </pre>
      </div>
    </div>
  );
};

export default ValidatorErrorDisplay;