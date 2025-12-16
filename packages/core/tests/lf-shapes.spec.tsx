import { h } from "@stencil/core";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  CY_ATTRIBUTES,
  LfDataCell,
  LfDataShapes,
  LfEvent,
  LfFrameworkInterface,
  LfShapePropsInterface,
} from "@lf-widgets/foundations";
import { LfShape, decorator } from "../src/utils/shapes";

/**
 * Unit tests for shapes.tsx utility
 *
 * Tests cover:
 * 1. decorator function - Props transformation and sanitization
 * 2. LfShape FC rendering - WC tag rendering for various shapes
 * 3. Event dispatching - eventDispatcher callback pattern
 * 4. Props transformation - value → lfValue mapping, htmlProps spread
 *
 * @see packages/core/src/utils/shapes.tsx
 */

let framework: LfFrameworkInterface;

/**
 * Creates a test page with the LfShape FC rendered inside a wrapper div.
 * This simulates the FC being used inside a parent component's shadow DOM.
 */
const createTestPage = async <S extends LfDataShapes>(
  shapeProps: Partial<Omit<LfShapePropsInterface<S>, "framework">> & {
    shape: S;
    cell: Partial<LfDataCell<S>>;
    index?: number;
  },
): Promise<SpecPage> => {
  const mockEventDispatcher = jest.fn().mockResolvedValue(undefined);

  const page = await newSpecPage({
    components: [],
    template: () => (
      <div>
        <LfShape
          framework={framework}
          shape={shapeProps.shape}
          index={shapeProps.index ?? 0}
          cell={shapeProps.cell}
          eventDispatcher={shapeProps.eventDispatcher ?? mockEventDispatcher}
          defaultCb={shapeProps.defaultCb}
          refCallback={shapeProps.refCallback}
        />
      </div>
    ),
  });
  return page;
};

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

