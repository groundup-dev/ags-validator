import v4_0_4 from "../assets/Standard_dictionary_v4_0_4.ags.json";
import v4_1_1 from "../assets/Standard_dictionary_v4_1_1.ags.json";
import v4_0_3 from "../assets/Standard_dictionary_v4_0_3.ags.json";
import v4_1 from "../assets/Standard_dictionary_v4_1.ags.json";
import { AgsDictionaryVersion, AgsDictionary } from "./types";

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
