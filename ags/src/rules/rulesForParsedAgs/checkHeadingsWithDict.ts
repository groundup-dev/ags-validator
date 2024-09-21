// // Rule 9
// // Data HEADING and GROUP names shall be taken from the AGS FORMAT DATA DICTIONARY.
// // In cases where there is no suitable entry, a user-defined GROUP and/or HEADING may be used
// // in accordance with Rule 18. Any user-defined HEADINGs shall be included at the end of the
// // HEADING row after the standard HEADINGs in the order defined in the DICT group (see Rule
// // 18a).
// // Rule 10
// // HEADINGs are defined as KEY, REQUIRED or OTHER.
// // • KEY fields are necessary to uniquely define the data.
// // • REQUIRED fields are necessary to allow interpretation of the data file.
// // • OTHER fields are included depending on the scope of the data file and availability of data
// // to be included.
// // Rule 10a
// // In every GROUP, certain HEADINGs are defined as KEY. There shall not be more than one row
// // of data in each GROUP with the same combination of KEY field entries. KEY fields must appear
// // in each GROUP, but may contain null data (see Rule 12).
// // Rule 10b
// // Some HEADINGs are marked as REQUIRED. REQUIRED fields must appear in the data
// // GROUPs where they are indicated in the AGS FORMAT DATA DICTIONARY. These fields require
// // data entry and cannot be null (i.e. left blank or empty).

import { AgsDictionaryVersion, AgsError } from "../../types";
import { AgsValidationStepParsedWithDict } from "./types";
import { standardDictionaries } from "../../standardDictionaries";

// Rule 10c
// Links are made between data rows in GROUPs by the KEY fields. Every entry made in the KEY
// fields in any GROUP must have an equivalent entry in its PARENT GROUP. The PARENT GROUP

function throwForMissingDictVersion(dictVersion?: AgsDictionaryVersion) {}

function getDictForVersion(dictVersion?: AgsDictionaryVersion) {
  if (!dictVersion) {
    throw new Error("Dictionary version is required for this rule");
  }
  return standardDictionaries[dictVersion];
}

// must be included within the data file.

export const rule10c: AgsValidationStepParsedWithDict = {
  rule: "10c",
  description:
    "Links are made between data rows in GROUPs by the KEY fields. Every entry made in the KEY fields in any GROUP must have an equivalent entry in its PARENT GROUP. The PARENT GROUP must be included within the data file.",
  validate: function (ags, dictVersion): AgsError[] {
    const dict = getDictForVersion(dictVersion);
    console.log(dict);
    return [];
  },
};
