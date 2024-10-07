import { AgsRaw } from "../../../src/types";
import {
  rule9,
  rule10c,
  rule10a,
  rule10b,
} from "../../../src/rules/rulesForParsedAgs/checkHeadingsWithDict";

// Mock Dictionary Data
const mockDictCustom: AgsRaw = {
  DICT: {
    name: "DICT",
    lineNumber: 1,
    headings: [
      { name: "DICT_GRP", type: "X", unit: "" },
      { name: "DICT_HDNG", type: "X", unit: "" },
    ],
    rows: [
      { lineNumber: 2, data: { DICT_GRP: "LOCA", DICT_HDNG: "LOCA_CUST" } },
    ],
  },
};

// Example data for testing
const validData: AgsRaw = {
  PROJ: {
    name: "PROJ",
    lineNumber: 1,
    headings: [
      { name: "PROJ_ID", type: "ID", unit: "" },
      { name: "PROJ_NAME", type: "X", unit: "" },
    ],
    rows: [{ data: { PROJ_ID: "001", PROJ_NAME: "Project 1" }, lineNumber: 2 }],
  },

  LOCA: {
    name: "LOCA",
    lineNumber: 1,
    headings: [
      { name: "LOCA_ID", type: "ID", unit: "" },
      { name: "LOCA_TYPE", type: "X", unit: "" },
    ],
    rows: [
      { data: { LOCA_ID: "001", LOCA_TYPE: "Type A" }, lineNumber: 2 },
      { data: { LOCA_ID: "002", LOCA_TYPE: "Type B" }, lineNumber: 3 },
    ],
  },
  SAMP: {
    name: "SAMP",
    lineNumber: 10,
    headings: [
      { name: "LOCA_ID", type: "ID", unit: "" },
      { name: "SAMP_ID", type: "ID", unit: "" },
      { name: "SAMP_TOP", type: "1DP", unit: "m" },
    ],
    rows: [
      {
        data: { SAMP_ID: "S001", SAMP_TOP: "5.5", LOCA_ID: "001" },
        lineNumber: 11,
      },
      {
        data: { SAMP_ID: "S002", SAMP_TOP: "10.5", LOCA_ID: "001" },
        lineNumber: 12,
      },
    ],
  },
};

// Test for Rule 9
describe("AGS Rule 9: Heading and Group validation", () => {
  const dictVersion = "v4_0_4";

  it("should return no errors for valid headings and groups", () => {
    const errors = rule9.validate(validData, dictVersion);
    expect(errors).toHaveLength(0);
  });

  it("should return a warning for user-defined headings found in DICT group", () => {
    const userDefinedData = {
      ...validData,
      ...mockDictCustom,

      LOCA: {
        ...validData.LOCA,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "LOCA_TYPE", type: "X", unit: "" },
          { name: "LOCA_CUST", type: "X", unit: "" }, // Non-standard heading
        ],
      },
    };

    const errors = rule9.validate(userDefinedData, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("is non-standard");
    expect(errors[0].severity).toBe("warning");
  });

  it("should return an error if the heading is neither in dictionary nor in DICT group", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "LOCA_TYPE", type: "X", unit: "" },
          { name: "LOCA_MISS", type: "X", unit: "" }, // Invalid heading
        ],
      },
    };

    const errors = rule9.validate(invalidData, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("is not found in AGS version");
    expect(errors[0].severity).toBe("error");
  });
});

// Test for Rule 10c
describe("AGS Rule 10c: Key field links between groups", () => {
  const dictVersion = "v4_0_4";

  it("should return an error when a parent group is missing", () => {
    const invalidData = {
      SAMP: {
        name: "SAMP",
        lineNumber: 10,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "SAMP_ID", type: "ID", unit: "" },
          { name: "SAMP_TOP", type: "1DP", unit: "m" },
        ],
        rows: [
          {
            data: { SAMP_ID: "S001", SAMP_TOP: "5.5", LOCA_ID: "001" },
            lineNumber: 11,
          },
        ],
      },
    };

    const errors = rule10c.validate(invalidData, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Parent group LOCA is not present in the AGS file",
    );
  });

  it("should return an error when key values do not have a match in the parent group", () => {
    const invalidData = {
      PROJ: validData.PROJ,
      LOCA: {
        name: "LOCA",
        lineNumber: 1,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "LOCA_TYPE", type: "X", unit: "" },
        ],
        rows: [
          { data: { LOCA_ID: "001", LOCA_TYPE: "Type A" }, lineNumber: 2 },
        ],
      },
      SAMP: {
        name: "SAMP",
        lineNumber: 10,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "SAMP_ID", type: "ID", unit: "" },
          { name: "SAMP_TOP", type: "1DP", unit: "m" },
        ],
        rows: [
          {
            data: { SAMP_ID: "S001", SAMP_TOP: "5.5", LOCA_ID: "002" }, // LOCA_ID does not match the parent group
            lineNumber: 11,
          },
        ],
      },
    };

    const errors = rule10c.validate(invalidData, dictVersion);
    expect(errors).toHaveLength(1);
  });

  it("should pass when values found in parent group", () => {
    const invalidData = {
      PROJ: validData.PROJ,
      LOCA: {
        name: "LOCA",
        lineNumber: 1,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "LOCA_TYPE", type: "X", unit: "" },
        ],
        rows: [
          { data: { LOCA_ID: "001", LOCA_TYPE: "Type A" }, lineNumber: 2 },
        ],
      },
      GEOL: {
        name: "GEOL",
        lineNumber: 10,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "GEOL_TOP", type: "2DP", unit: "" },
          { name: "GEOL_BASE", type: "2DP", unit: "m" },
        ],
        rows: [
          {
            data: { GEOL_TOP: "10.00", GEOL_BASE: "9.00", LOCA_ID: "001" }, // LOCA_ID does not match the parent group
            lineNumber: 11,
          },
        ],
      },
    };

    const errors = rule10c.validate(invalidData, dictVersion);
    expect(errors).toHaveLength(0);
  });
});

