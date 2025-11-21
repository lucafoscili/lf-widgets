import { LfFrameworkInterface } from "@lf-widgets/foundations";
import { LfPortal } from "../../framework/src/lf-portal/lf-portal";

describe("Framework Portal Utilities", () => {
  let framework: jest.Mocked<LfFrameworkInterface>;

  beforeEach(() => {
    // Mock the framework interface
    framework = {
      portal: {
        close: jest.fn(),
        getState: jest.fn(),
        isInPortal: jest.fn(),
        open: jest.fn(),
      },
    } as any; // Using any to avoid complex type mocking
  });

  describe("close", () => {
    it("should close portal for element", () => {
      const mockElement = document.createElement("div");

      framework.portal.close(mockElement);

      expect(framework.portal.close).toHaveBeenCalledWith(mockElement);
    });
  });

  describe("getState", () => {
    it("should get portal state for element", () => {
      const mockElement = document.createElement("div");
      const mockState = {
        anchor: { x: 100, y: 200 },
        dismissCb: jest.fn(),
        margin: 10,
        parent: document.createElement("div"),
        placement: "auto" as any,
      };

      (framework.portal.getState as jest.Mock).mockReturnValue(mockState);

      const result = framework.portal.getState(mockElement);

      expect(result).toBe(mockState);
      expect(framework.portal.getState).toHaveBeenCalledWith(mockElement);
    });

    it("should return undefined when element not in portal", () => {
      const mockElement = document.createElement("div");

      (framework.portal.getState as jest.Mock).mockReturnValue(undefined);

      const result = framework.portal.getState(mockElement);

      expect(result).toBeUndefined();
      expect(framework.portal.getState).toHaveBeenCalledWith(mockElement);
    });
  });

  describe("isInPortal", () => {
    it("should check if element is in portal", () => {
      const mockElement = document.createElement("div");

      framework.portal.isInPortal(mockElement);

      expect(framework.portal.isInPortal).toHaveBeenCalledWith(mockElement);
    });

    it("should return true when element is in portal", () => {
      const mockElement = document.createElement("div");

      (framework.portal.isInPortal as jest.Mock).mockReturnValue(true);

      const result = framework.portal.isInPortal(mockElement);

      expect(result).toBe(true);
    });

    it("should return false when element is not in portal", () => {
      const mockElement = document.createElement("div");

      (framework.portal.isInPortal as jest.Mock).mockReturnValue(false);

      const result = framework.portal.isInPortal(mockElement);

      expect(result).toBe(false);
    });
  });

  describe("open", () => {
    it("should open portal with minimal parameters", () => {
      const mockElement = document.createElement("div");
      const mockParent = document.createElement("div");

      framework.portal.open(mockElement, mockParent);

      expect(framework.portal.open).toHaveBeenCalledWith(
        mockElement,
        mockParent,
      );
    });

    it("should open portal with anchor element", () => {
      const mockElement = document.createElement("div");
      const mockParent = document.createElement("div");
      const mockAnchor = document.createElement("button");

      framework.portal.open(mockElement, mockParent, mockAnchor);

      expect(framework.portal.open).toHaveBeenCalledWith(
        mockElement,
        mockParent,
        mockAnchor,
      );
    });

    it("should open portal with coordinate anchor", () => {
      const mockElement = document.createElement("div");
      const mockParent = document.createElement("div");
      const mockAnchor = { x: 100, y: 200 };

      framework.portal.open(mockElement, mockParent, mockAnchor);

      expect(framework.portal.open).toHaveBeenCalledWith(
        mockElement,
        mockParent,
        mockAnchor,
      );
    });

    it("should open portal with all parameters", () => {
      const mockElement = document.createElement("div");
      const mockParent = document.createElement("div");
      const mockAnchor = { x: 100, y: 200 };
      const margin = 10;
      const placement = "top-left" as any;

      framework.portal.open(
        mockElement,
        mockParent,
        mockAnchor,
        margin,
        placement,
      );

      expect(framework.portal.open).toHaveBeenCalledWith(
        mockElement,
        mockParent,
        mockAnchor,
        margin,
        placement,
      );
    });
  });
});

describe("LfPortal positioning logic", () => {
  let manager: LfFrameworkInterface;
  let portal: LfPortal;
  let requestAnimationFrameMock: jest.Mock<number, [FrameRequestCallback]>;
  let originalRequestAnimationFrame: typeof requestAnimationFrame;
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    manager = {
      addClickCallback: jest.fn(),
      debug: { logs: { new: jest.fn() } },
      removeClickCallback: jest.fn(),
    } as unknown as LfFrameworkInterface;

    portal = new LfPortal(manager);

    rafCallbacks = [];
    requestAnimationFrameMock = jest.fn<number, [FrameRequestCallback]>(
      (callback: FrameRequestCallback) => {
        rafCallbacks.push(callback);
        return rafCallbacks.length;
      },
    );

    originalRequestAnimationFrame = global.requestAnimationFrame;
    (
      global as typeof globalThis & {
        requestAnimationFrame: typeof requestAnimationFrame;
      }
    ).requestAnimationFrame = requestAnimationFrameMock;
    window.requestAnimationFrame = requestAnimationFrameMock;
  });

  afterEach(() => {
    (
      global as typeof globalThis & {
        requestAnimationFrame: typeof requestAnimationFrame;
      }
    ).requestAnimationFrame = originalRequestAnimationFrame;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    document.body.innerHTML = "";
  });

  it("anchors to the anchor's left edge when auto placement has room on the right", () => {
    (window as any).innerWidth = 1000;

    const parent = document.createElement("div");
    document.body.appendChild(parent);

    const anchor = document.createElement("div");
    Object.defineProperty(anchor, "tagName", {
      configurable: true,
      value: "DIV",
    });
    expect(anchor.tagName).toBe("DIV");
    parent.appendChild(anchor);

    jest.spyOn(anchor, "getBoundingClientRect").mockReturnValue({
      bottom: 120,
      height: 20,
      left: 100,
      right: 130,
      top: 100,
      width: 30,
      x: 100,
      y: 100,
      toJSON: () => {},
    } as DOMRect);

    const element = document.createElement("div");
    Object.defineProperty(element, "offsetHeight", {
      configurable: true,
      value: 80,
    });
    Object.defineProperty(element, "offsetWidth", {
      configurable: true,
      value: 120,
    });

    portal.open(element, parent, anchor);
    expect(requestAnimationFrameMock).toHaveBeenCalled();
    rafCallbacks.shift()?.(0);

    expect(element.style.left).toBe("100px");
    expect(element.style.right).toBe("");
  });
});
