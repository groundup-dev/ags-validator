import { rulesForRawString } from "../../src/rules/rulesForRawData";

describe("AGS Data Validation Rules", () => {
  describe("Rule 1: ASCII characters only", () => {
    it("should return no errors for a file with only ASCII characters", () => {
      const validAsciiData = 'GROUP, "UNIT", "DATA"\r\n';
      const errors = rulesForRawString.rule1.validate(validAsciiData);
      expect(errors).toHaveLength(0);
    });

    it("should return errors for a file with non-ASCII characters", () => {
      const invalidAsciiData = 'GROUP, "UNIT", "DÄTA"\r\n'; // Contains non-ASCII character Ä
      const errors = rulesForRawString.rule1.validate(invalidAsciiData);
      expect(errors).toHaveLength(1);
    });
  });

  describe("Rule 2a: Line ends with CR and LF", () => {
    it("should return no errors for lines properly terminated with CR and LF", () => {
      const validData = 'GROUP, "UNIT"\r\n"DATA", "VALUE"\r\n';
      const errors = rulesForRawString.rule2a.validate(validData);
      expect(errors).toHaveLength(0);
    });

    it("should return an error for lines not terminated with CR and LF", () => {
      const invalidData = 'GROUP, "UNIT"\n"DATA", "VALUE"'; // LF without CR
      const errors = rulesForRawString.rule2a.validate(invalidData);
      expect(errors).toHaveLength(1);
    });
  });

  describe("Rule 3: Each line starts with a valid data descriptor", () => {
    it("should return no errors for valid data descriptors", () => {
      const validData =
        '"GROUP","GROUP_NAME"\r\n"HEADING","Field1","Field2"\r\n';
      const errors = rulesForRawString.rule3.validate(validData);
      expect(errors).toHaveLength(0);
    });

    it("should return errors for lines without valid data descriptors", () => {
      const invalidData =
        '"INVALID","GROUP_NAME"\r\n"HEADING","Field1","Field2"\r\n';
      const errors = rulesForRawString.rule3.validate(invalidData);
      expect(errors).toHaveLength(1);
    });
  });

  describe("Rule 4.1: GROUP row should only contain the GROUP name", () => {
    it("should return no errors for valid GROUP rows", () => {
      const validData = '"GROUP","GROUP_NAME"\r\n';
      const errors = rulesForRawString.rule4_1.validate(validData);
      expect(errors).toHaveLength(0);
    });

    it("should return an error for GROUP rows with more than one field", () => {
      const invalidData = '"GROUP","GROUP_NAME","EXTRA_FIELD"\r\n';
      const errors = rulesForRawString.rule4_1.validate(invalidData);
      expect(errors).toHaveLength(1);
    });

    it("should return an error for malformed GROUP rows", () => {
      const invalidData = '"GROUP"\r\n';
      const errors = rulesForRawString.rule4_1.validate(invalidData);
      expect(errors).toHaveLength(1);
    });
  });

  describe("Rule 4.2: UNIT, TYPE, and DATA rows should have entries defined by the HEADING row", () => {
    it("should return no errors for UNIT, TYPE, DATA rows that match HEADING", () => {
      const validData =
        '"GROUP","GROUP_NAME"\r\n"HEADING","Field1","Field2"\r\n"UNIT","Unit1","Unit2"\r\n';
      const errors = rulesForRawString.rule4_2.validate(validData);
      expect(errors).toHaveLength(0);
    });

    it("should return an error if HEADING row is missing for UNIT/TYPE/DATA rows", () => {
      const invalidData = '"GROUP","GROUP_NAME"\r\n"UNIT","Unit1","Unit2"\r\n';
      const errors = rulesForRawString.rule4_2.validate(invalidData);
      expect(errors).toHaveLength(1);
    });

    it("should return an error if UNIT/TYPE/DATA rows do not match the HEADING row length", () => {
      const invalidData =
        '"GROUP","GROUP_NAME"\r\n"HEADING","Field1","Field2"\r\n"UNIT","Unit1"\r\n';
      const errors = rulesForRawString.rule4_2.validate(invalidData);
      expect(errors).toHaveLength(1);
    });
  });

  describe("Rule 5: Fields must be enclosed in double quotes and handle internal quotes correctly", () => {
    it("should return no errors for properly quoted fields", () => {
      const validData =
        '"GROUP","GROUP_NAME"\r\n"DATA","Field1","he said ""hello"""\r\n';
      const errors = rulesForRawString.rule5.validate(validData);
      expect(errors).toHaveLength(0);
    });
    it("should return no errors for properly quoted fields", () => {
      const validData =
        '"DATA","831024","36A Halsey Street, London","Kensington, London","Drake Investments Limited","Ground Engineering Limited","Unknown","",""';
      const errors = rulesForRawString.rule5.validate(validData);
      expect(errors).toHaveLength(0);
    });

    it("should return an error if fields are not properly enclosed in double quotes", () => {
      const invalidData = 'GROUP,"GROUP_NAME"\r\n"DATA","Field1","Field2"\r\n'; // Missing quotes around GROUP
      const errors = rulesForRawString.rule5.validate(invalidData);
      expect(errors).toHaveLength(1);
      //   expect(errors[0].message).toContain(
      //     "Fields are not properly enclosed in double quotes",
      //   );
    });

    it("should return an error if quotes within fields are not handled correctly", () => {
      const invalidData =
        '"GROUP","GROUP_NAME"\r\n"DATA","Field1","He said "He"llo"\r\n'; // Improper quote handling
      const errors = rulesForRawString.rule5.validate(invalidData);
      expect(errors).toHaveLength(1);
    });
  });
});
