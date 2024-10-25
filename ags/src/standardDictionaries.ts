import v4_0_4 from "../assets/Standard_dictionary_v4_0_4.ags.json";
import v4_1_1 from "../assets/Standard_dictionary_v4_1_1.ags.json";
import v4_0_3 from "../assets/Standard_dictionary_v4_0_3.ags.json";
import v4_1 from "../assets/Standard_dictionary_v4_1.ags.json";
import { AgsDictionaryVersion, AgsDictionary, GroupRaw } from "./types";

const v4_0_4_casted = v4_0_4 as unknown as AgsDictionary;
const v4_1_1_casted = v4_1_1 as unknown as AgsDictionary;
const v4_0_3_casted = v4_0_3 as unknown as AgsDictionary;
const v4_1_casted = v4_1 as unknown as AgsDictionary;

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

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function combineDicts(dict1: GroupRaw, dict2?: GroupRaw): GroupRaw {
  if (!dict2) {
    return deepClone(dict1);
  }

  const combinedDict = deepClone(dict1); // Deep clone of dict1

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
