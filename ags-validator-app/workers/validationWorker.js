// validationWorker.js
import {
    validateAgsDataParsed,
    validateAgsDataParsedWithDict,
    parsedAgsToString,
  } from "@groundup/ags";
  
  self.onmessage = (event) => {
    const parsedAgsNormalized = event.data;
  
    // Reformat rows to the required structure
    const parsedAgs = Object.fromEntries(
      Object.entries(parsedAgsNormalized).map(([label, group]) => [
        label,
        {
          ...group,
          rows: Object.values(group.rows),
        },
      ])
    );
  
    // Perform validation and transform
    const errors = [
      ...validateAgsDataParsed(parsedAgs),
      ...validateAgsDataParsedWithDict(parsedAgs, "v4_0_4"),
    ];
    const rawData = parsedAgsToString(parsedAgs);
  
    // Send the result back to the main thread
    self.postMessage({ rawData, errors });
  };
  