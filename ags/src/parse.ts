import { GroupRaw, AgsRaw } from "./types";

// Function to parse a single line into an array of strings
export function parseLine(input: string): string[] {
  // Each entry in input should be surrounded by double quotes
  // Each entry should be separated by a comma
  // Input should be parsed into an array of strings

  const parsedInput = input.split(",");
  const parsedInputNoQuotes = parsedInput.map((entry) =>
    entry.replace(/"/g, ""),
  );
  return parsedInputNoQuotes;
}

// Function to parse a single group
export function parseGroup(input: string, startLineNumber: number): GroupRaw {
  // Splitting lines with regex assuming newline characters split lines correctly
  const newLineRegex = /\r?\n/; // Handles both Windows and Unix newlines
  const parsedInput = input.split(newLineRegex);
  const lines = parsedInput.map((line) => parseLine(line));

  // Extracting key parts of the group
  const [
    [, groupName],
    [, ...headings],
    [, ...units],
    [, ...types],
    ...dataLines
  ] = lines;

  // remove datalines that are empty, or do not start WITH DATA
  const dataLinesEmptyRemoved = dataLines.filter(
    (line) => line.length > 0 && line[0] === "DATA",
  );

  // assign data,
  const data = dataLinesEmptyRemoved.map((line, index) => ({
    data: Object.fromEntries(
      line.slice(1).map((value, i) => [headings[i], value]),
    ),
    lineNumber: startLineNumber + index + 4, // Data lines start after the first three lines (group name, headings, units, types)
  }));

  const columns = headings.map((heading, index) => ({
    name: heading,
    type: types[index],
    unit: units[index],
  }));

  return {
    name: groupName,
    headings: columns,
    rows: data,
    lineNumber: startLineNumber,
  };
}

// Function to parse the entire AGS input into a structured AgsRaw object
export const parseAgs = (input: string): AgsRaw => {
  const splitter = /\n"GROUP",/;
  const parsedInput = input
    .split(splitter)
    .map((group, index) => (index === 0 ? group : `"GROUP",${group}`));

  // Accumulate parsed groups with their starting line numbers
  let currentLineNumber = 1; // Tracks the current line number
  const groups = parsedInput.map((group) => {
    const groupLines = group.split(/\r?\n/).length; // Count lines in the group
    const parsedGroup = parseGroup(group, currentLineNumber);
    currentLineNumber += groupLines; // Update the current line number for the next group
    return parsedGroup;
  });

  const ags: AgsRaw = {};
  groups.forEach((group) => {
    ags[group.name] = group;
  });

  return ags;
};
