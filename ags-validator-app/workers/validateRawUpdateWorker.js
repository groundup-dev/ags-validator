import { validateAgsData } from "@groundup/ags";
  
  self.onmessage = (event) => {
    const {errors, parsedAgs} = validateAgsData(event.data);

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
  

    // Send the result back to the main thread
    self.postMessage({ parsedAgsNormalized, errors });
  };
  