// Validator.tsx
"use client";

import { useValidator } from "./hooks/useValidator";
import ErrorTable from "./ErrorTable";
import React, { useState } from "react";
import TextArea from "./TextArea";
import OptionsArea from "./OptionsArea"; // Import the new OptionsArea component
import { Card, CardContent } from "@/components/ui/card";

export default function Validator() {
  const { agsData, setAgsData, errors } = useValidator();

  const [lineNumber, setActiveLineNumber] = useState<number | undefined>(
    undefined
  );
  const [hoverLineNumber, setHoverLineNumber] = useState<number | null>(null);

  return (
    <div className="flex  flex-col p-2 ">
      <div className="w-2/3">
        <OptionsArea setAgsData={setAgsData} />
      </div>
      <div className="flex space-x-4 ">
        <div className="w-2/3">
          <Card>
            <CardContent className="p-4">
              {/* OptionsArea component to upload file */}

              <TextArea
                agsData={agsData}
                setAgsData={setAgsData}
                errors={errors}
                activeLineNumber={lineNumber}
                hoverLineNumber={hoverLineNumber}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="w-1/3">
          <CardContent className="p-4">
            <ErrorTable
              errors={errors}
              setActiveLineNumber={setActiveLineNumber}
              setHoverLineNumber={setHoverLineNumber}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
