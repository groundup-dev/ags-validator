"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setRawData } from "@/lib/redux/ags";

export default function AGSUpload() {
  const dispatch = useAppDispatch();

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          dispatch(setRawData(content));
        }
      };
      reader.readAsText(selectedFile); // Read file as text
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 mb-4">
      <Label htmlFor="inputFile">Upload AGS4 File</Label>
      <Input
        id="inputFile"
        type="file"
        accept=".ags" // Adjust accepted file types as needed
        onChange={handleFileChange}
        className="rounded w-full max-w-sm cursor-pointer"
      />
    </div>
  );
}
