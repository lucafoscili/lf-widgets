import { cellExists } from "../../../framework/src/lf-data/helpers.cell";

describe("Data Cell Helpers", () => {
  describe("cellExists", () => {
    it("should return false for null node", () => {
      expect(cellExists(null)).toBe(false);
    });

    it("should return false for undefined node", () => {
      expect(cellExists(undefined)).toBe(false);
    });

    it("should return false for node without cells", () => {
      const node = { id: "test", value: "test" };
      expect(cellExists(node)).toBe(false);
    });

    it("should return false for node with empty cells object", () => {
      const node = { id: "test", value: "test", cells: {} };
      expect(cellExists(node)).toBe(false);
    });

    it("should return true for node with cells", () => {
      const node = {
        id: "test",
        value: "test",
        cells: { column1: { value: "cell value" } },
      };
      expect(cellExists(node)).toBe(true);
    });
  });
});
