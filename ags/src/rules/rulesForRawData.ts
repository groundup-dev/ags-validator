import { AgsError } from "../types";
import { AgsValidationStep } from "./types";

type AgsValidationStepRaw = AgsValidationStep<string>;
// Helper function to check if a line contains extended ASCII characters
function isAgsAscii(line: string): boolean {
  return [...line].every((char) => char.charCodeAt(0) < 128);
}

// Validation Step: Rule 1 - Check for ASCII characters
const rule1: AgsValidationStepRaw = {
  rule: 1,
  description:
    "AGS Format Rule 1: The file shall be entirely composed of ASCII characters.",
  validate: (rawAgs: string): AgsError[] => {
    const agsErrors: AgsError[] = [];
    const lines = rawAgs.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      if (!isAgsAscii(line)) {
        const message = `Has Non-ASCII character(s) (assuming that file encoding is 'utf-8').`;
        agsErrors.push({
          rule: 1,
          lineNumber,
          message,
          severity: "error",
        });
      }
    });

    return agsErrors;
  },
};

// Validation Step: Rule 2a - Check if each line ends with CR and LF
const rule2a: AgsValidationStepRaw = {
  rule: "2a",
  description:
    "AGS Format Rule 2a: Each line should be delimited by a carriage return and line feed.",

  validate: function (rawAgs: string): AgsError[] {
    const agsErrors: AgsError[] = [];
    let lineNumber = 1;
    let i = 0;

    while (i < rawAgs.length) {
      // Find the index of the next newline
      const crlfIndex = rawAgs.indexOf("\r\n", i);

      // If no more CRLF is found, check the remaining string
      if (crlfIndex === -1) {
        if (i < rawAgs.length) {
          agsErrors.push({
            rule: this.rule,
            lineNumber,
            message: "Line is not terminated by <CR> and <LF> characters.",
            severity: "warning",
          });
        }
        break;
      }

      // Increment line count and set the index to the next position after CRLF
      lineNumber++;
      i = crlfIndex + 2;
    }

    return agsErrors;
  },
};

// Validation Step: Rule 3 - Check for valid data descriptor at the start of each line
const rule3: AgsValidationStepRaw = {
  rule: 3,
  description:
    "AGS Format Rule 3: Each line should start with a data descriptor that defines its contents.",
  validate: function (rawAgs: string): AgsError[] {
    const agsErrors: AgsError[] = [];
    const lines = rawAgs.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      if (!line.trim()) return; // Skip empty lines

      const lineItems = line
        .trim()
        .split('","')
        .map((item) => item.replace(/"/g, ""));

      if (
        lineItems.length === 0 ||
        !["GROUP", "HEADING", "TYPE", "UNIT", "DATA"].includes(lineItems[0])
      ) {
        agsErrors.push({
          rule: this.rule,
          lineNumber,
          message: "Does not start with a valid data descriptor.",
          severity: "error",
        });
      }
    });

    return agsErrors;
  },
};

// Validation Step: Rule 4.1 - A GROUP row should only contain the GROUP name as data
const rule4_1: AgsValidationStepRaw = {
  rule: "4.1",
  description:
    "AGS Format Rule 4: A GROUP row should only contain the GROUP name as data.",
  validate: function (rawAgs: string): AgsError[] {
    const agsErrors: AgsError[] = [];
    const lines = rawAgs.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      if (line.startsWith('"GROUP"')) {
        const lineItems = line
          .trim()
          .split('","')
          .map((item) => item.replace(/"/g, ""));

        if (lineItems.length > 2) {
          agsErrors.push({
            rule: this.rule,
            lineNumber,
            field: lineItems[1],
            message: "GROUP row has more than one field.",
            severity: "error",
          });
        } else if (lineItems.length < 2) {
          agsErrors.push({
            rule: this.rule,
            lineNumber,
            field: "",
            message: "GROUP row is malformed.",
            severity: "error",
          });
        }
      }
    });

    return agsErrors;
  },
};

