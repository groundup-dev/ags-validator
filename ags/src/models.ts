import { z } from "zod";

export interface HeadingRaw {
  name: string;
  type: string;
  unit: string;
}

export interface RowRaw {
  data: Record<string, string>;
  lineNumber: number;
}

export interface GroupRaw {
  name: string;
  headings: HeadingRaw[];
  rows: RowRaw[];
  lineNumber: number;
}

export interface AgsRaw {
  [key: string]: GroupRaw;
}

// Define the structure for error messages
export interface AgsError {
  rule: number | string;
  lineNumber: number;
  group?: string;
  field?: string;
  message?: string;
}

// Define the structure for validation steps

// AGS4 data type according to
// https://www.ags.org.uk/content/uploads/2022/02/AGS4-v-4.1.1-2022.pdf
export const dataTypeSchema = z.union([
  z.literal("ID"),
  z.literal("PA"),
  z.literal("PT"),
  z.literal("PU"),
  z.literal("X"),
  z.literal("XN"),
  z.literal("T"),
  z.literal("DT"),
  z.string().regex(/\dDP/),
  z.string().regex(/\dSF/),
  z.string().regex(/\dSCI/),
  z.literal("U"),
  z.literal("DMS"),
  z.literal("YN"),
  z.literal("RL"),
]);
