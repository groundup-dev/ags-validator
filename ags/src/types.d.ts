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

type AgsDictionaryGroups = "TYPE" | "UNIT" | "ABBR" | "DICT" | "PROJ" | "TRAN";

export interface AgsDictionary extends AgsRaw {
  TYPE: GroupRaw;
  UNIT: GroupRaw;
  ABBR: GroupRaw;
  DICT: GroupRaw;
  PROJ: GroupRaw;
  TRAN: GroupRaw;
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

export type AgsDictionaryVersion = "v4_0_3" | "v4_1_1" | "v4_1" | "v4_0_4";
