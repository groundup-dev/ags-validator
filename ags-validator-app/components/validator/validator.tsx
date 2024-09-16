"use client";

import { useValidator } from "../hooks/useValidator";
import ValidatorTextArea from "./ValidatorTextArea";
import ValidatorErrorDisplay from "./ValidatorErrorDisplay";
import React from "react";

export default function Validator() {
  const { agsData, setAgsData, errors } = useValidator();

  return (
    <div className="flex h-[calc(100vh-2.5rem)]">
      <ValidatorTextArea
        agsData={agsData}
        setAgsData={setAgsData}
        errors={errors}
      />
      <ValidatorErrorDisplay errors={errors} />
    </div>
  );
}
