import { AgsRaw } from "../../../src/types";
import {
  rule11,
  rule13,
  rule14,
  rule15,
  rule16,
  rule17,
} from "../../../src/rules/rulesForParsedAgs/checkRequiredGroups";

// Example data for testing
const validDataWithProj: AgsRaw = {
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

const validDataWithTran: AgsRaw = {
  TRAN: {
    name: "TRAN",
    lineNumber: 1,
    headings: [
      { name: "TRAN_ID", type: "ID", unit: "" },
      { name: "TRAN_NAME", type: "X", unit: "" },
      { name: "TRAN_RCON", type: "X", unit: "" },
    ],
    rows: [
      {
        data: { TRAN_ID: "001", TRAN_NAME: "Transaction 1", TRAN_RCON: "+" },
        lineNumber: 2,
      },
    ],
  },
};

const validDataWithTypeAndUnits: AgsRaw = {
  TYPE: {
    name: "TYPE",
    lineNumber: 1,
    headings: [{ name: "TYPE_TYPE", type: "X", unit: "" }],
    rows: [
      { data: { TYPE_TYPE: "ID" }, lineNumber: 2 },

      { data: { TYPE_TYPE: "X" }, lineNumber: 3 },
      { data: { TYPE_TYPE: "PU" }, lineNumber: 4 },
      { data: { TYPE_TYPE: "PA" }, lineNumber: 4 },
    ],
  },
  UNIT: {
    name: "UNIT",
    lineNumber: 1,
    headings: [{ name: "UNIT_UNIT", type: "X", unit: "" }],
    rows: [{ data: { UNIT_UNIT: "m" }, lineNumber: 2 }],
  },
  LOCA: {
    name: "LOCA",
    lineNumber: 10,
    headings: [
      { name: "LOCA_ID", type: "ID", unit: "" },
      { name: "LOCA_UNIT", type: "PU", unit: "" },
      { name: "LOCA_TYPE", type: "PA", unit: "" },
    ],
    rows: [{ data: { LOCA_ID: "001", LOCA_UNIT: "m" }, lineNumber: 11 }],
  },
};

// Test for Rule 13: Validate PROJ group
describe("AGS Rule 13: Validate PROJ group", () => {
  it("should return an error if PROJ group is missing", () => {
    const invalidData = {};
    const errors = rule13.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("PROJ group is required");
  });

  it("should return an error if PROJ group has more than one row", () => {
    const invalidData = {
      PROJ: {
        ...validDataWithProj.PROJ,
        rows: [
          { data: { PROJ_ID: "001", PROJ_NAME: "Project 1" }, lineNumber: 2 },
          { data: { PROJ_ID: "002", PROJ_NAME: "Project 2" }, lineNumber: 3 },
        ],
      },
    };
    const errors = rule13.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "PROJ group must contain exactly one row",
    );
  });

  it("should return no errors for valid PROJ group", () => {
    const errors = rule13.validate(validDataWithProj);
    expect(errors).toHaveLength(0);
  });
});

// Test for Rule 14: Validate TRAN group
describe("AGS Rule 14: Validate TRAN group", () => {
  it("should return an error if TRAN group is missing", () => {
    const invalidData = {};
    const errors = rule14.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("TRAN group is required");
  });

  it("should return an error if TRAN group has more than one row", () => {
    const invalidData = {
      TRAN: {
        ...validDataWithTran.TRAN,
        rows: [
          {
            data: { TRAN_ID: "001", TRAN_NAME: "Transaction 1" },
            lineNumber: 2,
          },
          {
            data: { TRAN_ID: "002", TRAN_NAME: "Transaction 2" },
            lineNumber: 3,
          },
        ],
      },
    };
    const errors = rule14.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "TRAN group must contain exactly one row",
    );
  });

  it("should return no errors for valid TRAN group", () => {
    const errors = rule14.validate(validDataWithTran);
    expect(errors).toHaveLength(0);
  });
});

