"use client";

import { useValidator } from "../hooks/useValidator";
import ValidatorTextArea from "./ValidatorTextArea";
import ValidatorErrorDisplay from "./ValidatorErrorDisplay";
import React, { useState } from "react";

export default function Validator() {
  const { agsData, setAgsData, errors } = useValidator();
  const [lineNumber, setActiveLineNumber] = useState<number | undefined>(undefined);
 
  return (
    <div className="flex h-[calc(100vh-2.5rem)]">
      <ValidatorTextArea
        agsData={agsData}
        setAgsData={setAgsData}
        errors={errors}
        activeLineNumber={lineNumber}
      />
      <ValidatorErrorDisplay errors={errors} setActiveLineNumber={setActiveLineNumber}/>
    </div>
  );
}
