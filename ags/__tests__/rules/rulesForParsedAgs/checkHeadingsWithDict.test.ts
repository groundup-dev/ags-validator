import { AgsRaw } from "../../../src/types";
import { rule10c } from "../../../src/rules/rulesForParsedAgs/checkHeadingsWithDict";

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

// Test for Rule 10c
describe("AGS Rule 10c: ", () => {
  const dictVersion = "v4_0_4";

  it("should return no errors when all headings are present in the dictionary", () => {
    const errors = rule10c.validate(validData, dictVersion);
    expect(errors).toHaveLength(0);
  });
});
