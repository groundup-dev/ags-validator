import { createZodSchemasForHeadings } from "./createSchemas";
import { AgsRaw, AgsError } from "../models";
import { AgsValidationStep } from "./types";

type AgsValidationStepParsed = AgsValidationStep<AgsRaw>;

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
        .map((heading) => heading.name),
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

export const rulesForParsedAgs: AgsValidationStepParsed[] = [
  rule7,
  rule8,
  rule19,
  rule19a,
  rule19b,
];
