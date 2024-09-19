"use client";

import { useValidator } from "../hooks/useValidator";
import ErrorTable from "./ErrorTable";

import React, { useState } from "react";
import TextArea from "./TextArea";

export default function Validator() {
  const { agsData, setAgsData, errors } = useValidator();
  const [lineNumber, setActiveLineNumber] = useState<number | undefined>(
    undefined
  );
  const [hoverLineNumber, setHoverLineNumber] = useState<number | null>(null);

  return (
    <div className="flex h-[calc(100vh-2.5rem)]">
      <TextArea
        agsData={agsData}
        setAgsData={setAgsData}
        errors={errors}
        activeLineNumber={lineNumber}
        hoverLineNumber={hoverLineNumber}
      />
      <ErrorTable
        errors={errors}
        setActiveLineNumber={setActiveLineNumber}
        setHoverLineNumber={setHoverLineNumber}
      />
    </div>
  );
}