// Test for Rule 10a: No duplicate key values
describe("AGS Rule 10a: No duplicate key values in any GROUP", () => {
  const dictVersion = "v4_0_4";

  it("should return no errors when all key values are unique within the group", () => {
    const errors = rule10a.validate(validData, dictVersion);
    expect(errors).toHaveLength(0);
  });

  it("should return an error when duplicate key values are found in the same group", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          { data: { LOCA_ID: "001", LOCA_TYPE: "Type A" }, lineNumber: 2 },
          { data: { LOCA_ID: "001", LOCA_TYPE: "Type B" }, lineNumber: 3 }, // Duplicate LOCA_ID
        ],
      },
    };

    const errors = rule10a.validate(invalidData, dictVersion);
    expect(errors).toHaveLength(2);
    expect(errors[0].message).toContain(
      "Duplicate key values found in group LOCA",
    );
  });

  it("should handle multiple duplicate rows in different groups", () => {
    const multipleInvalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          { data: { LOCA_ID: "001", LOCA_TYPE: "Type A" }, lineNumber: 2 },
          { data: { LOCA_ID: "001", LOCA_TYPE: "Type B" }, lineNumber: 3 }, // Duplicate LOCA_ID
        ],
      },
      SAMP: {
        ...validData.SAMP,
        rows: [
          {
            data: { SAMP_ID: "S001", SAMP_TOP: "5.5", LOCA_ID: "001" },
            lineNumber: 11,
          },
          {
            data: { SAMP_ID: "S001", SAMP_TOP: "5.5", LOCA_ID: "001" },
            lineNumber: 12,
          }, // Duplicate SAMP_ID
        ],
      },
    };

    const errors = rule10a.validate(multipleInvalidData, dictVersion);
    expect(errors).toHaveLength(4); // Two errors, one in LOCA and one in SAMP
    expect(errors[0].message).toContain(
      "Duplicate key values found in group LOCA",
    );
    expect(errors[2].message).toContain(
      "Duplicate key values found in group SAMP",
    );
  });

  it("should return no errors if the keys are unique across different groups", () => {
    const uniqueKeysAcrossGroups = {
      LOCA: {
        ...validData.LOCA,
        rows: [
          { data: { LOCA_ID: "001", LOCA_TYPE: "Type A" }, lineNumber: 2 },
        ],
      },
      SAMP: {
        ...validData.SAMP,
        rows: [
          {
            data: { SAMP_ID: "S001", SAMP_TOP: "5.5", LOCA_ID: "001" },
            lineNumber: 11,
          },
        ],
      },
    };

    const errors = rule10a.validate(uniqueKeysAcrossGroups, dictVersion);
    expect(errors).toHaveLength(0);
  });
});

const validDataWithRequiredFields: AgsRaw = {
  PROJ: {
    name: "PROJ",
    lineNumber: 1,
    headings: [
      { name: "PROJ_ID", type: "ID", unit: "" },
      { name: "PROJ_NAME", type: "X", unit: "" },
    ],
    rows: [{ data: { PROJ_ID: "001", PROJ_NAME: "Project 1" }, lineNumber: 2 }],
  },
};

// Test for Rule 10b: REQUIRED fields validation
describe("AGS Rule 10b: Required fields must be present and non-empty", () => {
  const dictVersion = "v4_0_4";

  it("should return no errors when all required fields are present and non-empty", () => {
    const errors = rule10b.validate(validDataWithRequiredFields, dictVersion);
    expect(errors).toHaveLength(0);
  });

  it("should return an error when a required field is missing from the group", () => {
    const missingRequiredFieldData = {
      PROJ: {
        name: "PROJ",
        lineNumber: 1,
        headings: [{ name: "PROJ_NAME", type: "X", unit: "" }],
        rows: [{ data: { PROJ_NAME: "Project 1" }, lineNumber: 2 }],
      },
    };

    const errors = rule10b.validate(missingRequiredFieldData, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("cannot be null or empty");
    expect(errors[0].severity).toBe("error");
  });

  it("should return an error when a required field has an empty value", () => {
    const emptyRequiredFieldData = {
      PROJ: {
        name: "PROJ",
        lineNumber: 1,
        headings: [
          { name: "PROJ_ID", type: "ID", unit: "" },
          { name: "PROJ_NAME", type: "X", unit: "" },
        ],
        rows: [
          { data: { PROJ_ID: "", PROJ_NAME: "Project 1" }, lineNumber: 2 },
        ],
      },
    };

    const errors = rule10b.validate(emptyRequiredFieldData, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("cannot be null or empty");
    expect(errors[0].severity).toBe("error");
  });
});
