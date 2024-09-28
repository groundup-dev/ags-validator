// OptionsArea.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Props type for OptionsArea component
type Props = {
  setAgsData: (data: string) => void; // Function to set AGS data
};

const OptionsArea: React.FC<Props> = ({ setAgsData }) => {
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
      reader.readAsText(selectedFile); // Modify as needed (readAsDataURL, etc.)
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="inputFile">Upload AGS4 File</Label>
          <Input
            id="inputFile"
            type="file"
            accept=".ags" // Adjust accepted file types as needed
            onChange={handleFileChange}
            className="rounded w-full max-w-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OptionsArea;
