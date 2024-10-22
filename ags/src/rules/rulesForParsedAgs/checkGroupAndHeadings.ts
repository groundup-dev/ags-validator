import { AgsRaw, AgsError } from "../../types";

import { AgsValidationStepParsed } from "./types";

// TODO: add the actual data dictionary, for all versions of AGS
export const rule7: AgsValidationStepParsed = {
  rule: 7,
  description:
    "AGS Format Rule 7: The order of data FIELDs in each line within a GROUP is defined at the start of each GROUP inthe HEADING row. HEADINGs shall be in the order described in the AGS FORMAT DATA DICTIONARY.",
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
          severity: "error",
        });
      }
    }
    return errors;
  },
};

export const rule19: AgsValidationStepParsed = {
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
          severity: "error",
        });
      }
    }
    return errors;
  },
};

// Rule 19a A HEADING name shall not be more than 9 characters long and shall consist of uppercase letters,
// numbers or the underscore character only.
export const rule19a: AgsValidationStepParsed = {
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
            severity: "warning",
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
export const rule19b: AgsValidationStepParsed = {
  rule: "19b",
  description:
    "HEADING names shall start with the GROUP name followed by an underscore character.",
  validate: function (ags: AgsRaw): AgsError[] {
    const errors: AgsError[] = [];

    for (const [groupName, group] of Object.entries(ags)) {
      const groupPrefix = groupName + "_";

      const allowedPrefixes = [groupPrefix, "SPEC_", "TEST_"];

      // remove group headings of current group, to provide lookup if heading is in another group
      const allHeadingsApartFromCurrentGroup = new Set(
        Object.values(ags)
          .filter((g) => g.name !== group.name)
          .flatMap((g) => g.headings)
          .map((heading) => heading.name)
          .filter((name) => !name.startsWith(groupPrefix)),
      );

      for (const heading of group.headings) {
        if (
          !(
            allowedPrefixes.some((prefix) => heading.name.startsWith(prefix)) ||
            allHeadingsApartFromCurrentGroup.has(heading.name)
          )
        ) {
          errors.push({
            rule: this.rule,
            lineNumber: group.lineNumber + 1,
            group: groupName,
            field: heading.name,
            severity: "error",
            message:
              "HEADING name does not start with the GROUP name, or not found in another group.",
          });
        }
      }
    }
    return errors;
  },
};
