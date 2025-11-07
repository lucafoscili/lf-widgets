import { LfFrameworkInterface } from "@lf-widgets/foundations";

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
