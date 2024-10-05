import { AgsError } from "../../types";
import { AgsValidationStepParsedWithDict } from "./types";

// Rule 17
// Each data file shall contain the TYPE GROUP to define the field TYPEs used within the data file.
// Every data type entered in the TYPE row of a GROUP shall be listed and defined in the TYPE
// GROUP.

// Rule 18
// Each data file shall contain the DICT GROUP where non-standard GROUP and HEADING names
// have been included in the data file.
// Rule 18a
// The order in which the user-defined HEADINGs are listed in the DICT GROUP shall define the
// order in which these HEADINGS are appended to an existing GROUP or appear in a user-defined
// GROUP.
// This order also defines the sequence in which such HEADINGS are used in a heading of data
// TYPE 'Record Link' (Rule 11).

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

// Rule 14 Each data file shall contain the TRAN GROUP which shall contain only one data row and, as a
// minimum, shall contain data under the headings defined as REQUIRED (Rule 10b).

// Rule 15
// Each data file shall contain the UNIT GROUP to list all units used within the data file.
// Every unit of measurement entered in the UNIT row of a GROUP or data entered in a FIELD where
// the field TYPE is defined as "PU" (for example ELRG_RUNI, GCHM_UNIT or MOND_UNIT
// FIELDs) shall be listed and defined in the UNIT GROUP.

// Rule 16
// Each data file shall contain the ABBR GROUP when abbreviations have been included in the data
// file.
// The abbreviations listed in the ABBR GROUP shall include definitions for all abbreviations entered
// in a FIELD where the data TYPE is defined as "PA" or any abbreviation needing definition used
// within any other heading data type.
// Rule 16a
// Where multiple abbreviations are required to fully codify a FIELD, the abbreviations shall be
// separated by a defined concatenation character. This single concatenation character shall be
// defined in TRAN_RCON. The default being "+" (ASCII character 43)
// Each abbreviation used in such combinations shall be listed separately in the ABBR GROUP. e.g.
// "CP+RC" must have entries for both "CP" and "RC" in ABBR GROUP, together with their full
// definition.

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

export const rule17: AgsValidationStepParsedWithDict = {
  description:
    "Each data file shall contain the TYPE GROUP to define the field TYPEs used within the data file. Every data type entered in the TYPE row of a GROUP shall be listed and defined in the TYPE GROUP.",
  rule: 17,
  validate: function (ags, dictVersion): AgsError[] {
    const baseError = {
      rule: this.rule,
      severity: "error",
      lineNumber: -1,
      group: "TYPE",
    };

    // assert TYPE in ags
    if (!ags.TYPE) {
      return [
        {
          ...baseError,
          message: "TYPE group is required",
        },
      ];
    }

    // collect all types listed in TYPE
    const types = ags.TYPE.rows.map((row) => row.data);
    console.log(types);

    return [];
  },
};
