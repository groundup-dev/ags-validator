// useValidator.ts
import { useEffect, useState } from "react";
import { validateAgsData, AgsError } from "ags";

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

    // Validate AGS data
    const result = validateAgsData(agsData);

    setErrors(result.errors);

    // Update line numbers based on new lines in textarea
    const lines = agsData.split("\n").map((_, index) => String(index + 1));
    setLineNumbers(lines);
  }, [agsData]);

  return {
    agsData,
    setAgsData,
    errors,
    lineNumbers,
  };
}
