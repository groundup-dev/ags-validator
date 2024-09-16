import React, { useState, useEffect } from 'react';
import CodeMirrorTextArea from './CodeMirrorTextArea';
import { AgsError } from "ags/src/models";

interface ValidatorTextAreaProps {
  agsData: string;
  setAgsData: React.Dispatch<React.SetStateAction<string>>;
  errors: AgsError[];
}

const ValidatorTextArea: React.FC<ValidatorTextAreaProps> = ({
  agsData,
  setAgsData,
  errors,
}) => {
  const [highlightLineNumbers, setHighlightLineNumbers] = useState<number[]>([]);

  useEffect(() => {
    // Extract unique line numbers from errors
    const lineNumbersSet = new Set<number>(errors.map(error => error.lineNumber));
    setHighlightLineNumbers(Array.from(lineNumbersSet)); // Convert Set to Array
  }, [errors]);

  return (
    <div className="w-1/2 p-4 flex flex-col">
      <h1 className="text-xl mb-4">AGS Data Validator</h1>
      {/* Container for Line Numbers and Textarea */}
      <div className="flex-1 bg-white rounded border overflow-auto max-h-[82vh]">
        <div className="relative flex bg-gray-50 rounded-lg">
          <CodeMirrorTextArea
            agsData={agsData}
            setAgsData={setAgsData}
            highlightLineNumbers={highlightLineNumbers} // Pass the line numbers to highlight
          />
        </div>
      </div>
    </div>
  );
};

export default ValidatorTextArea;
