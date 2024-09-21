// import { rule7, rule19, rule19a, rule19b } from '../../src/rules/rulesForParsedAgs/checkGroupAndHeadings';

import { AgsRaw } from "../../../src/types";
import {
  rule7,
  rule19,
  rule19a,
  rule19b,
} from "../../../src/rules/rulesForParsedAgs/checkGroupAndHeadings";

// Example data for testing
const validData: AgsRaw = {
  LOCA: {
    name: "LOCA",
    lineNumber: 1,
    headings: [
      { name: "LOCA_ID", type: "ID", unit: "" },
      { name: "LOCA_DESC", type: "X", unit: "" },
    ],
    rows: [
      { data: { LOCA_ID: "001", LOCA_DESC: "Location 1" }, lineNumber: 2 },
    ],
  },
  SAMP: {
    name: "SAMP",
    lineNumber: 10,
    headings: [
      { name: "LOCA_ID", type: "ID", unit: "" },
      { name: "SAMP_ID", type: "ID", unit: "" },
      { name: "SAMP_DPTH", type: "1DP", unit: "m" },
    ],
    rows: [
      {
        data: { SAMP_ID: "S001", SAMP_DPTH: "5.5", LOCA_ID: "001" },
        lineNumber: 11,
      },
    ],
  },
};

// Test for Rule 7
describe("AGS Rule 7: Order of data fields must follow the HEADING row", () => {
  it("should return no errors when the heading order is correct and no duplicates are present", () => {
    const errors = rule7.validate(validData);
    expect(errors).toHaveLength(0);
  });

  it("should return an error if there are duplicate headings in a group", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        headings: [
          { name: "LOCA_ID", type: "string", unit: "" },
          { name: "LOCA_ID", type: "string", unit: "" }, // Duplicate heading
        ],
      },
    };

    const errors = rule7.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Duplicate headings found in the group",
    );
  });
});

// Test for Rule 19
describe("AGS Rule 19: GROUP names should be <= 4 characters and uppercase letters/numbers only", () => {
  it("should return no errors for valid GROUP names", () => {
    const errors = rule19.validate(validData);
    expect(errors).toHaveLength(0);
  });

  it("should return an error for GROUP names that exceed 4 characters", () => {
    const invalidData = {
      INVALID: {
        name: "INVALID",
        lineNumber: 1,
        headings: [{ name: "INVALID_ID", type: "string", unit: "" }],
        rows: [{ data: { INVALID_ID: "001" }, lineNumber: 2 }],
      },
    };

    const errors = rule19.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Invalid GROUP name format");
  });

  it("should return an error for GROUP names with invalid characters", () => {
    const invalidData = {
      "LO@A": {
        name: "LO@A",
        lineNumber: 1,
        headings: [{ name: "LOCA_ID", type: "string", unit: "" }],
        rows: [{ data: { LOCA_ID: "001" }, lineNumber: 2 }],
      },
    };

    const errors = rule19.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Invalid GROUP name format");
  });
});

// Test for Rule 19a
describe("AGS Rule 19a: HEADING names should be <= 9 characters and consist of uppercase letters, numbers, or underscores", () => {
  it("should return no errors for valid HEADING names", () => {
    const errors = rule19a.validate(validData);
    expect(errors).toHaveLength(0);
  });

  it("should return a warning for HEADING names that exceed 9 characters", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        headings: [
          { name: "LOCA_VERYLONGNAME", type: "string", unit: "" }, // Too long
          { name: "LOCA_DESC", type: "string", unit: "" },
        ],
      },
    };

    const errors = rule19a.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Invalid HEADING name format");
  });

  it("should return a warning for HEADING names with invalid characters", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        headings: [
          { name: "LOCA_DESC$", type: "string", unit: "" }, // Invalid character
        ],
      },
    };

    const errors = rule19a.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Invalid HEADING name format");
  });
});

// Test for Rule 19b
describe("AGS Rule 19b: HEADING names must start with the GROUP name followed by an underscore", () => {
  it("should return no errors for valid HEADING names starting with GROUP name", () => {
    const errors = rule19b.validate(validData);
    expect(errors).toHaveLength(0);
  });

  it("should return an error for HEADING names that don't start with the GROUP name", () => {
    const invalidData = {
      LOCA: {
        ...validData.LOCA,
        headings: [
          { name: "LOC_ID", type: "string", unit: "" }, // Should be LOCA_ID
        ],
      },
    };

    const errors = rule19b.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "HEADING name does not start with the GROUP name",
    );
  });

  it("should return no errors if the HEADING name matches an existing heading in another group", () => {
    const matchingHeadingData = {
      LOCA: {
        name: "LOCA",
        lineNumber: 1,
        headings: [
          { name: "SAMP_DPTH", type: "1DP", unit: "m" }, // Same heading as in SAMP
          { name: "LOCA_ID", type: "ID", unit: "ID" },
        ],
        rows: [{ data: { SAMP_DPTH: "5.5" }, lineNumber: 2 }],
      },
      SAMP: validData.SAMP,
    };

    const errors = rule19b.validate(matchingHeadingData);
    expect(errors).toHaveLength(0);
  });
});
