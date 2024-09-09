"use client";

import { AgsError, validateAgsData } from "ags";

import { useEffect, useState } from "react";

export default function Validator() {
  const [agsData, setAgsData] = useState("");

  const [errors, setErrors] = useState<AgsError[]>([]);

  useEffect(() => {
    if (!agsData) {
      setErrors([]);
      return;
    }
    const agsErrors = validateAgsData(agsData);

    setErrors(agsErrors);
  }, [agsData]);

  return (
    <div>
      <h1>Page</h1>

      <input
        type="text"
        value={agsData}
        onChange={(e) => setAgsData(e.target.value)}
        className="w-1/2"
      ></input>

      <div>{JSON.stringify(errors, null, 2)}</div>
    </div>
  );
}
