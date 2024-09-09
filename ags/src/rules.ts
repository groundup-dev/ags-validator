import { z } from "zod";
import { AgsError, AgsRaw, HeadingRaw } from "./models";
import { createZodSchemasForHeadings } from "./createSchemas";

// abstract version of the validation step
interface AgsValidationStep<TInputType extends string | AgsRaw> {
  rule: number | string;
  description: string;
  validate: (rawAgs: TInputType) => AgsError[];
}

type AgsValidationStepRaw = AgsValidationStep<string>;
type AgsValidationStepParsed = AgsValidationStep<AgsRaw>;

// Helper function to check if a line contains extended ASCII characters
function isAgsAscii(line: string): boolean {
  // Checks for extended ASCII characters (128 to 255 range)
  return [...line].every((char) => char.charCodeAt(0) < 256);
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
          });
        } else if (lineItems.length < 2) {
          agsErrors.push({
            rule: this.rule,
            lineNumber,
            field: "",
            message: "GROUP row is malformed.",
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

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const fields = line
        .trim()
        .split('","')
        .map((item) => item.replace(/"/g, ""));

      if (fields[0] === "GROUP") {
        currentGroup = fields[1] || ""; // Update the current group name
      }

      if (fields[0] === "HEADING") {
        headings = fields.slice(1); // Capture headings for subsequent validation
      }

      if (["UNIT", "TYPE", "DATA"].includes(fields[0])) {
        if (headings.length === 0) {
          // Add error if the headings row is missing for the current group

          errors.push({
            rule: this.rule,
            lineNumber: -1, // Use -1 to indicate a missing row rather than a specific line
            group: currentGroup,
            message: "Headings row missing.",
          });
        } else if (fields.length - 1 !== headings.length) {
          // Add error if the number of fields does not match the HEADING row
          errors.push({
            rule: this.rule,
            lineNumber,
            field: currentGroup,
            message: "Number of fields does not match the HEADING row.",
          });
        }
      }
    });

    return errors;
  },
};

const rule5: AgsValidationStepRaw = {
  rule: "5",
  description:
    'AGS Format Rule: DATA DESCRIPTORS, GROUP names, data field HEADINGs, data field UNITs, data field TYPEs, and data VARIABLEs shall be enclosed in double quotes ("). Any quotes within a data item must be defined with a second quote e.g., "he said ""hello""".',
  validate: function (rawAgs: string): AgsError[] {
    const errors: AgsError[] = [];
    const lines = rawAgs.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Skip empty or whitespace-only lines
      if (!line.trim()) return;

      // Split the line by `","` to get individual fields
      const fields = line
        .trim()
        .split('","')
        .map((item) => item.replace(/"/g, ""));

      // Check if the first field is a relevant descriptor
      const validDescriptors = ["GROUP", "HEADING", "UNIT", "TYPE", "DATA"];
      const descriptor = fields[0];

      // Validate that all fields are enclosed in double quotes
      if (validDescriptors.includes(descriptor)) {
        if (!line.startsWith('"') || !line.endsWith('"')) {
          errors.push({
            rule: this.rule,
            lineNumber,
            message: "Fields are not properly enclosed in double quotes.",
          });
        }

        // Check for proper quote handling within each field
        fields.forEach((field, fieldIndex) => {
          // Skip the check for the first field (descriptor) as it should be a valid descriptor
          if (fieldIndex === 0) return;

          // Check for quotes within data fields
          const quoteMatches = field.match(/"/g);
          if (quoteMatches && quoteMatches.length % 2 !== 0) {
            errors.push({
              rule: this.rule,
              lineNumber,
              message: `Field "${field}" contains improperly enclosed quotes. Quotes within fields must be doubled.`,
            });
          }
        });
      }
    });

    return errors;
  },
};

const rule7: AgsValidationStepParsed = {
  rule: 7,
  description:
    "AGS Format Rule 7: The AGS file should contain at least one GROUP.",
  validate: function (ags: AgsRaw): AgsError[] {
    const errors: AgsError[] = [];

    for (const [groupName, group] of Object.entries(ags)) {
      // assert no duplicates headings in each group
      const headings = group.headings.map((heading) => heading.name);
      const uniqueHeadings = new Set(headings);
      if (headings.length !== uniqueHeadings.size) {
        errors.push({
          rule: this.rule,
          lineNumber: group.lineNumber + 2,
          group: groupName,
          message: "Duplicate headings found in the group.",
        });
      }
    }
    return errors;
  },
};

const rule19: AgsValidationStepParsed = {
  rule: 19,
  description:
    "A GROUP name shall not be more than 4 characters long and shall consist of uppercase letters and numbers only.",
  validate: function (ags: AgsRaw): AgsError[] {
    const errors: AgsError[] = [];
    for (const [groupName, group] of Object.entries(ags)) {
      if (groupName.length > 4 || !/^[A-Z0-9]+$/.test(groupName)) {
        errors.push({
          rule: this.rule,
          lineNumber: group.lineNumber,
          group: groupName,
          message: "Invalid GROUP name format.",
        });
      }
    }
    return errors;
  },
};

// Rule 19a A HEADING name shall not be more than 9 characters long and shall consist of uppercase letters,
// numbers or the underscore character only.
const rule19a: AgsValidationStepParsed = {
  rule: 19,
  description:
    "A HEADING name shall not be more than 9 characters long and shall consist of uppercase letters, numbers or the underscore character only.",
  validate: function (ags: AgsRaw): AgsError[] {
    const errors: AgsError[] = [];
    for (const [groupName, group] of Object.entries(ags)) {
      for (const heading of group.headings) {
        if (heading.name.length > 9 || !/^[A-Z0-9_]+$/.test(heading.name)) {
          errors.push({
            rule: this.rule,
            lineNumber: group.lineNumber + 1,
            group: groupName,
            field: heading.name,
            message: "Invalid HEADING name format.",
          });
        }
      }
    }
    return errors;
  },
};

// Rule 19b
// HEADING names shall start with the GROUP name followed by an underscore character .e.g.
// "NGRP_HED1"
// Where a HEADING refers to an existing HEADING within another GROUP, the HEADING name
// added to the group shall bear the same name.
// e.g. "CMPG_TESN" in the "CMPT" GROUP.
const rule19b: AgsValidationStepParsed = {
  rule: "19b",
  description:
    "HEADING names shall start with the GROUP name followed by an underscore character.",
  validate: function (ags: AgsRaw): AgsError[] {
    const errors: AgsError[] = [];

    const allHeadings = new Set(
      Object.values(ags)
        .flatMap((group) => group.headings)
        .map((heading) => heading.name)
    );

    for (const [groupName, group] of Object.entries(ags)) {
      const groupPrefix = groupName + "_";
      for (const heading of group.headings) {
        if (
          !heading.name.startsWith(groupPrefix) &&
          !allHeadings.has(heading.name)
        ) {
          errors.push({
            rule: this.rule,
            lineNumber: group.lineNumber + 1,
            group: groupName,
            field: heading.name,
            message:
              "HEADING name does not start with the GROUP name, or not found in another group.",
          });
        }
      }
    }
    return errors;
  },
};

const rule8: AgsValidationStepParsed = {
  rule: 8,
  description:
    "Data variables shall be presented in units of measurements\
        and type that are described by the appropriate data field UNIT and data\
        field TYPE defined at the start of the GROUP.",

  validate: function (ags: AgsRaw): AgsError[] {
    const errors: AgsError[] = [];

    const schemas = createZodSchemasForHeadings(ags);

    for (const [groupName, group] of Object.entries(ags)) {
      for (const row of group.rows) {
        for (const heading of group.headings) {
          const fieldName = heading.name;
          const fieldValue = row.data[fieldName];

          try {
            schemas[groupName][fieldName].parse(fieldValue);
          } catch (error) {
            errors.push({
              rule: this.rule,
              lineNumber: row.lineNumber,
              group: groupName,
              field: fieldName,
              message: `Data variable '${fieldValue}' does not match the UNIT '${heading.unit}' and TYPE '${heading.type}' defined in the HEADING.`,
            });
          }
        }
      }
    }
    return errors;
  },
};

// TODO:
// 8
// 9
// 10
// 10a
// 10b
// 10c
// 11
// 11a
// 11b
// 11c
// 12
// 13
// 14
// 15
// 16
// 16a
// 17
// 18
// 18a
// 20

export const rulesForRawString = {
  rule1,
  rule2a,
  rule3,
  rule4_1,
  rule4_2,
  rule5,
};

export const rulesForParsedAgs = {
  rule7,
  rule19a,
  rule19b,
  rule19,

  rule8,
};
