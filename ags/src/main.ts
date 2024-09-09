import * as fs from "fs"; // Node.js file system module
import { parseAgs } from "./parse"; // Adjust the path to where your parsing code is saved
import { validateAgsData } from "./validate";

// Read the contents of the AGS file
const filePath =
  "/Users/jamesholcombe/Documents/git/groundup/36A Halsey Street London (1).ags";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading the file: ${err}`);
    return;
  }
  const a = performance.now();
  const errors = validateAgsData(data);

  const b = performance.now();
  console.log("Time taken " + (b - a) + " ms.");

  console.log("Errors:", errors);
});
