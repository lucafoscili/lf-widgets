import { decorator } from "../src/utils/shapes";

describe("decorator function", () => {
  it("adds lfValue when value exists but lfValue does not", () => {
    const cell = { value: "test value", shape: "text" as const };
    const result = decorator(null, "text", cell, 0);

    expect(result.lfValue).toBe("test value");
    expect(result.value).toBeUndefined();
  });

  it("preserves lfValue when already present", () => {
    const cell = {
      value: "test",
      lfValue: "existing lfValue",
      shape: "text" as const,
    };
    const result = decorator(null, "text", cell, 0);

    expect(result.lfValue).toBe("existing lfValue");
    expect(result.value).toBeUndefined();
  });

  it("handles htmlProps with dataset", () => {
    const cell = {
      value: "test",
      shape: "text" as const,
      htmlProps: {
        dataset: { test: "value", another: "prop" },
      },
    };
    const result = decorator(null, "text", cell, 0) as any;

    expect(result["data-test"]).toBe("value");
    expect(result["data-another"]).toBe("prop");
  });

  it("sets correct data attributes", () => {
    const cell = { value: "test", shape: "badge" as const };
    const result = decorator("LfBadge", "badge", cell, 5) as any;

    expect(result["data-component"]).toBe("LfBadge");
    expect(result["data-cy"]).toBe("shape");
    expect(result["data-index"]).toBe(5);
    expect(result.id).toBe("badge5");
    expect(result.key).toBe("badge5");
  });

  it("uses custom id from htmlProps", () => {
    const cell = {
      value: "test",
      shape: "text" as const,
      htmlProps: { id: "custom-id" },
    };
    const result = decorator(null, "text", cell, 0);

    expect(result.id).toBe("custom-id");
  });

  it("cleans htmlProps, shape, and value from result", () => {
    const cell = {
      value: "test",
      shape: "text" as const,
      htmlProps: { class: "test-class" },
    };
    const result = decorator(null, "text", cell, 0);

    expect(result.htmlProps).toBeUndefined();
    expect(result.shape).toBeUndefined();
    expect(result.value).toBeUndefined();
  });

  it("spreads all other cell properties", () => {
    const cell = {
      value: "test",
      shape: "text" as const,
      customProp: "custom value",
      anotherProp: 42,
    };
    const result = decorator(null, "text", cell, 0);

    expect(result.customProp).toBe("custom value");
    expect(result.anotherProp).toBe(42);
  });

  it("handles null component for primitive shapes", () => {
    const cell = { value: "test", shape: "text" as const };
    const result = decorator(null, "text", cell, 0);

    expect(result["data-component"]).toBe("text");
    expect(result.lfValue).toBe("test");
  });
});
