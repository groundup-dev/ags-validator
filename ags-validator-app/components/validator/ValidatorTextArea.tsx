import React from 'react';
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
  // Extract line numbers from errors array
  const errorLines = errors.map(error => error.lineNumber);

  return (
    <div className="w-1/2 p-4 flex flex-col">
      <h1 className="text-xl mb-4">AGS Data Validator</h1>
      
      {/* CodeMirror TextArea with error line highlighting */}
      <CodeMirrorTextArea
        agsData={agsData}
        setAgsData={setAgsData}
        errorLines={errorLines} // Pass error line numbers
      />
    </div>
  );
};

export default ValidatorTextArea;
