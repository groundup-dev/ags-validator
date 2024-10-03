import { AgsDictionaryVersion, AgsError, AgsRaw } from "./types";
import { parseAgs } from "./parse";
import { rulesForRawString, rulesForParsedAgs } from "./rules";

function validateAgsDataRaw(rawAgs: string): AgsError[] {
  let allErrors: AgsError[] = [];

  // this only applies to the rulesForRawString object
  const rulesAsArray = Object.values(rulesForRawString);

  rulesAsArray.forEach((step) => {
    const errors = step.validate(rawAgs);
    allErrors = [...allErrors, ...errors];
  });
  return allErrors;
}

function validateAgsDataParsed(rawAgs: AgsRaw): AgsError[] {
  let allErrors: AgsError[] = [];

  const parsedRulesAsArray = Object.values(rulesForParsedAgs);
  parsedRulesAsArray.forEach((step) => {
    const errors = step.validate(rawAgs);
    allErrors = [...allErrors, ...errors];
  });

  return allErrors;
}

// Function to validate raw AGS data using all validation steps
export function validateAgsData(
  rawAgs: string,
  dictionary: AgsDictionaryVersion = "v4_0_4",
): {
  errors: AgsError[];
  parsedAgs?: AgsRaw | undefined;
} {
  const agsErrorsForRaw = validateAgsDataRaw(rawAgs);
  if (
    agsErrorsForRaw.filter((error) => error.severity === "error").length > 0
  ) {
    return {
      errors: agsErrorsForRaw,
      parsedAgs: undefined,
    };
  }

  //   now the AGS data should be safe to parse into the AgsRaw object
  const parsedAgs = parseAgs(rawAgs);

  const agsErrorsForParsed = validateAgsDataParsed(parsedAgs);
  return {
    errors: agsErrorsForParsed,
    parsedAgs: parsedAgs,
  };
}
