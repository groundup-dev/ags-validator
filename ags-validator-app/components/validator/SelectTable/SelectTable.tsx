"use client";

import * as React from "react";

import AutoComplete from "@/components/ui/auto-complete";
import { AgsRaw } from "@groundup/ags";

type Props = {
  parsedAgs: AgsRaw | undefined;
  selectedGroup: string;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
};

export default function SelectTable({
  parsedAgs,
  selectedGroup,
  setSelectedGroup,
}: Props) {
  const groups = parsedAgs
    ? Object.keys(parsedAgs).map((key) => ({
        value: key,
        label: key,
      }))
    : [];

  return (
    <AutoComplete
      options={groups}
      selectedOption={selectedGroup}
      setSelectedOption={setSelectedGroup}
      label="Select Table"
      placeholder="Search Tables"
    />
  );
}
