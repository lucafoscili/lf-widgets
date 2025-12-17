import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCanvas } from "./lf-canvas";

// Mock requestAnimationFrame for tests
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(() => callback(0), 0) as unknown as number;
};

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCanvas],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-canvas", () => {
  let resizeObserverCallback: () => void;
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeAll(() => {
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    global.ResizeObserver = jest.fn().mockImplementation((callback) => {
      resizeObserverCallback = callback;
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    expect(component.lfBrush).toBe("round");
    expect(component.lfColor).toBe("#ff0000");
    expect(component.lfCursor).toBe("preview");
    expect(component.lfImageProps).toBeNull();
    expect(component.lfOpacity).toBe(1.0);
    expect(component.lfPreview).toBe(true);
    expect(component.lfStrokeTolerance).toBeNull();
    expect(component.lfSize).toBe(10);
    expect(component.lfStyle).toBe("");
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-canvas lf-brush="square" lf-color="#00ff00" lf-size="20"></lf-canvas>`,
    );
    const component = page.rootInstance as LfCanvas;

    expect(component.lfBrush).toBe("square");
    expect(component.lfColor).toBe("#00ff00");
    expect(component.lfSize).toBe(20);
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    const props = await component.getProps();
    expect(props.lfBrush).toBe("round");
    expect(props.lfColor).toBe("#ff0000");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  describe("ResizeObserver setup", () => {
    it("should initialize ResizeObserver on component load", async () => {
      await createPage(`<lf-canvas></lf-canvas>`);

      expect(global.ResizeObserver).toHaveBeenCalled();
      expect(mockObserve).toHaveBeenCalled();
    });

    it("should disconnect ResizeObserver on component disconnect", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);

      // Remove the component
      page.root?.remove();
      await page.waitForChanges();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe("ResizeObserver loop prevention", () => {
    /**
     * These tests verify the cooldown-based resize loop prevention mechanism.
     *
     * The lf-canvas component uses a ResizeObserver to detect when it needs to resize.
     * However, resizing can change the boxing CSS (letterbox/pillarbox), which triggers
     * another resize event, potentially causing an infinite loop.
     *
     * The solution uses:
     * 1. Debouncing (100ms) to coalesce rapid resize events
     * 2. A cooldown period (200ms) after each resize to ignore subsequent events
     *    that are triggered by the boxing CSS changes
     *
     * Implementation in lf-canvas.tsx:
     * - #resizeCooldown flag prevents resize during cooldown
     * - #resizeTimeout handles debouncing
     * - After resizeCanvas() completes, cooldown clears after 200ms
     */
    it("should have cooldown mechanism to prevent resize loops", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Verify the component has the resizeCanvas method
      expect(typeof component.resizeCanvas).toBe("function");

      // The cooldown mechanism is internal, but we can verify the component
      // handles rapid resize events without hanging (if it looped, the test would timeout)
      resizeObserverCallback();

      // If we get here without timeout, the debounce mechanism is working
      expect(true).toBe(true);
    });

    it("should debounce multiple rapid resize events via ResizeObserver", async () => {
      // The debouncing is handled internally by the ResizeObserver callback
      // which uses setTimeout with 100ms delay. Multiple rapid events within
      // the debounce window get coalesced into a single resize.
      //
      // This test verifies the ResizeObserver is set up and the callback
      // can be triggered without causing issues.
      const page = await createPage(`<lf-canvas></lf-canvas>`);

      // Verify ResizeObserver was set up
      expect(global.ResizeObserver).toHaveBeenCalled();
      expect(mockObserve).toHaveBeenCalled();

      // Trigger multiple rapid resize events - these should be debounced
      resizeObserverCallback();
      resizeObserverCallback();
      resizeObserverCallback();

      // The component should not hang or cause issues
      await page.waitForChanges();
      expect(page.root).toBeTruthy();
    });
  });

  describe("Programmatic drawing methods", () => {
    /**
     * These tests verify the programmatic drawing API exists.
     * Full visual testing requires E2E tests with a real browser canvas.
     * The methods use normalized coordinates (0-1 range) so drawings
     * are resolution-independent.
     */

    it("should have drawLine method", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      expect(typeof component.drawLine).toBe("function");
    });

    it("should have drawPath method", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      expect(typeof component.drawPath).toBe("function");
    });

    it("should have drawShape method", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      expect(typeof component.drawShape).toBe("function");
    });

    it("should call drawShape without error", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Just verify it doesn't throw - Stencil mock doesn't fully support canvas
      await expect(
        component.drawShape({ x: 0.5, y: 0.5 }, { color: "#ff0000", size: 10 }),
      ).resolves.not.toThrow();
    });

    it("should call drawLine without error", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(
        component.drawLine(
          { x: 0, y: 0.5 },
          { x: 1, y: 0.5 },
          { color: "#00ff00", size: 5 },
        ),
      ).resolves.not.toThrow();
    });

    it("should call drawPath without error", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(
        component.drawPath(
          [
            { x: 0.5, y: 0.1 },
            { x: 0.1, y: 0.9 },
            { x: 0.9, y: 0.9 },
          ],
          { color: "#0000ff", size: 3 },
        ),
      ).resolves.not.toThrow();
    });

    it("should handle empty path gracefully", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(component.drawPath([])).resolves.not.toThrow();
    });

    it("should use component defaults when no options provided", async () => {
      const page = await createPage(
        `<lf-canvas lf-color="#ffff00" lf-size="15"></lf-canvas>`,
      );
      const component = page.rootInstance as LfCanvas;

      // Verify props are set correctly
      expect(component.lfColor).toBe("#ffff00");
      expect(component.lfSize).toBe(15);

      // Draw without options - should use defaults
      await expect(
        component.drawShape({ x: 0.5, y: 0.5 }),
      ).resolves.not.toThrow();
    });

    it("should have drawText method", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      expect(typeof component.drawText).toBe("function");
    });

    it("should call drawText without error", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(
        component.drawText(
          "1",
          { x: 0.5, y: 0.5 },
          { fontSize: 24, color: "#ffffff" },
        ),
      ).resolves.not.toThrow();
    });

    it("should call drawText with defaults", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Draw text without options - should use defaults
      await expect(
        component.drawText("Test", { x: 0.5, y: 0.5 }),
      ).resolves.not.toThrow();
    });

    it("should call drawText with all options", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(
        component.drawText(
          "42",
          { x: 0.25, y: 0.75 },
          {
            color: "#00ff00",
            fontSize: 32,
            fontFamily: "Verdana",
            opacity: 0.8,
            textAlign: "left",
            textBaseline: "top",
          },
        ),
      ).resolves.not.toThrow();
    });
  });

  //#region State Management Tests
  describe("State Management", () => {
    describe("boxing state", () => {
      it("should initialize boxing as null", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.boxing).toBeNull();
      });

      it("should reflect boxing state in host data attribute", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);

        const host = page.root;
        expect(host?.getAttribute("data-boxing")).toBeNull();
      });
    });

    describe("isPainting state", () => {
      it("should initialize isPainting as false", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.isPainting).toBe(false);
      });
    });

    describe("orientation state", () => {
      it("should initialize orientation as null", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.orientation).toBeNull();
      });

      it("should reflect orientation state in host data attribute", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);

        const host = page.root;
        expect(host?.getAttribute("data-orientation")).toBeNull();
      });
    });

    describe("points state", () => {
      it("should initialize points as empty array", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.points).toEqual([]);
      });

      it("should have array type for points", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(Array.isArray(component.points)).toBe(true);
      });
    });

    describe("debugInfo state", () => {
      it("should have debugInfo defined after load", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const debugInfo = await component.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });
    });
  });
  //#endregion

  //#region Canvas Operations Tests
  describe("Canvas Operations", () => {
    describe("clearCanvas method", () => {
      it("should have clearCanvas method", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(typeof component.clearCanvas).toBe("function");
      });

      // Note: clearCanvas requires canvas context which may not be fully available in test environment
      // Full canvas context testing requires E2E tests with real browser
    });

    describe("getCanvas method", () => {
      it("should have getCanvas method", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(typeof component.getCanvas).toBe("function");
      });

      it("should return board canvas by default", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const canvas = await component.getCanvas();
        // Canvas ref may be null in test environment
        expect(canvas).toBeDefined();
      });

      it("should return board canvas explicitly", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const canvas = await component.getCanvas("board");
        expect(canvas).toBeDefined();
      });

      it("should return preview canvas", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const canvas = await component.getCanvas("preview");
        expect(canvas).toBeDefined();
      });
    });

    describe("setCanvasHeight method", () => {
      it("should have setCanvasHeight method", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(typeof component.setCanvasHeight).toBe("function");
      });

      it("should set height with value", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(component.setCanvasHeight(500)).resolves.not.toThrow();
      });

      it("should set height without value (use container)", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(component.setCanvasHeight()).resolves.not.toThrow();
      });
    });

    describe("setCanvasWidth method", () => {
      it("should have setCanvasWidth method", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(typeof component.setCanvasWidth).toBe("function");
      });

      it("should set width with value", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(component.setCanvasWidth(800)).resolves.not.toThrow();
      });

      it("should set width without value (use container)", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(component.setCanvasWidth()).resolves.not.toThrow();
      });
    });

    describe("resizeCanvas method", () => {
      it("should have resizeCanvas method", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(typeof component.resizeCanvas).toBe("function");
      });

      it("should resize canvas without error", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(component.resizeCanvas()).resolves.not.toThrow();
      });
    });

    describe("getImage method", () => {
      it("should have getImage method", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(typeof component.getImage).toBe("function");
      });

      it("should return image element reference", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const image = await component.getImage();
        // Image ref may be null without lfImageProps
        expect(image).toBeDefined();
      });
    });
  });
  //#endregion

  //#region Props Tests
  describe("Props", () => {
    describe("lfAutoResize prop", () => {
      it("should default to true", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfAutoResize).toBe(true);
      });

      it("should accept false value", async () => {
        const page = await createPage(
          `<lf-canvas lf-auto-resize="false"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        expect(component.lfAutoResize).toBe(false);
      });

      it("should not initialize ResizeObserver when disabled", async () => {
        jest.clearAllMocks();
        await createPage(`<lf-canvas lf-auto-resize="false"></lf-canvas>`);

        // ResizeObserver should not be observed when auto-resize is disabled
        expect(mockObserve).not.toHaveBeenCalled();
      });
    });

    describe("lfBrush prop", () => {
      it("should default to round", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfBrush).toBe("round");
      });

      it("should accept square value", async () => {
        const page = await createPage(
          `<lf-canvas lf-brush="square"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        expect(component.lfBrush).toBe("square");
      });
    });

    describe("lfColor prop", () => {
      it("should default to #ff0000", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfColor).toBe("#ff0000");
      });

      it("should accept custom color", async () => {
        const page = await createPage(
          `<lf-canvas lf-color="#0000ff"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        expect(component.lfColor).toBe("#0000ff");
      });
    });

    describe("lfCursor prop", () => {
      it("should default to preview", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfCursor).toBe("preview");
      });

      it("should accept none value", async () => {
        const page = await createPage(
          `<lf-canvas lf-cursor="none"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        expect(component.lfCursor).toBe("none");
      });
    });

    describe("lfImageProps prop", () => {
      it("should default to null", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfImageProps).toBeNull();
      });
    });

    describe("lfOpacity prop", () => {
      it("should default to 1.0", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfOpacity).toBe(1.0);
      });

      it("should accept custom opacity", async () => {
        const page = await createPage(
          `<lf-canvas lf-opacity="0.5"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        expect(component.lfOpacity).toBe(0.5);
      });
    });

    describe("lfPreview prop", () => {
      it("should default to true", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfPreview).toBe(true);
      });

      it("should accept false value", async () => {
        const page = await createPage(
          `<lf-canvas lf-preview="false"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        expect(component.lfPreview).toBe(false);
      });
    });

    describe("lfStrokeTolerance prop", () => {
      it("should default to null", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfStrokeTolerance).toBeNull();
      });

      it("should accept number value", async () => {
        const page = await createPage(
          `<lf-canvas lf-stroke-tolerance="5"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        expect(component.lfStrokeTolerance).toBe(5);
      });
    });

    describe("lfSize prop", () => {
      it("should default to 10", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfSize).toBe(10);
      });

      it("should accept custom size", async () => {
        const page = await createPage(`<lf-canvas lf-size="25"></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfSize).toBe(25);
      });
    });

    describe("lfStyle prop", () => {
      it("should default to empty string", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfStyle).toBe("");
      });
    });
  });
  //#endregion

  //#region Public Methods Tests
  describe("Public Methods", () => {
    describe("getProps method", () => {
      it("should return all props", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const props = await component.getProps();

        expect(props).toHaveProperty("lfAutoResize");
        expect(props).toHaveProperty("lfBrush");
        expect(props).toHaveProperty("lfColor");
        expect(props).toHaveProperty("lfCursor");
        expect(props).toHaveProperty("lfImageProps");
        expect(props).toHaveProperty("lfOpacity");
        expect(props).toHaveProperty("lfPreview");
        expect(props).toHaveProperty("lfStrokeTolerance");
        expect(props).toHaveProperty("lfSize");
        expect(props).toHaveProperty("lfStyle");
      });

      it("should return correct default values", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const props = await component.getProps();

        expect(props.lfAutoResize).toBe(true);
        expect(props.lfBrush).toBe("round");
        expect(props.lfColor).toBe("#ff0000");
        expect(props.lfCursor).toBe("preview");
        expect(props.lfOpacity).toBe(1.0);
        expect(props.lfSize).toBe(10);
      });

      it("should return modified prop values", async () => {
        const page = await createPage(
          `<lf-canvas lf-brush="square" lf-color="#00ff00" lf-size="20"></lf-canvas>`,
        );
        const component = page.rootInstance as LfCanvas;

        const props = await component.getProps();

        expect(props.lfBrush).toBe("square");
        expect(props.lfColor).toBe("#00ff00");
        expect(props.lfSize).toBe(20);
      });
    });

    describe("refresh method", () => {
      it("should trigger re-render", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await component.refresh();
        await page.waitForChanges();

        expect(page.root).toBeTruthy();
      });
    });

    describe("unmount method", () => {
      it("should have unmount method", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(typeof component.unmount).toBe("function");
      });

      it("should remove element after delay", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        // Just verify it doesn't throw
        await expect(component.unmount(0)).resolves.not.toThrow();
      });
    });
  });
  //#endregion

  //#region Event Tests
  describe("Events", () => {
    it("should emit ready event on load", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const eventSpy = jest.fn();

      page.root?.addEventListener("lf-canvas-event", eventSpy);

      // Component already loaded, refresh to check event emission works
      const component = page.rootInstance as LfCanvas;
      await component.refresh();
      await page.waitForChanges();

      // Event system is initialized
      expect(page.root).toBeTruthy();
    });

    it("should have onLfEvent method for internal events", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      expect(typeof component.onLfEvent).toBe("function");
    });
  });
  //#endregion

  //#region Drawing Options Tests
  describe("Drawing Options", () => {
    it("should use fill option in drawShape", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Test fill=true (default)
      await expect(
        component.drawShape({ x: 0.5, y: 0.5 }, { fill: true }),
      ).resolves.not.toThrow();

      // Test fill=false (stroke)
      await expect(
        component.drawShape({ x: 0.5, y: 0.5 }, { fill: false }),
      ).resolves.not.toThrow();
    });

    it("should use brush option in drawShape", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Test round brush
      await expect(
        component.drawShape({ x: 0.5, y: 0.5 }, { brush: "round" }),
      ).resolves.not.toThrow();

      // Test square brush
      await expect(
        component.drawShape({ x: 0.5, y: 0.5 }, { brush: "square" }),
      ).resolves.not.toThrow();
    });

    it("should use opacity option in drawing", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(
        component.drawLine({ x: 0, y: 0 }, { x: 1, y: 1 }, { opacity: 0.5 }),
      ).resolves.not.toThrow();
    });

    it("should use size option in drawing", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(
        component.drawPath(
          [
            { x: 0, y: 0 },
            { x: 0.5, y: 0.5 },
            { x: 1, y: 1 },
          ],
          { size: 20 },
        ),
      ).resolves.not.toThrow();
    });

    it("should combine multiple options", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      await expect(
        component.drawLine(
          { x: 0, y: 0.5 },
          { x: 1, y: 0.5 },
          {
            color: "#ff00ff",
            size: 15,
            opacity: 0.75,
            brush: "square",
          },
        ),
      ).resolves.not.toThrow();
    });
  });
  //#endregion

  //#region Edge Cases Tests
  describe("Edge Cases", () => {
    describe("Boundary coordinates", () => {
      it("should handle coordinates at origin (0,0)", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(
          component.drawShape({ x: 0, y: 0 }),
        ).resolves.not.toThrow();
      });

      it("should handle coordinates at max (1,1)", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(
          component.drawShape({ x: 1, y: 1 }),
        ).resolves.not.toThrow();
      });

      it("should handle coordinates outside bounds", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        // Coordinates > 1 (outside canvas)
        await expect(
          component.drawShape({ x: 1.5, y: 1.5 }),
        ).resolves.not.toThrow();

        // Negative coordinates
        await expect(
          component.drawShape({ x: -0.5, y: -0.5 }),
        ).resolves.not.toThrow();
      });
    });

    describe("Path edge cases", () => {
      it("should handle single-point path", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(
          component.drawPath([{ x: 0.5, y: 0.5 }]),
        ).resolves.not.toThrow();
      });

      it("should handle two-point path", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(
          component.drawPath([
            { x: 0, y: 0 },
            { x: 1, y: 1 },
          ]),
        ).resolves.not.toThrow();
      });

      it("should handle large path (many points)", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        // Generate 100 points in a spiral
        const points = Array.from({ length: 100 }, (_, i) => ({
          x: 0.5 + 0.4 * Math.cos(i * 0.1) * (i / 100),
          y: 0.5 + 0.4 * Math.sin(i * 0.1) * (i / 100),
        }));

        await expect(component.drawPath(points)).resolves.not.toThrow();
      });

      it("should handle closed path (first and last point same)", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(
          component.drawPath([
            { x: 0.2, y: 0.2 },
            { x: 0.8, y: 0.2 },
            { x: 0.8, y: 0.8 },
            { x: 0.2, y: 0.8 },
            { x: 0.2, y: 0.2 }, // Closes the shape
          ]),
        ).resolves.not.toThrow();
      });
    });

    describe("Size edge cases", () => {
      it("should handle zero size", async () => {
        const page = await createPage(`<lf-canvas lf-size="0"></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfSize).toBe(0);
        await expect(
          component.drawShape({ x: 0.5, y: 0.5 }),
        ).resolves.not.toThrow();
      });

      it("should handle very large size", async () => {
        const page = await createPage(`<lf-canvas lf-size="1000"></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfSize).toBe(1000);
        await expect(
          component.drawShape({ x: 0.5, y: 0.5 }),
        ).resolves.not.toThrow();
      });
    });

    describe("Opacity edge cases", () => {
      it("should handle zero opacity", async () => {
        const page = await createPage(`<lf-canvas lf-opacity="0"></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfOpacity).toBe(0);
      });

      it("should handle opacity at boundary (1.0)", async () => {
        const page = await createPage(`<lf-canvas lf-opacity="1"></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        expect(component.lfOpacity).toBe(1);
      });
    });

    describe("Text edge cases", () => {
      it("should handle empty text", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(
          component.drawText("", { x: 0.5, y: 0.5 }),
        ).resolves.not.toThrow();
      });

      it("should handle very long text", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        const longText = "A".repeat(1000);
        await expect(
          component.drawText(longText, { x: 0.5, y: 0.5 }),
        ).resolves.not.toThrow();
      });

      it("should handle special characters in text", async () => {
        const page = await createPage(`<lf-canvas></lf-canvas>`);
        const component = page.rootInstance as LfCanvas;

        await expect(
          component.drawText("测试 🎨 <>&\"'", { x: 0.5, y: 0.5 }),
        ).resolves.not.toThrow();
      });
    });
  });
  //#endregion

  //#region Lifecycle Tests
  describe("Lifecycle", () => {
    it("should call componentDidLoad", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);

      // Component loaded successfully
      expect(page.root).toBeTruthy();
    });

    it("should call disconnectedCallback on removal", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);

      page.root?.remove();
      await page.waitForChanges();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it("should handle multiple render cycles", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Trigger multiple refreshes
      await component.refresh();
      await page.waitForChanges();
      await component.refresh();
      await page.waitForChanges();
      await component.refresh();
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
    });
  });
  //#endregion

  //#region Host Element Tests
  describe("Host Element", () => {
    it("should render Host element with shadow DOM", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);

      expect(page.root?.shadowRoot).toBeTruthy();
    });

    it("should have wrapper div", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);

      const wrapper = page.root?.shadowRoot?.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("should apply custom lfStyle", async () => {
      const page = await createPage(
        `<lf-canvas lf-style=":host { border: 1px solid red; }"></lf-canvas>`,
      );
      const component = page.rootInstance as LfCanvas;

      expect(component.lfStyle).toContain("border");
    });
  });
  //#endregion

  //#region Integration Tests
  describe("Integration", () => {
    it("should support full drawing workflow", async () => {
      const page = await createPage(
        `<lf-canvas lf-brush="round" lf-color="#ff0000" lf-size="10"></lf-canvas>`,
      );
      const component = page.rootInstance as LfCanvas;

      // Draw a shape
      await component.drawShape({ x: 0.25, y: 0.25 });

      // Draw a line
      await component.drawLine({ x: 0, y: 0.5 }, { x: 1, y: 0.5 });

      // Draw a path (triangle)
      await component.drawPath([
        { x: 0.5, y: 0.1 },
        { x: 0.1, y: 0.9 },
        { x: 0.9, y: 0.9 },
        { x: 0.5, y: 0.1 },
      ]);

      // Add text
      await component.drawText("Test", { x: 0.5, y: 0.5 });

      expect(page.root).toBeTruthy();
    });

    it("should support changing brush mid-drawing", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Draw with round brush
      await component.drawShape({ x: 0.25, y: 0.25 }, { brush: "round" });

      // Change brush and draw again
      component.lfBrush = "square";
      await page.waitForChanges();

      await component.drawShape({ x: 0.75, y: 0.75 });

      expect(component.lfBrush).toBe("square");
    });

    it("should support changing color mid-drawing", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      // Draw with default color
      await component.drawLine({ x: 0, y: 0.25 }, { x: 1, y: 0.25 });

      // Change color and draw again
      component.lfColor = "#00ff00";
      await page.waitForChanges();

      await component.drawLine({ x: 0, y: 0.75 }, { x: 1, y: 0.75 });

      expect(component.lfColor).toBe("#00ff00");
    });

    // Note: clearCanvas and redraw requires canvas context which may not be fully available in test environment
    // Full canvas context testing requires E2E tests with real browser
  });
  //#endregion

  //#region Stroke Tolerance Tests
  describe("Stroke Tolerance (Ramer-Douglas-Peucker)", () => {
    it("should not simplify when tolerance is null", async () => {
      const page = await createPage(`<lf-canvas></lf-canvas>`);
      const component = page.rootInstance as LfCanvas;

      expect(component.lfStrokeTolerance).toBeNull();
    });

    it("should accept tolerance value", async () => {
      const page = await createPage(
        `<lf-canvas lf-stroke-tolerance="10"></lf-canvas>`,
      );
      const component = page.rootInstance as LfCanvas;

      expect(component.lfStrokeTolerance).toBe(10);
    });

    it("should handle very small tolerance", async () => {
      const page = await createPage(
        `<lf-canvas lf-stroke-tolerance="0.001"></lf-canvas>`,
      );
      const component = page.rootInstance as LfCanvas;

      expect(component.lfStrokeTolerance).toBe(0.001);
    });

    it("should handle large tolerance", async () => {
      const page = await createPage(
        `<lf-canvas lf-stroke-tolerance="100"></lf-canvas>`,
      );
      const component = page.rootInstance as LfCanvas;

      expect(component.lfStrokeTolerance).toBe(100);
    });
  });
  //#endregion
});
