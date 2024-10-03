// useValidator.ts
import { useCallback, useEffect, useState } from "react";
import {
  validateAgsData,
  AgsError,
  AgsRaw,
  GroupRaw,
  parsedAgsToString,
} from "@groundup/ags";

export function useValidator() {
  const [agsData, setAgsData] = useState<string>("");
  const [errors, setErrors] = useState<AgsError[]>([]);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [parsedAgs, setParsedAgs] = useState<AgsRaw | undefined>(undefined);

  useEffect(() => {
    if (!agsData) {
      setErrors([]);
      setLineNumbers([]);
      return;
    }

    const result = validateAgsData(agsData);

    setErrors(result.errors);
    setParsedAgs(result.parsedAgs);

    const lines = agsData.split("\n").map((_, index) => String(index + 1));
    setLineNumbers(lines);
  }, [agsData]);

  const setGroup = useCallback(
    (label: string, group: GroupRaw) => {
      const newParsedAgs = { ...parsedAgs, [label]: group };
      const newAgsData = parsedAgsToString(newParsedAgs);
      setAgsData(newAgsData);
    },
    [parsedAgs]
  );

  return {
    agsData,
    setAgsData,
    errors,
    lineNumbers,
    parsedAgs,
    setGroup,
  };
}
