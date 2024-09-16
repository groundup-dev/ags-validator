import React, { useState } from 'react';
import CodeMirrorTextArea from './CodeMirrorTextArea';
import { AgsError } from "ags/src/models";

interface ValidatorTextAreaProps {
  agsData: string;
  setAgsData: React.Dispatch<React.SetStateAction<string>>;
  lineNumbers: string[];
  errors: AgsError[];
}

const ValidatorTextArea: React.FC<ValidatorTextAreaProps> = ({
  agsData,
  setAgsData,
  lineNumbers,
  errors
}) => {
  const [highlightLine, setHighlightLine] = useState<number | undefined>();

  return (
    <div className="w-1/2 p-4 flex flex-col h-full">
      <h1 className="text-xl mb-4">AGS Data Validator</h1>

      <div className="flex-1 bg-white rounded border overflow-auto max-h-[82vh] flex">
        <div className="relative flex flex-col flex-1 bg-gray-50 rounded-lg">
        <div className="relative flex bg-gray-50 rounded-lg">
          <CodeMirrorTextArea
            agsData={agsData}
            setAgsData={setAgsData}
            highlightLineNumber={highlightLine} // Pass the line number to highlight
          />
        </div></div>
      </div>
    </div>
  );
};

export default ValidatorTextArea;