// Validation Step: Rule 4.2 - UNIT, TYPE, and DATA rows should have entries defined by the HEADING row
const rule4_2: AgsValidationStepRaw = {
  rule: "4.2",
  description:
    "AGS Format Rule 4: UNIT, TYPE, and DATA rows should have entries defined by the HEADING row.",
  validate: function (rawAgs: string): AgsError[] {
    const errors: AgsError[] = [];
    const lines = rawAgs.split(/\r?\n/);
    let headings: string[] = [];
    let currentGroup = "";

    // Track the presence of UNIT, TYPE, and DATA rows for the current group
    let hasUnit = false;
    let hasType = false;
    let hasData = false;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const fields = line
        .trim()
        .split('","')
        .map((item) => item.replace(/"/g, ""));

      if (fields[0] === "GROUP") {
        // If we're starting a new group, check if the previous one had UNIT, TYPE, and DATA
        if (currentGroup && (!hasUnit || !hasType || !hasData)) {
          errors.push({
            rule: this.rule,
            lineNumber: -1, // No specific line number, but group level error
            group: currentGroup,
            message: `Group "${currentGroup}" is missing one of UNIT, TYPE, or DATA rows.`,
            severity: "error",
          });
        }
        // Reset the tracking variables for the new group
        currentGroup = fields[1];
        if (currentGroup === undefined || currentGroup === "") {
          errors.push({
            rule: this.rule,
            lineNumber,
            message: "GROUP row is malformed.",
            severity: "error",
          });
        }
        headings = []; // Reset headings
        hasUnit = false;
        hasType = false;
        hasData = false;
      }

      if (fields[0] === "HEADING") {
        headings = fields.slice(1); // Capture headings for subsequent validation
      }

      if (["UNIT", "TYPE", "DATA"].includes(fields[0])) {
        if (headings.length === 0) {
          // Add error if the headings row is missing for the current group

          // we only want to add one error per group, so we check if the current group has already been flagged
          const groupAlreadyFlagged = errors.some(
            (error) =>
              error.group === currentGroup &&
              error.message === "Headings row missing.",
          );

          if (!groupAlreadyFlagged) {
            errors.push({
              rule: this.rule,
              lineNumber: -1, // Use -1 to indicate a missing row rather than a specific line
              group: currentGroup,
              message: "Headings row missing.",
              severity: "error",
            });
          }
        } else if (fields.length - 1 !== headings.length) {
          // Add error if the number of fields does not match the HEADING row
          errors.push({
            rule: this.rule,
            lineNumber,
            group: currentGroup,
            message: "Number of fields does not match the HEADING row.",
            severity: "error",
          });
        }

        if (fields[0] === "UNIT") hasUnit = true;
        if (fields[0] === "TYPE") hasType = true;
        if (fields[0] === "DATA") hasData = true;
      }
    });

    // Check if the last group also had UNIT, TYPE, and DATA rows
    if (currentGroup && (!hasUnit || !hasType || !hasData)) {
      errors.push({
        rule: this.rule,
        lineNumber: -1, // No specific line number, but group level error
        group: currentGroup,
        message: `Group "${currentGroup}" is missing one of UNIT, TYPE, or DATA rows.`,
        severity: "error",
      });
    }

    return errors;
  },
};

const rule5: AgsValidationStepRaw = {
  rule: "5",
  description:
    'AGS Format Rule: DATA DESCRIPTORS, GROUP names, data field HEADINGs, data field UNITs, data field TYPEs, and data VARIABLEs shall be enclosed in double quotes ("). Any quotes within a data item must be defined with a second quote e.g., "he said ""hello""".',
  validate: function (rawAgs: string): AgsError[] {
    const errors: AgsError[] = [];
    const lines = rawAgs.split(/\r?\n/); // Split by newlines to get individual lines.

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Skip empty or whitespace-only lines
      if (!line.trim()) return;

      // Use regex to extract fields
      const regex = /"(?:[^"]|"")*"/g; // Matches fields with properly escaped quotes and enclosed in double quotes.
      const fields = line.match(regex);

      // Check if all fields were matched, otherwise there are fields not enclosed in double quotes
      if (!fields || fields.join(",") !== line) {
        errors.push({
          rule: this.rule,
          lineNumber,
          message: `Fields are not properly enclosed in double quotes.`,
          severity: "error",
        });
      } else {
        // Check for improperly escaped quotes within each field.
        fields.forEach((field) => {
          // Remove the enclosing quotes and check the internal quotes
          const fieldContent = field.slice(1, -1); // Remove surrounding double quotes

          // If there is a single double-quote not followed by another double-quote, it's an error
          if (/[^"]"[^"]/.test(fieldContent)) {
            errors.push({
              rule: this.rule,
              lineNumber,
              message: `Field contains quotes that are not properly escaped.`,
              severity: "error",
            });
          }
        });
      }
    });

    return errors;
  },
};

export const rulesForRawString = {
  rule1,
  rule2a,
  rule3,
  rule4_1,
  rule4_2,
  rule5,
};