// Test for Rule 15: Validate UNIT group and units
describe("AGS Rule 15: Validate UNIT group and units", () => {
  it("should return an error if UNIT group is missing", () => {
    const invalidData = {
      ...validDataWithTypeAndUnits,
    };
    delete invalidData.UNIT;
    const errors = rule15.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("UNIT group is required");
  });

  it("should return an error if a unit is not defined in UNIT", () => {
    const invalidData = {
      ...validDataWithTypeAndUnits,
      LOCA: {
        ...validDataWithTypeAndUnits.LOCA,
        headings: [
          { name: "LOCA_ID", type: "ID", unit: "" },
          { name: "LOCA_UNIT", type: "PU", unit: "ft" }, // Undefined unit
        ],
      },
    };
    const errors = rule15.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Unit 'ft' is not defined in UNIT");
  });

  it("should return no errors when all units are valid", () => {
    const errors = rule15.validate(validDataWithTypeAndUnits);
    expect(errors).toHaveLength(0);
  });
});

// Test for Rule 16: Validate ABBR group when abbreviations are included
describe("AGS Rule 16: Validate ABBR group", () => {
  const validDataWithAbbr: AgsRaw = {
    TRAN: {
      name: "TRAN",
      lineNumber: 1,
      headings: [{ name: "TRAN_RCON", type: "X", unit: "" }],
      rows: [{ data: { TRAN_RCON: "+" }, lineNumber: 2 }],
    },
    ABBR: {
      name: "ABBR",
      lineNumber: 5,
      headings: [{ name: "ABBR_ABBR", type: "X", unit: "" }],
      rows: [{ data: { ABBR_ABBR: "abv" }, lineNumber: 6 }],
    },
  };

  it("should return a warning if ABBR group is missing and abbreviations are used", () => {
    const invalidData = {
      TRAN: validDataWithAbbr.TRAN,
    };
    const errors = rule16.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].severity).toBe("warning");
    expect(errors[0].message).toContain("ABBR group is required");
  });

  it("should return no errors when ABBR group is present and abbreviations are used", () => {
    const errors = rule16.validate(validDataWithAbbr);
    expect(errors).toHaveLength(0);
  });
});

// Test for Rule 17: Validate TYPE group for defining types
describe("AGS Rule 17: Validate TYPE group", () => {
  it("should return an error if a type used in headings is not defined in TYPE", () => {
    const invalidData = {
      ...validDataWithTypeAndUnits,
      LOCA: {
        ...validDataWithTypeAndUnits.LOCA,
        headings: [
          { name: "LOCA_ID", type: "UNDEFINED_TYPE", unit: "" }, // Undefined type
          { name: "LOCA_DEPTH", type: "PU", unit: "m" },
        ],
      },
    };
    const errors = rule17.validate(invalidData);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Type 'UNDEFINED_TYPE' is not defined in TYPE",
    );
  });

  it("should return no errors when all types are defined in TYPE", () => {
    const errors = rule17.validate(validDataWithTypeAndUnits);
    expect(errors).toHaveLength(0);
  });
});

