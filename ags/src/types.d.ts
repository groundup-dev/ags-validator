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
export type AgsError = {
  rule: number | string;
  severity: "error" | "warning";
  lineNumber: number;
  group?: string;
  field?: string;
  message?: string;
};
