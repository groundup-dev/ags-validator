// useValidator.ts
import { useEffect, useState } from "react";
import { validateAgsData } from "ags";
import type { AgsError } from "ags/src/models";

export function useValidator() {
  const [agsData, setAgsData] = useState<string>("");
  const [errors, setErrors] = useState<AgsError[]>([]);

  useEffect(() => {
    if (!agsData) {
      setErrors([]);
      return;
    }


    // Validate AGS data
    const agsErrors = validateAgsData(agsData);
    setErrors(agsErrors);
  }, [agsData]);

  return {
    agsData,
    setAgsData,
    errors,
  };
}
