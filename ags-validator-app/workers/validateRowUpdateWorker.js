// validationWorker.js
import {
    validateAgsDataParsed,
    validateAgsDataParsedWithDict,
    parsedAgsToString,
  } from "@groundup/ags";
  
  self.onmessage = (event) => {
    const parsedAgsNormalized = event.data;
  

    const parsedAgs = Object.fromEntries(
      Object.entries(parsedAgsNormalized).map(([label, group]) => [
        label,
        {
          ...group,
          rows: Object.values(group.rows),
        },
      ])
    );
  
    const errors = [
      ...validateAgsDataParsed(parsedAgs),
      ...validateAgsDataParsedWithDict(parsedAgs, "v4_0_4"),
    ];
    const rawData = parsedAgsToString(parsedAgs);
  

    self.postMessage({ rawData, errors });
  };
  