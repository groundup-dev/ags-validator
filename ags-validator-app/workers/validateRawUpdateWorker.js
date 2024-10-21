import { validateAgsData } from "@groundup/ags";
  
  self.onmessage = (event) => {

    const {rawData, rulesConfig } = event.data;
    const {errors, parsedAgs} = validateAgsData(rawData, rulesConfig);
    console.log(errors);

    const parsedAgsNormalized = parsedAgs ? Object.fromEntries(
         Object.entries(parsedAgs).map(([label, group]) => [
          label,
          {
            ...group,
            rows: Object.fromEntries(
              group.rows.map((row) => [row.lineNumber, row])
            ),
          },
        ])) : undefined;
  
    self.postMessage({ parsedAgsNormalized, errors });
  };
  