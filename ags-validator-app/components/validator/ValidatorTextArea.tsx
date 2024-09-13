import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ValidatorTextAreaProps {
  agsData: string;
  setAgsData: React.Dispatch<React.SetStateAction<string>>;
  lineNumbers: string[];
}

const ValidatorTextArea: React.FC<ValidatorTextAreaProps> = ({
  agsData,
  setAgsData,
  lineNumbers,
}) => {
  return (
    <div className="w-1/2 p-4 flex flex-col">
      <h1 className="text-xl mb-4">AGS Data Validator</h1>

      {/* Container for Line Numbers and Textarea */}
      <div className="flex-1 bg-white rounded border overflow-auto max-h-[82vh]">
        <div className="relative flex bg-gray-50 rounded-lg">
          {/* Line Numbers */}
          <div
            className="bg-gray-200 text-right pr-4 pt-2 select-none text-gray-600 leading-[1.5rem] font-mono text-sm w-[calc(6ch+16px)]"
          >
            {lineNumbers.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>

          {/* Expanding Textarea */}
          <Textarea
            placeholder="Type your AGS data here..."
            value={agsData}
            onChange={(e) => setAgsData(e.target.value)}
            className="flex-1 rounded-sm resize-none border-none pl-2 whitespace-pre font-mono leading-[1.5rem] h-auto min-h-[81.823vh] overflow-x-auto overflow-y-hidden"
            rows={agsData.split("\n").length || 1} // Set rows based on content
          />
        </div>
      </div>
    </div>
  );
};

export default ValidatorTextArea;
