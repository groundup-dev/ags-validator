import { getDictForVersion, combineDicts } from "../../standardDictionaries";
import { AgsError } from "../../types";
import {
  AgsValidationStepParsed,
  AgsValidationStepParsedWithDict,
} from "./types";

// Rule 11
// HEADINGs defined as a data TYPE of 'Record Link' (RL) can be used to link data rows to entries in
// GROUPs outside of the defined hierarchy (Rule 10c) or DICT group for user defined GROUPs.
// The GROUP name followed by the KEY FIELDs defining the cross-referenced data row, in the order
// presented in the AGS4 DATA DICTIONARY.
// Rule 11a
// Each GROUP/KEY FIELD shall be separated by a delimiter character. This single delimiter character
// shall be defined in TRAN_DLIM. The default being "|" (ASCII character 124).
// Rule 11b
// A heading of data TYPE 'Record Link' can refer to more than one combination of GROUP and KEY
// FIELDs.
// The combination shall be separated by a defined concatenation character. This single concatenation
// character shall be defined in TRAN_RCON. The default being "+" (ASCII character 43).
// Rule 11c Any heading of data TYPE 'Record Link' included in a data file shall cross-reference to the KEY
// FIELDs of data rows in the GROUP referred to by the heading contents.

export const rule13: AgsValidationStepParsedWithDict = {
  rule: 13,

  description:
    "Each data file shall contain the PROJ GROUP which shall contain only one data row and, as a minimum, shall contain data under the headings defined as REQUIRED (Rule 10b).",
  validate: function (ags): AgsError[] {
    const baseError: AgsError = {
      rule: this.rule,
      severity: "error",
      lineNumber: -1,
      group: "PROJ",
    };

    // assert PROJ in ags
    if (!ags.PROJ) {
      return [
        {
          ...baseError,
          message: "PROJ group is required",
        },
      ];
    }

    if (ags.PROJ.rows.length != 1) {
      return [
        {
          ...baseError,
          message: "PROJ group must contain exactly one row",
        },
      ];
    }

    // note required headings will be hit by rule 9

    return [];
  },
};

export const rule14: AgsValidationStepParsedWithDict = {
  rule: 14,
  description:
    "Each data file shall contain the TRAN GROUP which shall contain only one data row and, as a minimum, shall contain data under the headings defined as REQUIRED (Rule 10b).",
  validate: function (ags): AgsError[] {
    const baseError: AgsError = {
      rule: this.rule,
      severity: "error",
      lineNumber: -1,
      group: "TRAN",
    };

    // assert TRAN in ags
    if (!ags.TRAN) {
      return [
        {
          ...baseError,
          message: "TRAN group is required",
        },
      ];
    }

    if (ags.TRAN.rows.length != 1) {
      return [
        {
          ...baseError,
          message: "TRAN group must contain exactly one row",
        },
      ];
    }

    // note required headings will be hit by rule 9

    return [];
  },
};

export const rule17: AgsValidationStepParsed = {
  description:
    "Each data file shall contain the TYPE GROUP to define the field TYPEs used within the data file. Every data type entered in the TYPE row of a GROUP shall be listed and defined in the TYPE GROUP.",
  rule: 17,
  validate: function (ags): AgsError[] {
    const baseError: AgsError = {
      rule: this.rule,
      severity: "error",
      lineNumber: -1,
      group: "TYPE",
    };

    // collect all types defined listed in TYPE into set
    const types = ags.TYPE.rows.map((row) => row.data.TYPE_TYPE);
    const uniqueTypes = new Set(types);

    // loop through all groups and check if all types are defined in TYPE
    const errors: AgsError[] = [];
    for (const [groupName, group] of Object.entries(ags)) {
      for (const heading of group.headings) {
        if (!uniqueTypes.has(heading.type)) {
          errors.push({
            ...baseError,
            message: `Type '${heading.type}' is not defined in TYPE`,
            group: groupName,
            field: heading.name,
            lineNumber: group.lineNumber + 3,
          });
        }
      }
    }

    return errors;
  },
};

export const rule15: AgsValidationStepParsed = {
  rule: 15,
  description:
    "Each data file shall contain the UNIT GROUP to list all units used within the data file. Every unit of measurement entered in the UNIT row of a GROUP or data entered in a FIELD where the field TYPE is defined as 'PU'",
  validate: function (ags): AgsError[] {
    const baseError: AgsError = {
      rule: this.rule,
      severity: "error",
      lineNumber: -1,
      group: "UNIT",
    };

    // assert UNIT in ags
    if (!ags.UNIT) {
      return [
        {
          ...baseError,
          message: "UNIT group is required",
        },
      ];
    }

    const errors: AgsError[] = [];
    const units = ags.UNIT.rows.map((row) => row.data.UNIT_UNIT);
    const uniqueUnits = new Set(units);

    for (const [groupName, group] of Object.entries(ags)) {
      for (const heading of group.headings) {
        if (heading.unit && !uniqueUnits.has(heading.unit)) {
          errors.push({
            ...baseError,
            message: `Unit '${heading.unit}' is not defined in UNIT`,
            group: groupName,
            field: heading.name,
            lineNumber: group.lineNumber + 2,
          });
        }

        if (heading.type === "PU") {
          for (const row of group.rows) {
            if (
              row.data[heading.name] !== "" &&
              !uniqueUnits.has(row.data[heading.name])
            ) {
              errors.push({
                ...baseError,
                message: `Unit '${
                  row.data[heading.name]
                }' is not defined in UNIT`,
                group: groupName,
                field: heading.name,
                lineNumber: row.lineNumber,
              });
            }
          }
        }
      }
    }
    return errors;
  },
};

