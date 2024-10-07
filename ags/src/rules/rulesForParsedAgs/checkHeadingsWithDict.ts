import { AgsError, RowRaw } from "../../types";
import { AgsValidationStepParsedWithDict } from "./types";
import { combineDicts, getDictForVersion } from "../../standardDictionaries";

// this also convers
// Rule 12 Data does not have to be included against each HEADING unless REQUIRED (Rule 10b). The
// data FIELD can be null; a null entry is defined as "" (two quotes together).

export const rule10b: AgsValidationStepParsedWithDict = {
  rule: "10b",
  description:
    "Some HEADINGs are marked as REQUIRED. REQUIRED fields must appear in the data GROUPs where they are indicated in the AGS FORMAT DATA DICTIONARY. These fields require data entry and cannot be null (i.e., left blank or empty).",
  validate: function (ags, dictVersion): AgsError[] {
    const dict = getDictForVersion(dictVersion);
    const groups = Object.keys(ags);

    const dictCombined = combineDicts(dict.DICT, ags.DICT);

    const errors: AgsError[] = [];

    for (const group of groups) {
      // Get the dictionary entries for the current group
      const requiredHeadings = dictCombined.rows.filter(
        (entry) =>
          entry.data.DICT_GRP === group &&
          entry.data.DICT_STAT.includes("REQUIRED"),
      );

      if (requiredHeadings.length === 0) {
        // No required fields for this group, skip
        continue;
      }

      const requiredHeadingNames = requiredHeadings.map(
        (heading) => heading.data.DICT_HDNG,
      );

      for (const row of ags[group].rows) {
        for (const requiredHeading of requiredHeadingNames) {
          const value = row.data[requiredHeading];

          if (value === undefined || value === null || value.trim() === "") {
            errors.push({
              rule: "10b",
              severity: "error",
              lineNumber: row.lineNumber,
              group: group,
              field: requiredHeading,
              message: `The required field "${requiredHeading}" in group ${group} cannot be null or empty.`,
            });
          }
        }
      }
    }

    return errors;
  },
};

export const rule10c: AgsValidationStepParsedWithDict = {
  rule: "10c",
  description:
    "Links are made between data rows in GROUPs by the KEY fields. Every entry made in the KEY fields in any GROUP must have an equivalent entry in its PARENT GROUP. The PARENT GROUP must be included within the data file.",
  validate: function (ags, dictVersion): AgsError[] {
    const dict = getDictForVersion(dictVersion);
    const groups = Object.keys(ags);

    const errors: AgsError[] = [];

    const dictCombined = combineDicts(dict.DICT, ags.DICT);

    // get dictionary entries for relevant groups
    const dictEntries = dictCombined.rows.filter((row) => {
      return groups.includes(row.data.DICT_GRP);
    });

    for (const group of groups) {
      // extract parent group for the current group from the dictionary

      const parentGroup = dictEntries.find(
        (entry) =>
          entry.data.DICT_GRP === group && entry.data.DICT_TYPE === "GROUP",
      )?.data.DICT_PGRP;

      if (!parentGroup || parentGroup === "-" || parentGroup === "PROJ") {
        // If parent group is not included in the file, skip the check, or if group is LOCA

        continue;
      }

      if (!ags[parentGroup]) {
        errors.push({
          lineNumber: ags[group].lineNumber,
          rule: "10c",
          severity: "error",
          group: group,
          message: `Parent group ${parentGroup} is not present in the AGS file for group ${group}`,
        });
        continue;
      }

      const parentKeyHeadings = dictEntries.filter(
        (entry) =>
          entry.data.DICT_GRP === parentGroup &&
          entry.data.DICT_STAT.includes("KEY"),
      );

      const parentKeySet = new Set<string>();

      for (const parentRow of ags[parentGroup].rows) {
        const parentKey = parentKeyHeadings
          .map((heading) => parentRow.data[heading.data.DICT_HDNG])
          .join("|");
        parentKeySet.add(parentKey);
      }

      // Check if every key in the current group has a match in the parent group
      for (const row of ags[group].rows) {
        const rowKey = parentKeyHeadings
          .map((heading) => row.data[heading.data.DICT_HDNG])
          .join("|");

        if (!parentKeySet.has(rowKey)) {
          errors.push({
            rule: "10c",
            severity: "error",
            lineNumber: row.lineNumber,
            group: group,
            message: `Key value "${rowKey}" in group ${group} does not have a corresponding entry in the parent group ${parentGroup}`,
          });
        }
      }
    }

    return errors;
  },
};

