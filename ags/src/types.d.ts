export interface HeadingRaw {
  name: string;
  type: string;
  unit: string;
}

// Utility type to extract names from headings
type HeadingNames<T extends HeadingRaw[]> = T[number]["name"];

export interface RowRaw<T extends HeadingRaw[]> {
  // Constrain keys of data to the names from the headings
  data: Record<HeadingNames<T>, string>;
  lineNumber: number;
}

export interface GroupRaw {
  name: string;
  headings: HeadingRaw[];
  rows: RowRaw<this["headings"]>[];
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
  tableRowLineNumber: number;
  tableHeaderNumber: number;
  group?: string;
  field?: string;
  message?: string;
};

export type AgsDictionaryVersion = "v4_0_3" | "v4_1_1" | "v4_1" | "v4_0_4";
