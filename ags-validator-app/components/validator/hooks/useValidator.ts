// useValidator.ts
import { useEffect, useState } from "react";
import {  validateAgsData } from "ags";
import { AgsError } from "ags/src/models";

export function useValidator() {
  const [agsData, setAgsData] = useState<string>("");
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

  return {
    agsData,
    setAgsData,
    errors,
    lineNumbers,
  };
}