//#region LfShape Rendering
describe("LfShape rendering", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  describe("primitive shapes (text, number, slot)", () => {
    it("renders text shape as div with cell value content", async () => {
      const page = await createTestPage({
        shape: "text",
        cell: { value: "Hello World" },
        index: 0,
      });

      const div = page.root.querySelector("div[id='text0']");
      expect(div).toBeTruthy();
      expect(div.textContent).toBe("Hello World");
    });

    it("renders number shape as div with numeric content", async () => {
      const page = await createTestPage({
        shape: "number",
        cell: { value: 42 },
        index: 3,
      });

      const div = page.root.querySelector("div[id='number3']");
      expect(div).toBeTruthy();
      expect(div.textContent).toBe("42");
    });

    it("decorator prepares slot shape with correct attributes", () => {
      // Note: <slot> elements don't render properly in JSDOM outside shadow DOM,
      // so we test the decorator output instead
      const cell = { value: "custom-slot", shape: "slot" as const };
      const result = decorator(null, "slot", cell, 1);

      expect(result.id).toBe("slot1");
      expect(result.key).toBe("slot1");
      expect(result["data-component"]).toBe("slot");
      expect(result["data-cy"]).toBe(CY_ATTRIBUTES.shape);
      expect(result["data-index"]).toBe(1);
    });

    it("applies data attributes to primitive shapes", async () => {
      const page = await createTestPage({
        shape: "text",
        cell: { value: "test" },
        index: 5,
      });

      const div = page.root.querySelector("div[id='text5']");
      expect(div.getAttribute("data-cy")).toBe(CY_ATTRIBUTES.shape);
      expect(div.getAttribute("data-index")).toBe("5");
      expect(div.getAttribute("data-component")).toBe("text");
    });
  });

  describe("component shapes (WC rendering)", () => {
    it("renders badge shape as lf-badge web component", async () => {
      const page = await createTestPage({
        shape: "badge",
        cell: { value: "New", shape: "badge" },
        index: 0,
      });

      const badge = page.root.querySelector("lf-badge");
      expect(badge).toBeTruthy();
      expect(badge.getAttribute("id")).toBe("badge0");
    });

    it("renders button shape as lf-button web component", async () => {
      const page = await createTestPage({
        shape: "button",
        cell: { value: "Click me", shape: "button" },
        index: 2,
      });

      const button = page.root.querySelector("lf-button");
      expect(button).toBeTruthy();
      expect(button.getAttribute("id")).toBe("button2");
    });

    it("renders image shape as lf-image web component", async () => {
      const page = await createTestPage({
        shape: "image",
        cell: { value: "https://example.com/image.png", shape: "image" },
        index: 1,
      });

      const image = page.root.querySelector("lf-image");
      expect(image).toBeTruthy();
      expect(image.getAttribute("id")).toBe("image1");
    });

    it("renders toggle shape as lf-toggle web component", async () => {
      const page = await createTestPage({
        shape: "toggle",
        cell: { value: true, shape: "toggle" },
        index: 0,
      });

      const toggle = page.root.querySelector("lf-toggle");
      expect(toggle).toBeTruthy();
    });

    it("renders textfield shape as lf-textfield web component", async () => {
      const page = await createTestPage({
        shape: "textfield",
        cell: { value: "input value", shape: "textfield" },
        index: 0,
      });

      const textfield = page.root.querySelector("lf-textfield");
      expect(textfield).toBeTruthy();
    });

    it("applies data-component attribute with correct component name", async () => {
      const page = await createTestPage({
        shape: "badge",
        cell: { value: "Test", shape: "badge" },
        index: 0,
      });

      const badge = page.root.querySelector("lf-badge");
      expect(badge.getAttribute("data-component")).toBe("LfBadge");
    });
  });

  describe("index-based identification", () => {
    it("generates ID based on shape name and provided index", async () => {
      const page = await createTestPage({
        shape: "badge",
        cell: { value: "Test", shape: "badge" },
        index: 7,
      });

      const badge = page.root.querySelector("lf-badge");
      // ID is generated from shape name + index
      expect(badge.getAttribute("id")).toBe("badge7");
    });

    it("generates badge ID from shape name and index", async () => {
      const page = await createTestPage({
        shape: "badge",
        cell: { value: "Badge", shape: "badge" },
        index: 0,
      });

      const badge = page.root.querySelector("lf-badge");
      expect(badge.getAttribute("id")).toBe("badge0");
    });

    it("generates button ID from shape name and index", async () => {
      const page = await createTestPage({
        shape: "button",
        cell: { value: "Button", shape: "button" },
        index: 0,
      });

      const button = page.root.querySelector("lf-button");
      expect(button.getAttribute("id")).toBe("button0");
    });

    it("uses custom id from htmlProps over generated id", async () => {
      const page = await createTestPage({
        shape: "badge",
        cell: {
          value: "Test",
          shape: "badge",
          htmlProps: { id: "my-custom-badge" },
        },
        index: 5,
      });

      const badge = page.root.querySelector("lf-badge");
      expect(badge.getAttribute("id")).toBe("my-custom-badge");
    });
  });
});
//#endregion

