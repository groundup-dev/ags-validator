"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Props type for AGSUpload component
type AGSUploadProps = {
  setAgsData: (data: string) => void; // Function to set AGS data
};

export default function AGSUpload({ setAgsData }: AGSUploadProps) {
  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          setAgsData(content); // Set the AGS data from the uploaded file content
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
