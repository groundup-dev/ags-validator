"use client";

import { useValidator } from "../hooks/useValidator";
import ValidatorTextArea from "./TextArea/ValidatorTextArea";
import ValidatorErrorDisplay from "./ErrorTable/ValidatorErrorDisplay";
import React, { useState } from "react";

export default function Validator() {
  const { agsData, setAgsData, errors } = useValidator();
  const [lineNumber, setActiveLineNumber] = useState<number | undefined>(undefined);
  const [hoverLineNumber, setHoverLineNumber] = useState<number | null>(null);

 
  return (
    <div className="flex h-[calc(100vh-2.5rem)]">
      <ValidatorTextArea
        agsData={agsData}
        setAgsData={setAgsData}
        errors={errors}
        activeLineNumber={lineNumber}
        hoverLineNumber={hoverLineNumber}
      />
      <ValidatorErrorDisplay errors={errors} setActiveLineNumber={setActiveLineNumber} setHoverLineNumber={setHoverLineNumber}/>
    </div>
  );
}
