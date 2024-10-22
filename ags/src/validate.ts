import { AgsDictionaryVersion, AgsError, AgsRaw } from "./types";
import { parseAgs } from "./parse";
import {
  rulesForRawString,
  rulesForParsedAgs,
  rulesForParsedAgsWithDict,
} from "./rules";

type RuleName =
  | keyof typeof rulesForRawString
  | keyof typeof rulesForParsedAgs
  | keyof typeof rulesForParsedAgsWithDict;

export type RulesConfig = {
  [key in RuleName]: boolean;
};

// happy to overwrite ts here

export const defaultRulesConfig = Object.fromEntries(
  [
    ...Object.keys(rulesForParsedAgs),
    ...Object.keys(rulesForParsedAgsWithDict),
    ...Object.keys(rulesForRawString),
  ].map((rule) => [rule, true]),
) as RulesConfig;

function validateAgsDataRaw(rawAgs: string, config?: RulesConfig): AgsError[] {
  let allErrors: AgsError[] = [];

  console.log("rulesConfig", config);
  const rulesConfig = config || defaultRulesConfig;

  Object.entries(rulesForRawString).forEach(([key, value]) => {
    if (!rulesConfig[key as RuleName]) {
      return;
    }

    const errors = value.validate(rawAgs);
    allErrors = [...allErrors, ...errors];
  });
  return allErrors;
}

export function validateAgsDataParsed(
  rawAgs: AgsRaw,
  config?: RulesConfig,
): AgsError[] {
  const rulesConfig = config || defaultRulesConfig;
  let allErrors: AgsError[] = [];

  Object.entries(rulesForParsedAgs).forEach(([key, value]) => {
    if (!rulesConfig[key as RuleName]) {
      return;
    }

    const errors = value.validate(rawAgs);
    allErrors = [...allErrors, ...errors];
  });

  return allErrors;
}

export function validateAgsDataParsedWithDict(
  rawAgs: AgsRaw,
  dictionary: AgsDictionaryVersion,
  config?: RulesConfig,
): AgsError[] {
  let allErrors: AgsError[] = [];
  const rulesConfig = config || defaultRulesConfig;

  Object.entries(rulesForParsedAgsWithDict).forEach(([key, value]) => {
    if (!rulesConfig[key as RuleName]) {
      return;
    }

    const errors = value.validate(rawAgs, dictionary);
    allErrors = [...allErrors, ...errors];
  });

  return allErrors;
}

// Function to validate raw AGS data using all validation steps
export function validateAgsData(
  rawAgs: string,
  dictionary: AgsDictionaryVersion = "v4_0_4",
  config?: RulesConfig,
): {
  errors: AgsError[];
  parsedAgs?: AgsRaw | undefined;
} {
  const agsErrorsForRaw = validateAgsDataRaw(rawAgs, config);
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
  } catch {
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

  const agsErrorsForParsed = validateAgsDataParsed(parsedAgs, config);

  const agsErrorsForParsedWithDict = validateAgsDataParsedWithDict(
    parsedAgs,
    dictionary,
    config,
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
