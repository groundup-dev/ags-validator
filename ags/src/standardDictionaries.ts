import v4_0_4 from "../assets/Standard_dictionary_v4_0_4.ags.json";
import v4_1_1 from "../assets/Standard_dictionary_v4_1_1.ags.json";
import v4_0_3 from "../assets/Standard_dictionary_v4_0_3.ags.json";
import v4_1 from "../assets/Standard_dictionary_v4_1.ags.json";
import { AgsDictionaryVersion, AgsDictionary, GroupRaw } from "./types";

const v4_0_4_casted = v4_0_4 as AgsDictionary;
const v4_1_1_casted = v4_1_1 as AgsDictionary;
const v4_0_3_casted = v4_0_3 as AgsDictionary;
const v4_1_casted = v4_1 as AgsDictionary;

export const standardDictionaries: Record<AgsDictionaryVersion, AgsDictionary> =
  {
    v4_0_4: v4_0_4_casted,
    v4_1_1: v4_1_1_casted,
    v4_0_3: v4_0_3_casted,
    v4_1: v4_1_casted,
  };

export function getDictForVersion(dictVersion?: AgsDictionaryVersion) {
  if (!dictVersion) {
    throw new Error("Dictionary version is required for this rule");
  }
  return standardDictionaries[dictVersion];
}

export function combineDicts(dict1: GroupRaw, dict2?: GroupRaw): GroupRaw {
  // combine dicts by adding rows from dict2 to dict1, overwriting any duplicates
  if (!dict2) {
    return dict1;
  }

  // on DICT_GRP and DICT_HDNG
  const combinedDict = { ...dict1 };

  dict2.rows.forEach((row) => {
    const existingRow = combinedDict.rows.find(
      (r) =>
        r.data.DICT_GRP === row.data.DICT_GRP &&
        r.data.DICT_HDNG === row.data.DICT_HDNG,
    );

    if (existingRow) {
      const index = combinedDict.rows.indexOf(existingRow);
      combinedDict.rows[index] = row;
    } else {
      combinedDict.rows.push(row);
    }
  });

  return combinedDict;
}
