import { AgsRaw, AgsError } from "../../../src/types";
import { rule8 } from "../../../src/rules/rulesForParsedAgs/checkDataTypes";

// Sample data for testing various data types
const validData: AgsRaw = {
  LOCA: {
    name: "LOCA",
    lineNumber: 1,
    headings: [
      { name: "LOCA_ID", type: "ID", unit: "" },
      { name: "LOCA_DESC", type: "PA", unit: "" },
      { name: "LOCA_X", type: "X", unit: "m" },
      { name: "LOCA_Y", type: "X", unit: "m" },
      { name: "LOCA_DP", type: "2DP", unit: "m" },
      { name: "LOCA_DT", type: "DT", unit: "yyyy-mm-dd" },
      { name: "LOCA_SCI", type: "2SCI", unit: "" },
      { name: "LOCA_SF", type: "3SF", unit: "" },
      { name: "LOCA_YN", type: "YN", unit: "" },
    ],
    rows: [
      {
        data: {
          LOCA_ID: "LOC001",
          LOCA_DESC: "Description of Location",
          LOCA_X: "100.123",
          LOCA_Y: "200.456",
          LOCA_DP: "50.12", // 2DP
          LOCA_DT: "2023-09-01", // Valid date
          LOCA_SCI: "1.23e4", // 2 decimal scientific notation
          LOCA_SF: "123", // 3 significant figures
          LOCA_YN: "Y", // Yes/No valid value
        },
        lineNumber: 2,
      },
    ],
  },
};

describe("AGS Rule 8: Data types validation", () => {
  // Test for a valid case with all data types matching their respective schemas
  it("should return no errors when all data types are valid", () => {
    const errors: AgsError[] = rule8.validate(validData);
    expect(errors).toHaveLength(0);
  });

  // Test for invalid decimal places (2DP but value has 3 decimal places)
  it("should return an error for an invalid 2DP value", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_DP: "50.123", // Invalid, should have only 2 decimal places
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Data variable '50.123' does not match the UNIT 'm' and TYPE '2DP'",
    );
  });

  // Test for invalid datetime format (YYYY-MM-DD expected)
  it("should return an error for an invalid DT value", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_DT: "09-01-2023", // Invalid, expected YYYY-MM-DD
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Data variable '09-01-2023' does not match the UNIT 'yyyy-mm-dd' and TYPE 'DT'",
    );
  });

  // Test for invalid scientific notation (2SCI, expecting 2 decimal places)
  it("should return an error for an invalid 2SCI value", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_SCI: "1.234e4", // Invalid, should only have 2 decimal places
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Data variable '1.234e4' does not match the UNIT '' and TYPE '2SCI'",
    );
  });

  // Test for invalid significant figures (3SF, value should have exactly 3 significant figures)
  it("should return an error for an invalid 3SF value", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_SF: "0.12", // Invalid, should have 3 significant figures
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Data variable '0.12' does not match the UNIT '' and TYPE '3SF'",
    );
  });
  // Test for invalid significant figures (3SF, value should have exactly 3 significant figures)
  it("should return an error for an invalid 3SF value", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_SF: "121234", // Invalid, should have 3 significant figures
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Data variable '121234' does not match the UNIT '' and TYPE '3SF'",
    );
  });

  // Test for invalid Yes/No value (YN, expecting Y or N)
  it("should return an error for an invalid YN value", () => {
    const invalidData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_YN: "Maybe", // Invalid, only Y or N allowed
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Data variable 'Maybe' does not match the UNIT '' and TYPE 'YN'",
    );
  });

  // Test for an empty value (allowed case)
  it("should return no errors for an empty string in a field", () => {
    const emptyFieldData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_DESC: "", // Empty value, which is allowed
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(emptyFieldData);
    expect(errors).toHaveLength(0);
  });

  // Test for a valid text field (ID, PA, PT, PU, X, XN, U)
  it("should return no errors for valid text field values", () => {
    const textFieldData = {
      ...validData,
      LOCA: {
        ...validData.LOCA,
        rows: [
          {
            data: {
              ...validData.LOCA.rows[0].data,
              LOCA_ID: "LOC001", // Valid ID
              LOCA_DESC: "Valid description", // Valid PA
              LOCA_X: "100.123", // Valid X
            },
            lineNumber: 2,
          },
        ],
      },
    };

    const errors: AgsError[] = rule8.validate(textFieldData);
    expect(errors).toHaveLength(0);
  });
});
