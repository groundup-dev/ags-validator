import { rule19, rule19a, rule19b, rule7 } from "./checkGroupAndHeadings";
import { rule10a, rule10b, rule10c, rule9 } from "./checkHeadingsWithDict";
import { rule8 } from "./checkDataTypes";
import {
  AgsValidationStepParsed,
  AgsValidationStepParsedWithDict,
} from "./types";

export const rulesForParsedAgs: Record<string, AgsValidationStepParsed> = {
  rule7,
  rule8,
  rule19,
  rule19a,
  rule19b,
};

export const rulesForParsedAgsWithDict: Record<
  string,
  AgsValidationStepParsedWithDict
> = {
  rule10a,
  rule10b,
  rule10c,
  rule9,
};
