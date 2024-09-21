import * as fs from "fs";
import * as path from "path";
import { parseAgs } from "../src/parse";

const assetsDir = path.join(__dirname, "../assets");

fs.readdir(assetsDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach((file) => {
    if (!file.endsWith(".ags")) {
      return;
    }

    const filePath = path.join(assetsDir, file);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }

      const parsed = parseAgs(data);
      console.log(parsed);
      //   save the parsed data to a file
      fs.writeFileSync(
        path.join(__dirname, `../assets/${file}.json`),
        JSON.stringify(parsed, null),
      );
    });
  });
});
