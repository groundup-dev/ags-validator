"use client";

import * as React from "react";

import AutoComplete from "@/components/ui/auto-complete";

type Props = {
  groups: string[];
  selectedGroup: string;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
};

export default function SelectTable({
  groups,
  selectedGroup,
  setSelectedGroup,
}: Props) {
  const options = groups.map((group) => ({ value: group, label: group }));

  return (
    <AutoComplete
      options={options}
      selectedOption={selectedGroup}
      setSelectedOption={setSelectedGroup}
      label="Select Table"
      placeholder="Search Tables"
    />
  );
}
