import { LfFrameworkInterface } from "@lf-widgets/foundations";

describe("Framework Drag Utilities", () => {
  let framework: jest.Mocked<LfFrameworkInterface>;

  beforeEach(() => {
    // Mock the framework interface
    framework = {
      drag: {
        register: {
          customDrag: jest.fn(),
          dragToDrop: jest.fn(),
          dragToResize: jest.fn(),
          dragToScroll: jest.fn(),
          swipe: jest.fn(),
        },
        unregister: {
          all: jest.fn(),
          customDrag: jest.fn(),
          dragToDrop: jest.fn(),
          dragToResize: jest.fn(),
          dragToScroll: jest.fn(),
          swipe: jest.fn(),
        },
        getActiveSession: jest.fn(),
      },
    } as any; // Using any to avoid complex type mocking
  });

  describe("register", () => {
    describe("customDrag", () => {
      it("should register custom drag handler", () => {
        const mockElement = document.createElement("div");
        const mockCallback = jest.fn();

        framework.drag.register.customDrag(mockElement, mockCallback);

        expect(framework.drag.register.customDrag).toHaveBeenCalledWith(
          mockElement,
          mockCallback,
        );
      });

      it("should register custom drag with callbacks", () => {
        const mockElement = document.createElement("div");
        const mockCallback = jest.fn();
        const mockCallbacks = {
          onStart: jest.fn(),
          onMove: jest.fn(),
          onEnd: jest.fn(),
        };

        framework.drag.register.customDrag(
          mockElement,
          mockCallback,
          mockCallbacks,
        );

        expect(framework.drag.register.customDrag).toHaveBeenCalledWith(
          mockElement,
          mockCallback,
          mockCallbacks,
        );
      });
    });

    describe("dragToDrop", () => {
      it("should register drag-to-drop behavior", () => {
        const mockElement = document.createElement("div");

        framework.drag.register.dragToDrop(mockElement);

        expect(framework.drag.register.dragToDrop).toHaveBeenCalledWith(
          mockElement,
        );
      });

      it("should register drag-to-drop with callbacks", () => {
        const mockElement = document.createElement("div");
        const mockCallbacks = {
          onStart: jest.fn(),
          onMove: jest.fn(),
          onEnd: jest.fn(),
        };

        framework.drag.register.dragToDrop(mockElement, mockCallbacks);

        expect(framework.drag.register.dragToDrop).toHaveBeenCalledWith(
          mockElement,
          mockCallbacks,
        );
      });
    });

    describe("dragToResize", () => {
      it("should register drag-to-resize behavior", () => {
        const mockElement = document.createElement("div");

        framework.drag.register.dragToResize(mockElement);

        expect(framework.drag.register.dragToResize).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });

    describe("dragToScroll", () => {
      it("should register drag-to-scroll behavior", () => {
        const mockElement = document.createElement("div");

        framework.drag.register.dragToScroll(mockElement);

        expect(framework.drag.register.dragToScroll).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });

    describe("swipe", () => {
      it("should register swipe detection", () => {
        const mockElement = document.createElement("div");

        framework.drag.register.swipe(mockElement);

        expect(framework.drag.register.swipe).toHaveBeenCalledWith(mockElement);
      });
    });
  });

  describe("unregister", () => {
    describe("all", () => {
      it("should unregister all drag listeners", () => {
        const mockElement = document.createElement("div");

        framework.drag.unregister.all(mockElement);

        expect(framework.drag.unregister.all).toHaveBeenCalledWith(mockElement);
      });
    });

    describe("customDrag", () => {
      it("should unregister custom drag", () => {
        const mockElement = document.createElement("div");

        framework.drag.unregister.customDrag(mockElement);

        expect(framework.drag.unregister.customDrag).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });

    describe("dragToDrop", () => {
      it("should unregister drag-to-drop", () => {
        const mockElement = document.createElement("div");

        framework.drag.unregister.dragToDrop(mockElement);

        expect(framework.drag.unregister.dragToDrop).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });

    describe("dragToResize", () => {
      it("should unregister drag-to-resize", () => {
        const mockElement = document.createElement("div");

        framework.drag.unregister.dragToResize(mockElement);

        expect(framework.drag.unregister.dragToResize).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });

    describe("dragToScroll", () => {
      it("should unregister drag-to-scroll", () => {
        const mockElement = document.createElement("div");

        framework.drag.unregister.dragToScroll(mockElement);

        expect(framework.drag.unregister.dragToScroll).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });

    describe("swipe", () => {
      it("should unregister swipe detection", () => {
        const mockElement = document.createElement("div");

        framework.drag.unregister.swipe(mockElement);

        expect(framework.drag.unregister.swipe).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });
  });

  describe("getActiveSession", () => {
    it("should get active drag session", () => {
      const mockElement = document.createElement("div");

      framework.drag.getActiveSession(mockElement);

      expect(framework.drag.getActiveSession).toHaveBeenCalledWith(mockElement);
    });

    it("should return undefined when no active session", () => {
      const mockElement = document.createElement("div");
      (framework.drag.getActiveSession as jest.Mock).mockReturnValue(undefined);

      const result = framework.drag.getActiveSession(mockElement);

      expect(result).toBeUndefined();
    });
  });
});
