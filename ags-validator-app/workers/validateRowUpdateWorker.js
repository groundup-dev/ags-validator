// validationWorker.js
import {
    validateAgsDataParsed,
    validateAgsDataParsedWithDict,
    parsedAgsToString,
  } from "@groundup/ags";
  
  self.onmessage = (event) => {
    const {parsedAgsNormalized, rulesConfig} = event.data;

    console.log('parsedAgsNormalized', parsedAgsNormalized);
    console.log('rulesConfig', rulesConfig);
  

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
      ...validateAgsDataParsed(parsedAgs, rulesConfig),
      ...validateAgsDataParsedWithDict(parsedAgs, "v4_0_4", rulesConfig),
    ];
    const rawData = parsedAgsToString(parsedAgs);
  

    self.postMessage({ rawData, errors });
  };
  