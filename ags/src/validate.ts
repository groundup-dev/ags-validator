import { AgsError, AgsRaw, HeadingRaw, dataTypeSchema } from "./models";
import { parseAgs } from "./parse";

import { rulesForParsedAgs, rulesForRawString } from "./rules";

// function validateAgsHeadings(ags: AgsRaw): AgsError[] {
//   const errors: AgsError[] = [];

//   Object.entries(ags).forEach(([groupName, group]) => {
//     group.headings.forEach((heading) => {
//       try {
//         dataTypeSchema.parse(heading.type);
//       } catch (error) {
//         errors.push({
//           group: groupName,
//           lineNumber: group.lineNumber + 3, // Assuming heading types start at line 2 in the group
//           field: heading.name,
//           rule:

//         });
//       }
//     });
//   });

//   return errors;
// }

// TODO: Implement the validateAgs function fully

// export function validateAgs(ags: AgsRaw) {
//   const headerTypeErrors = validateAgsHeadings(ags);

//   return {
//     headerTypeErrors,
//   };
// }

// Function to validate raw AGS data using all validation steps
export function validateAgsData(rawAgs: string): AgsError[] {
  let allErrors: AgsError[] = [];

  // this only applies to the rulesForRawString object
  const rulesAsArray = Object.values(rulesForRawString);

  rulesAsArray.forEach((step) => {
    const errors = step.validate(rawAgs);
    allErrors = [...allErrors, ...errors];
  });

  //   now the AGS data should be safe to parse into the AgsRaw object
  const parsedAgs = parseAgs(rawAgs);

  const parsedRulesAsArray = Object.values(rulesForParsedAgs);
  parsedRulesAsArray.forEach((step) => {
    const errors = step.validate(parsedAgs);
    allErrors = [...allErrors, ...errors];
  });

  return allErrors;
}
