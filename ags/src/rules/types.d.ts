import { AgsRaw, AgsError } from "../types";

// abstract version of the validation step
export type AgsValidationStep<TInputType extends string | AgsRaw> = {
  rule: number | string;
  description: string;
  validate: (rawAgs: TInputType) => AgsError[];
};