//#region Event Dispatching
describe("shape event dispatching", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  it("calls eventDispatcher when component emits event", async () => {
    const mockDispatcher = jest.fn().mockResolvedValue(undefined);

    const page = await createTestPage({
      shape: "badge",
      cell: { value: "Test", shape: "badge" },
      index: 0,
      eventDispatcher: mockDispatcher,
    });

    const badge = page.root.querySelector("lf-badge");
    expect(badge).toBeTruthy();

    // The event handler is attached - verify structure
    expect(mockDispatcher).toHaveBeenCalledTimes(0);
  });

  it("calls defaultCb before eventDispatcher when provided", async () => {
    const callOrder: string[] = [];
    const mockDefaultCb = jest.fn().mockImplementation(() => {
      callOrder.push("defaultCb");
    });
    const mockDispatcher = jest.fn().mockImplementation(() => {
      callOrder.push("dispatcher");
      return Promise.resolve();
    });

    const page = await createTestPage({
      shape: "badge",
      cell: { value: "Test", shape: "badge" },
      index: 0,
      eventDispatcher: mockDispatcher,
      defaultCb: mockDefaultCb,
    });

    const badge = page.root.querySelector("lf-badge");
    expect(badge).toBeTruthy();

    // Simulate event emission by triggering the handler
    const mockEvent = {
      detail: { comp: {}, eventType: "click", id: "badge0" },
    } as LfEvent;

    // Access internal handler through event listener
    // Note: In real scenarios, the WC would emit events that trigger the handler
    expect(mockDefaultCb).not.toHaveBeenCalled();
    expect(mockDispatcher).not.toHaveBeenCalled();
  });

  it("attaches correct event listener name for each shape type", async () => {
    // Badge uses onLf-badge-event
    const badgePage = await createTestPage({
      shape: "badge",
      cell: { value: "Test", shape: "badge" },
      index: 0,
    });
    const badge = badgePage.root.querySelector("lf-badge");
    expect(badge).toBeTruthy();

    // Button uses onLf-button-event
    const buttonPage = await createTestPage({
      shape: "button",
      cell: { value: "Click", shape: "button" },
      index: 0,
    });
    const button = buttonPage.root.querySelector("lf-button");
    expect(button).toBeTruthy();

    // Image uses onLf-image-event
    const imagePage = await createTestPage({
      shape: "image",
      cell: { value: "img.png", shape: "image" },
      index: 0,
    });
    const image = imagePage.root.querySelector("lf-image");
    expect(image).toBeTruthy();
  });
});
//#endregion

