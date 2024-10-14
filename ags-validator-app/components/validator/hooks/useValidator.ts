// useValidator.ts
import { useCallback, useEffect, useState } from "react";
import {
  validateAgsData,
  AgsError,
  AgsRaw,
  GroupRaw,
  parsedAgsToString,
  AgsDictionaryVersion,
} from "@groundup/ags";

export function useValidator(dictVersion: AgsDictionaryVersion = "v4_0_4") {
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

    const result = validateAgsData(agsData, dictVersion);

    setErrors(result.errors);
    setParsedAgs(result.parsedAgs);

    const lines = agsData.split("\n").map((_, index) => String(index + 1));
    setLineNumbers(lines);
  }, [agsData, dictVersion]);

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
