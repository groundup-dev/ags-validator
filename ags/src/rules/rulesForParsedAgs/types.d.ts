import { AgsDictionaryVersion, AgsError, AgsRaw } from "../../types";
import { AgsValidationStep } from "../types";

export type AgsValidationStepParsed = AgsValidationStep<AgsRaw>;

export type AgsValidationStepParsedWithDict = AgsValidationStep<AgsRaw> & {
  validate: (rawAgs: AgsRaw, dictVersion: AgsDictionaryVersion) => AgsError[];
};
