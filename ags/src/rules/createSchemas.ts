import { z } from "zod";
import { HeadingRaw, AgsRaw } from "../models";

function createDpHeadingSchema(heading: HeadingRaw): z.ZodType<string> {
  const decimalPlaces = parseInt(heading.type[0]);

  if (decimalPlaces == 0) {
    return z.string().regex(/^-?\d+$/);
  } else {
    const schema = z
      .string()
      .regex(new RegExp(`^-?\\d+\\.\\d{${decimalPlaces}}$`));

    return schema;
  }
}

function createDtHeadingSchema(heading: HeadingRaw): z.ZodType<string> {
  // yyyy-mm-ddThh:mm:ss.sssZ(+hh:mm) or yyyy-mm-dd or
  // hh:mm:ss or yyyy

  let pattern = "";
  for (const char of heading.unit) {
    if (["y", "m", "d", "h", "s"].includes(char)) {
      // if char is a valid date character, we assume it is placeholder for value
      pattern += "\\d";
    } else if (char === "+") {
      // if + then + or minus is allowed
      pattern += "[+-]";
    } else {
      // if not a date character, then it is a separator, or label like T or Z
      pattern += char;
    }
  }

  return z.string().regex(new RegExp(pattern));
}

function createTHeadingSchema(heading: HeadingRaw): z.ZodType<string> {
  // hh:mm:ss
  let pattern = "";
  for (const char of heading.unit) {
    if (["h", "m", "s"].includes(char)) {
      // if char is a valid date character, we assume it is placeholder for value
      pattern += "\\d";
    } else {
      // if not a date character, then it is a separator
      pattern += char;
    }
  }

  return z.string().regex(new RegExp(pattern));
}

function createSigFigHeadingSchema(heading: HeadingRaw): z.ZodType<string> {
  const nInt = parseInt(heading.type.replace(/SF/g, ""));

  const pattern = `^0*\\d\\.?\\d{0,${nInt - 1}}0*$`;

  return z.string().regex(new RegExp(pattern));
}

function createNSCIHeadingSchema(heading: HeadingRaw): z.ZodType<string> {
  const nInt = parseInt(heading.type.replace(/SCI/g, ""));

  // match scientific notation with e or E
  const pattern = `[-+]?\\d+\\.\\d{${nInt}}[eE][-+]?\\d+`;

  return z.string().regex(new RegExp(pattern));
}

export function createZodSchemasForHeadings(
  ags: AgsRaw,
): Record<string, Record<string, z.ZodType<string>>> {
  const groupSchemas: Record<string, Record<string, z.ZodType<string>>> = {};

  for (const [groupName, group] of Object.entries(ags)) {
    groupSchemas[groupName] = {};

    // at this point we are assuming that headings are of suitable type,
    // other validation should have been done before this point
    // we perform a switch on the heading type to determine the schema

    // decimal place headings
    const xDPHeadings = group.headings.filter((heading) =>
      heading.type.endsWith("DP"),
    );
    for (const heading of xDPHeadings) {
      groupSchemas[groupName][heading.name] = createDpHeadingSchema(heading);
    }

    // datetime headings
    const DTHeadings = group.headings.filter(
      (heading) => heading.type === "DT",
    );
    for (const heading of DTHeadings) {
      groupSchemas[groupName][heading.name] = createDtHeadingSchema(heading);
    }

    // scientific notation headings
    const NSCIHeadings = group.headings.filter((heading) =>
      heading.type.endsWith("SCI"),
    );

    for (const heading of NSCIHeadings) {
      groupSchemas[groupName][heading.name] = createNSCIHeadingSchema(heading);
    }

    // significant figures headings
    const SFHeadings = group.headings.filter((heading) =>
      heading.type.endsWith("SF"),
    );
    for (const heading of SFHeadings) {
      groupSchemas[groupName][heading.name] =
        createSigFigHeadingSchema(heading);
    }

    const YNHeadings = group.headings.filter((heading) =>
      heading.type.endsWith("YN"),
    );

    // yes no headings
    for (const heading of YNHeadings) {
      // r'^(Y|N|y|n)$'
      groupSchemas[groupName][heading.name] = z.string().regex(/^[YNyn]$/);
    }

    // time headings
    const THeadings = group.headings.filter((heading) => heading.type === "T");
    for (const heading of THeadings) {
      groupSchemas[groupName][heading.name] = createTHeadingSchema(heading);
    }

    // all others are treated as strings
    // note we are not checking picklist values here, they are just treated as text
    const textHeadings = group.headings.filter((heading) =>
      ["ID", "PA", "PT", "PU", "X", "XN", "U"].includes(heading.type),
    );
    for (const heading of textHeadings) {
      groupSchemas[groupName][heading.name] = z.string();
    }
  }

  //   allow empty strings for all fields, as they are treated as optional
  for (const [groupName, group] of Object.entries(ags)) {
    for (const heading of group.headings) {
      groupSchemas[groupName][heading.name] = z.union([
        groupSchemas[groupName][heading.name] || z.string(),
        z.string().length(0),
      ]);
    }
  }

  return groupSchemas;
}
