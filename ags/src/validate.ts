import { AgsDictionaryVersion, AgsError, AgsRaw } from "./types";
import { parseAgs } from "./parse";
import {
  rulesForRawString,
  rulesForParsedAgs,
  rulesForParsedAgsWithDict,
} from "./rules";

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

function validateAgsDataParsedWithDict(
  rawAgs: AgsRaw,
  dictionary: AgsDictionaryVersion,
): AgsError[] {
  let allErrors: AgsError[] = [];

  const parsedRulesAsArray = Object.values(rulesForParsedAgsWithDict);
  parsedRulesAsArray.forEach((step) => {
    const errors = step.validate(rawAgs, dictionary);
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

  let parsedAgs: AgsRaw;
  try {
    parsedAgs = parseAgs(rawAgs);
  } catch (error) {
    return {
      errors: [
        {
          rule: "",
          lineNumber: 1,
          field: "",
          message: "Unknown error parsing AGS data.",
          severity: "error",
        },
      ],
      parsedAgs: undefined,
    };
  }

  const agsErrorsForParsed = validateAgsDataParsed(parsedAgs);

  const agsErrorsForParsedWithDict = validateAgsDataParsedWithDict(
    parsedAgs,
    dictionary,
  );

  return {
    errors: [
      ...agsErrorsForRaw,
      ...agsErrorsForParsed,
      ...agsErrorsForParsedWithDict,
    ],
    parsedAgs: parsedAgs,
  };
}
