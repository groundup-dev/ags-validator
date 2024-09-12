"use client";

import { AgsError, validateAgsData } from "ags";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Validator() {
  const [agsData, setAgsData] = useState("");
  const [errors, setErrors] = useState<AgsError[]>([]); 
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);

  useEffect(() => {
    if (!agsData) {
      setErrors([]);
      setLineNumbers([]);
      return;
    }

    // Update line numbers based on new lines in textarea
    const lines = agsData.split("\n").map((_, index) => String(index + 1));
    setLineNumbers(lines);

    // Validate AGS data
    const agsErrors = validateAgsData(agsData);
    setErrors(agsErrors);
  }, [agsData]);

  return (
    <div className="flex h-auto min-h-screen">
      {/* Left Side: Text Area with Line Numbers */}
      <div className="w-1/2 p-4 flex flex-col">
        <h1 className="text-xl mb-4">AGS Data Validator</h1>

        {/* Container for Line Numbers and Textarea */}
        <div className="flex-1 bg-white rounded border overflow-auto max-h-[87vh]">
          <div className="relative flex bg-gray-50 rounded-lg">
            {/* Line Numbers */}
            <div className="bg-gray-200 text-right pr-4 pt-2 select-none w-[40px] text-gray-600 leading-[1.5rem] font-mono text-sm">    
                {lineNumbers.map((line) => (
                <div key={line}>
                  {line}
                </div>
              ))}
            </div>

            {/* Expanding Textarea */}
            <Textarea
              placeholder="Type your AGS data here..."
              value={agsData}
              onChange={(e) => setAgsData(e.target.value)}
              className="flex-1 rounded-sm resize-none border-none pl-2 overflow-hidden whitespace-pre font-mono leading-[1.5rem] h-auto min-h-[86.823vh]"              // style={{ lineHeight: "1.5rem", height: "auto", minHeight: "86.823vh" }}
              rows={agsData.split("\n").length || 1} // Set rows based on content
            />
          </div>
        </div>
      </div>

      {/* Right Side: Error Display */}
      <div className="w-1/2 p-4 bg-gray-100 flex flex-col">
        <h2 className="text-xl mb-4">Errors</h2>
        <div className="flex-1 bg-white p-2 rounded border overflow-auto max-h-[87vh]">
          <pre className="whitespace-pre-wrap">
            {errors.length > 0 ? JSON.stringify(errors, null, 2) : "No errors found"}
          </pre>
        </div>
      </div>
    </div>
  );
}