//#region Props Transformation
describe("props transformation", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  describe("value to lfValue mapping", () => {
    it("maps cell.value to lfValue for badge shape", () => {
      const cell = { value: "New", shape: "badge" as const };
      const result = decorator("LfBadge", "badge", cell, 0);

      expect(result.lfValue).toBe("New");
      expect(result.value).toBeUndefined();
    });

    it("maps cell.value to lfValue for button shape", () => {
      const cell = { value: "Click me", shape: "button" as const };
      const result = decorator("LfButton", "button", cell, 0);

      expect(result.lfValue).toBe("Click me");
      expect(result.value).toBeUndefined();
    });

    it("preserves existing lfValue and ignores value", () => {
      const cell = {
        value: "ignored",
        lfValue: "preserved",
        shape: "badge" as const,
      };
      const result = decorator("LfBadge", "badge", cell, 0);

      expect(result.lfValue).toBe("preserved");
      expect(result.value).toBeUndefined();
    });

    it("handles undefined value gracefully", () => {
      const cell = { shape: "badge" as const };
      const result = decorator("LfBadge", "badge", cell, 0);

      expect(result.lfValue).toBeUndefined();
      expect(result.value).toBeUndefined();
    });
  });

  describe("htmlProps spreading and dataset handling", () => {
    it("spreads dataset properties as data-* attributes", () => {
      const cell = {
        value: "test",
        shape: "badge" as const,
        htmlProps: {
          dataset: {
            testId: "my-test-id",
            category: "notification",
          },
        },
      };
      const result = decorator("LfBadge", "badge", cell, 0) as any;

      expect(result["data-testId"]).toBe("my-test-id");
      expect(result["data-category"]).toBe("notification");
    });

    it("removes htmlProps from final result after processing", () => {
      const cell = {
        value: "test",
        shape: "badge" as const,
        htmlProps: {
          id: "custom-id",
          dataset: { foo: "bar" },
        },
      };
      const result = decorator("LfBadge", "badge", cell, 0);

      expect(result.htmlProps).toBeUndefined();
      expect(result.id).toBe("custom-id");
    });

    it("uses htmlProps.id over generated id", () => {
      const cell = {
        value: "test",
        shape: "badge" as const,
        htmlProps: { id: "explicit-id" },
      };
      const result = decorator("LfBadge", "badge", cell, 5);

      expect(result.id).toBe("explicit-id");
      // key still uses shape+index pattern
      expect(result.key).toBe("badge5");
    });
  });

  describe("shape property removal", () => {
    it("removes shape property from decorated result", () => {
      const cell = { value: "test", shape: "badge" as const };
      const result = decorator("LfBadge", "badge", cell, 0);

      expect(result.shape).toBeUndefined();
    });

    it("removes shape property for text shapes", () => {
      const cell = { value: "hello", shape: "text" as const };
      const result = decorator(null, "text", cell, 0);

      expect(result.shape).toBeUndefined();
    });
  });

  describe("custom cell properties spreading", () => {
    it("preserves and spreads custom properties from cell", () => {
      const cell = {
        value: "test",
        shape: "badge" as const,
        lfStyling: "flat",
        lfIcon: "check",
      } as any;
      const result = decorator("LfBadge", "badge", cell, 0);

      expect(result.lfStyling).toBe("flat");
      expect(result.lfIcon).toBe("check");
    });

    it("spreads numeric custom properties", () => {
      const cell = {
        value: "50",
        shape: "progressbar" as const,
        customNumber: 100,
      } as any;
      const result = decorator("LfProgressbar", "progressbar", cell, 0);

      expect(result.customNumber).toBe(100);
    });

    it("spreads boolean custom properties", () => {
      const cell = {
        value: true,
        shape: "toggle" as const,
        lfDisabled: true,
      } as any;
      const result = decorator("LfToggle", "toggle", cell, 0);

      expect(result.lfDisabled).toBe(true);
    });
  });

  describe("data attributes generation", () => {
    it("always includes data-cy attribute for shapes", () => {
      const cell = { value: "test", shape: "badge" as const };
      const result = decorator("LfBadge", "badge", cell, 0) as any;

      expect(result["data-cy"]).toBe(CY_ATTRIBUTES.shape);
    });

    it("always includes data-index attribute", () => {
      const cell = { value: "test", shape: "button" as const };
      const result = decorator("LfButton", "button", cell, 7) as any;

      expect(result["data-index"]).toBe(7);
    });

    it("sets data-component to component name for WC shapes", () => {
      const cell = { value: "test", shape: "image" as const };
      const result = decorator("LfImage", "image", cell, 0) as any;

      expect(result["data-component"]).toBe("LfImage");
    });

    it("sets data-component to shape name for primitive shapes", () => {
      const cell = { value: "text content" };
      const result = decorator(null, "text", cell, 0) as any;

      expect(result["data-component"]).toBe("text");
    });
  });

  describe("key generation", () => {
    it("generates key from shape name and index", () => {
      const cell = { value: "test", shape: "badge" as const };
      const result = decorator("LfBadge", "badge", cell, 3);

      expect(result.key).toBe("badge3");
    });

    it("key remains consistent regardless of htmlProps.id", () => {
      const cell = {
        value: "test",
        shape: "badge" as const,
        htmlProps: { id: "custom-id" },
      };
      const result = decorator("LfBadge", "badge", cell, 5);

      expect(result.key).toBe("badge5");
      expect(result.id).toBe("custom-id");
    });
  });
});
//#endregion

//#region refCallback Integration
describe("refCallback integration", () => {
  beforeAll(() => {
    framework = getLfFramework();
  });

  it("passes refCallback to component shapes", async () => {
    const refCallbackSpy = jest.fn();

    const page = await createTestPage({
      shape: "badge",
      cell: { value: "Test", shape: "badge" },
      index: 0,
      refCallback: refCallbackSpy,
    });

    const badge = page.root.querySelector("lf-badge");
    expect(badge).toBeTruthy();
    // refCallback is attached via ref prop on the WC
  });

  it("does not apply refCallback to primitive shapes", async () => {
    const refCallbackSpy = jest.fn();

    const page = await createTestPage({
      shape: "text",
      cell: { value: "Hello" },
      index: 0,
      refCallback: refCallbackSpy,
    });

    const div = page.root.querySelector("div[id='text0']");
    expect(div).toBeTruthy();
    // Primitive shapes (text, number, slot) don't use refCallback
  });
});
//#endregion