export const rule10a: AgsValidationStepParsedWithDict = {
  rule: "10a",
  description:
    "Links are made between data rows in GROUPs by the KEY fields. Every entry made in the KEY fields in any GROUP must have an equivalent entry in its PARENT GROUP. The PARENT GROUP must be included within the data file.",
  validate: function (ags, dictVersion): AgsError[] {
    const dict = getDictForVersion(dictVersion);
    const groups = Object.keys(ags);

    const dictCombined = combineDicts(dict.DICT, ags.DICT);

    // first filter out dict.DICT from groups
    const dictEntries = dictCombined.rows.filter((row) => {
      return groups.includes(row.data.DICT_GRP);
    });

    const errors: AgsError[] = [];

    for (const group of groups) {
      const keyHeadings = dictEntries.filter(
        (entry) =>
          entry.data.DICT_GRP === group && entry.data.DICT_STAT.includes("KEY"),
      );

      // find non-unique rows in the group

      const nonUniqueRows: RowRaw[] = [];
      const rowValues = new Map<string, RowRaw[]>();

      for (const row of ags[group].rows) {
        const key = keyHeadings
          .map((heading) => row.data[heading.data.DICT_HDNG])
          .join("|");

        if (!rowValues.has(key)) {
          rowValues.set(key, []);
        }

        rowValues.get(key)!.push(row);
      }

      for (const [, rows] of rowValues.entries()) {
        if (rows.length > 1) {
          nonUniqueRows.push(...rows);
        }
      }

      for (const row of nonUniqueRows) {
        errors.push({
          rule: "10a",
          severity: "error",
          lineNumber: row.lineNumber,
          group: group,
          message: `Duplicate key values found in group ${group}`,
        });
      }
    }

    return errors;
  },
};

export const rule9: AgsValidationStepParsedWithDict = {
  rule: "9",
  description:
    "Data HEADING and GROUP names shall be taken from the AGS FORMAT DATA DICTIONARY. In cases where there is no suitable entry, a user-defined GROUP and/or HEADING may be used in accordance with Rule 18. Any user-defined HEADINGs shall be included at the end of the HEADING row after the standard HEADINGs in the order defined in the DICT group (see Rule18a)",
  validate: function (ags, dictVersion): AgsError[] {
    const dict = getDictForVersion(dictVersion);
    const groups = Object.keys(ags);

    const dictEntries = dict.DICT.rows.filter((row) => {
      return groups.includes(row.data.DICT_GRP);
    });

    const errors: AgsError[] = [];

    for (const group of groups) {
      ags[group].headings.forEach((heading) => {
        // if the heading is not in the dictionary, add it to the nonStandardHeadings array
        if (
          dictEntries.some(
            (entry) =>
              entry.data.DICT_GRP === group &&
              entry.data.DICT_HDNG === heading.name,
          )
        ) {
          return;
          // if found in standard dictionary, return
        }

        if (
          ags.DICT?.rows.some(
            (entry) =>
              entry.data.DICT_GRP === group &&
              entry.data.DICT_HDNG === heading.name,
          )
        ) {
          errors.push({
            rule: "10a",
            severity: "warning",
            lineNumber: ags[group].lineNumber,
            group: group,
            field: heading.name,
            message: `The heading ${heading.name} is non-standard and not found in AGS version ${dictVersion} dictionary`,
          });
        } else {
          errors.push({
            rule: "10a",
            severity: "error",
            lineNumber: ags[group].lineNumber,
            group: group,
            field: heading.name,
            message: `${heading.name} is not found in AGS version ${dictVersion} dictionary, and is not included in the DICT group`,
          });
        }
      });
    }

    return errors;
  },
};
