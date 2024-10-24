"use client";

import * as React from "react";

import AutoComplete from "@/components/ui/auto-complete";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearHistory } from "@/lib/redux/ags";

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

  const dispatch = useAppDispatch();

  const handleSelect = (value: React.SetStateAction<string>) => {
    dispatch(clearHistory());
    setSelectedGroup(value);
  };

  return (
    <AutoComplete
      options={options}
      selectedOption={selectedGroup}
      setSelectedOption={handleSelect}
      label="Select Table"
      placeholder="Search Tables"
    />
  );
}