export const rule16: AgsValidationStepParsedWithDict = {
  rule: 16,
  description:
    "Each data file shall contain the ABBR GROUP when abbreviations have been included in the data file.",
  validate: function (ags): AgsError[] {
    const baseError: AgsError = {
      rule: this.rule,
      severity: "error",
      lineNumber: -1,
      group: "ABBR",
    };

    if (!ags.ABBR) {
      return [
        {
          ...baseError,
          severity: "warning", //only warning as ABBR is optional
          message: "ABBR group is required",
        },
      ];
    }

    const errors: AgsError[] = [];
    const abbrs = ags.ABBR.rows.map((row) => row.data.ABBR_CODE);
    const uniqueAbbrs = new Set(abbrs);

    // get the concatenated character
    // default is "+"
    const TRAN_RCON = ags.TRAN.rows[0].data.TRAN_RCON || "+";

    for (const [groupName, group] of Object.entries(ags)) {
      for (const heading of group.headings) {
        if (heading.type === "PA") {
          for (const row of group.rows) {
            const value = row.data[heading.name];
            if (value === "") continue; // empty string is allowed
            const abbrs = value.split(TRAN_RCON);
            for (const abbr of abbrs) {
              if (!uniqueAbbrs.has(abbr)) {
                errors.push({
                  ...baseError,
                  message: `Abbreviation '${abbr}' is not defined in ABBR`,
                  group: groupName,
                  field: heading.name,
                  lineNumber: row.lineNumber,
                });
              }
            }
          }
        }
      }
    }

    return errors;
  },
};

export const rule11: AgsValidationStepParsedWithDict = {
  rule: 11,
  description:
    "HEADINGs defined as a data TYPE of 'Record Link' (RL) can be used to link data rows to entries in GROUPs outside of the defined hierarchy (Rule 10c) or DICT group for user defined GROUPs. The GROUP name followed by the KEY FIELDs defining the cross-referenced data row, in the order presented in the AGS4 DATA DICTIONARY.",
  validate: function (ags, dictVersion): AgsError[] {
    const errors: AgsError[] = [];

    const delimiter = ags.TRAN.rows[0]?.data.TRAN_DLIM || "|";
    const concatenation = ags.TRAN.rows[0]?.data.TRAN_RCON || "+";

    const dict = getDictForVersion(dictVersion);
    const groups = Object.keys(ags);

    const dictCombined = combineDicts(dict.DICT, ags.DICT);

    // first filter out dict.DICT from groups
    const dictEntries = dictCombined.rows.filter((row) => {
      return groups.includes(row.data.DICT_GRP);
    });

    for (const groupName of groups) {
      const keyHeadings = dictEntries.filter(
        (entry) =>
          entry.data.DICT_GRP === groupName &&
          entry.data.DICT_STAT.includes("KEY"),
      );

      const group = ags[groupName];

      for (const heading of group.headings) {
        if (heading.type === "RL") {
          // if heading is RL, then we need to check the links

          for (const row of group.rows) {
            const value = row.data[heading.name];
            const links = value.split(concatenation);
            // there can be multiple links in a single field

            for (const link of links) {
              const [linkGroup, ...keys] = link.split(delimiter);
              if (!ags[linkGroup]) {
                errors.push({
                  rule: this.rule,
                  lineNumber: row.lineNumber,
                  group: groupName,
                  field: heading.name,
                  severity: "error",
                  message: `Group '${linkGroup}' is not defined in AGS`,
                });
                continue;
              }

              const keyFieldsMap = Object.fromEntries(
                keyHeadings.map((key, index) => [
                  key.data.DICT_HDNG,
                  keys[index],
                ]),
              );

              // now need to find rows in the group that match the key fields
              const matchingRows = ags[linkGroup].rows.filter((row) => {
                for (const key of keyHeadings) {
                  if (
                    row.data[key.data.DICT_HDNG] !==
                    keyFieldsMap[key.data.DICT_HDNG]
                  ) {
                    return false;
                  }
                }
                return true;
              });

              if (matchingRows.length === 0) {
                errors.push({
                  rule: this.rule,
                  lineNumber: row.lineNumber,
                  group: groupName,
                  field: heading.name,
                  severity: "error",
                  message: `No matching row found in group '${linkGroup}' for ${value} `,
                });
              }

              if (matchingRows.length > 1) {
                errors.push({
                  rule: this.rule,
                  lineNumber: row.lineNumber,
                  group: groupName,
                  field: heading.name,
                  severity: "error",
                  message: `Multiple matching rows found in group '${linkGroup}' for ${value} `,
                });
              }
            }
          }
        }
      }
    }
    return errors;
  },
};