// Test for Rule 11: Record Link (RL) field validation
describe("AGS Rule 11: Record Link (RL) field validation", () => {
  const dictVersion = "v4_0_4";

  it("should return an error if the linked group in RL field does not exist", () => {
    const dataWithMissingGroup: AgsRaw = {
      ...validDataWithTypeAndUnits,
      TRAN: {
        name: "TRAN",
        lineNumber: 1,
        headings: [
          { name: "TRAN_DLIM", type: "X", unit: "" },
          { name: "TRAN_RCON", type: "X", unit: "" },
        ],
        rows: [{ data: { TRAN_DLIM: "|", TRAN_RCON: "+" }, lineNumber: 2 }],
      },
      SAMP: {
        name: "SAMP",
        lineNumber: 3,
        headings: [
          { name: "SAMP_LINK", type: "RL", unit: "" },
          { name: "SAMP_ID", type: "X", unit: "" },
        ],
        rows: [
          {
            data: { SAMP_LINK: "MONG|BH1|Pipe1", SAMP_ID: "SAMP_001" },
            lineNumber: 4,
          },
        ],
      },
      // MONG group does not exist
    };

    const errors = rule11.validate(dataWithMissingGroup, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain("Group 'MONG' is not defined in AGS");
    expect(errors[0].severity).toBe("error");
  });

  it("should return no errors if RL field correctly links to a group", () => {
    const validDataWithLink = {
      ...validDataWithTypeAndUnits,
      TRAN: {
        name: "TRAN",
        lineNumber: 1,
        headings: [
          { name: "TRAN_DLIM", type: "X", unit: "" },
          { name: "TRAN_RCON", type: "X", unit: "" },
        ],
        rows: [{ data: { TRAN_DLIM: "|", TRAN_RCON: "+" }, lineNumber: 2 }],
      },
      LOCA: {
        name: "LOCA",
        lineNumber: 3,
        headings: [
          { name: "LOCA_ID", type: "X", unit: "" },
          { name: "LOCA_DESC", type: "X", unit: "" },
        ],
        rows: [
          { data: { LOCA_ID: "BH1", LOCA_DESC: "Borehole 1" }, lineNumber: 4 },
        ],
      },
      SAMP: {
        name: "SAMP",
        lineNumber: 5,
        headings: [
          { name: "SAMP_LINK", type: "RL", unit: "" },
          { name: "SAMP_ID", type: "X", unit: "" },
        ],
        rows: [
          {
            data: { SAMP_LINK: "LOCA|BH1", SAMP_ID: "SAMP_001" },
            lineNumber: 6,
          },
        ],
      },
    };

    const errors = rule11.validate(validDataWithLink, dictVersion);
    expect(errors).toHaveLength(0); // No errors since the link is valid
  });

  it("should return an error if no matching row is found in the linked group", () => {
    const dataWithMissingRow: AgsRaw = {
      ...validDataWithTypeAndUnits,
      TRAN: {
        name: "TRAN",
        lineNumber: 1,
        headings: [
          { name: "TRAN_DLIM", type: "X", unit: "" },
          { name: "TRAN_RCON", type: "X", unit: "" },
        ],
        rows: [{ data: { TRAN_DLIM: "|", TRAN_RCON: "+" }, lineNumber: 2 }],
      },
      LOCA: {
        name: "LOCA",
        lineNumber: 3,
        headings: [
          { name: "LOCA_ID", type: "X", unit: "" },
          { name: "LOCA_DESC", type: "X", unit: "" },
        ],
        rows: [
          { data: { LOCA_ID: "BH2", LOCA_DESC: "Borehole 2" }, lineNumber: 4 },
        ],
      },
      SAMP: {
        name: "SAMP",
        lineNumber: 5,
        headings: [
          { name: "SAMP_LINK", type: "RL", unit: "" },
          { name: "SAMP_ID", type: "X", unit: "" },
        ],
        rows: [
          {
            data: { SAMP_LINK: "LOCA|BH1", SAMP_ID: "SAMP_001" },
            lineNumber: 6,
          },
        ],
      },
    };

    const errors = rule11.validate(dataWithMissingRow, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "No matching row found in group 'LOCA' for LOCA|BH1",
    );
    expect(errors[0].severity).toBe("error");
  });

  it("should return an error if multiple matching rows are found in the linked group", () => {
    const dataWithMultipleRows = {
      ...validDataWithTypeAndUnits,
      TRAN: {
        name: "TRAN",
        lineNumber: 1,
        headings: [
          { name: "TRAN_DLIM", type: "X", unit: "" },
          { name: "TRAN_RCON", type: "X", unit: "" },
        ],
        rows: [{ data: { TRAN_DLIM: "|", TRAN_RCON: "+" }, lineNumber: 2 }],
      },
      LOCA: {
        name: "LOCA",
        lineNumber: 3,
        headings: [
          { name: "LOCA_ID", type: "X", unit: "" },
          { name: "LOCA_DESC", type: "X", unit: "" },
        ],
        rows: [
          { data: { LOCA_ID: "BH1", LOCA_DESC: "Borehole 1" }, lineNumber: 4 },
          {
            data: { LOCA_ID: "BH1", LOCA_DESC: "Borehole 1 duplicate" },
            lineNumber: 5,
          },
        ], // Duplicate MONG_ID entries
      },
      SAMP: {
        name: "SAMP",
        lineNumber: 6,
        headings: [
          { name: "SAMP_LINK", type: "RL", unit: "" },
          { name: "SAMP_ID", type: "X", unit: "" },
        ],
        rows: [
          {
            data: { SAMP_LINK: "LOCA|BH1", SAMP_ID: "SAMP_001" },
            lineNumber: 7,
          },
        ],
      },
    };

    const errors = rule11.validate(dataWithMultipleRows, dictVersion);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain(
      "Multiple matching rows found in group 'LOCA' for LOCA|BH1",
    );
    expect(errors[0].severity).toBe("error");
  });
});
