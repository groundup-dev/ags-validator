import { AgsError } from "./models";
import { parseAgs } from "./parse";
import { rulesForRawString, rulesForParsedAgs } from "./rules";

// Function to validate raw AGS data using all validation steps
export function validateAgsData(rawAgs: string): AgsError[] {
  let allErrors: AgsError[] = [];

  // this only applies to the rulesForRawString object
  const rulesAsArray = Object.values(rulesForRawString);

  rulesAsArray.forEach((step) => {
    const errors = step.validate(rawAgs);
    allErrors = [...allErrors, ...errors];
  });

  if (allErrors.length > 0) {
    return allErrors;
  }
  //   now the AGS data should be safe to parse into the AgsRaw object
  const parsedAgs = parseAgs(rawAgs);

  const parsedRulesAsArray = Object.values(rulesForParsedAgs);
  parsedRulesAsArray.forEach((step) => {
    const errors = step.validate(parsedAgs);
    allErrors = [...allErrors, ...errors];
  });

  return allErrors;
}
