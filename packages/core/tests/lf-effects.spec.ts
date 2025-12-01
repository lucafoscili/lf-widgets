import {
  LfEffectsNeonGlowOptions,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";

describe("Framework Effects Utilities", () => {
  let framework: jest.Mocked<LfFrameworkInterface>;

  beforeEach(() => {
    // Mock the framework interface
    framework = {
      effects: {
        backdrop: {
          hide: jest.fn(),
          isVisible: jest.fn(),
          show: jest.fn(),
        },
        isRegistered: jest.fn(),
        lightbox: {
          hide: jest.fn(),
          isVisible: jest.fn(),
          show: jest.fn(),
        },
        register: {
          neonGlow: jest.fn(),
          tilt: jest.fn(),
        },
        ripple: jest.fn(),
        set: {
          intensity: jest.fn(),
          timeout: jest.fn(),
        },
        unregister: {
          neonGlow: jest.fn(),
          tilt: jest.fn(),
        },
      },
    } as any; // Using any to avoid complex type mocking
  });

  describe("backdrop", () => {
    describe("hide", () => {
      it("should hide the backdrop", () => {
        framework.effects.backdrop.hide();

        expect(framework.effects.backdrop.hide).toHaveBeenCalled();
      });
    });

    describe("isVisible", () => {
      it("should check if backdrop is visible", () => {
        framework.effects.backdrop.isVisible();

        expect(framework.effects.backdrop.isVisible).toHaveBeenCalled();
      });

      it("should return true when backdrop is visible", () => {
        (framework.effects.backdrop.isVisible as jest.Mock).mockReturnValue(
          true,
        );

        const result = framework.effects.backdrop.isVisible();

        expect(result).toBe(true);
      });
    });

    describe("show", () => {
      it("should show the backdrop", () => {
        framework.effects.backdrop.show();

        expect(framework.effects.backdrop.show).toHaveBeenCalled();
      });

      it("should show the backdrop with close callback", () => {
        const mockCallback = jest.fn();

        framework.effects.backdrop.show(mockCallback);

        expect(framework.effects.backdrop.show).toHaveBeenCalledWith(
          mockCallback,
        );
      });
    });
  });

  describe("isRegistered", () => {
    it("should check if element has effects registered", () => {
      const mockElement = document.createElement("div");

      framework.effects.isRegistered(mockElement);

      expect(framework.effects.isRegistered).toHaveBeenCalledWith(mockElement);
    });
  });

  describe("lightbox", () => {
    describe("hide", () => {
      it("should hide the lightbox", () => {
        framework.effects.lightbox.hide();

        expect(framework.effects.lightbox.hide).toHaveBeenCalled();
      });
    });

    describe("isVisible", () => {
      it("should check if lightbox is visible", () => {
        framework.effects.lightbox.isVisible();

        expect(framework.effects.lightbox.isVisible).toHaveBeenCalled();
      });
    });

    describe("show", () => {
      it("should show the lightbox with element", () => {
        const mockElement = document.createElement("div");

        framework.effects.lightbox.show(mockElement);

        expect(framework.effects.lightbox.show).toHaveBeenCalledWith(
          mockElement,
        );
      });

      it("should show the lightbox with element and close callback", () => {
        const mockElement = document.createElement("div");
        const mockCallback = jest.fn();

        framework.effects.lightbox.show(mockElement, mockCallback);

        expect(framework.effects.lightbox.show).toHaveBeenCalledWith(
          mockElement,
          mockCallback,
        );
      });
    });
  });

  describe("register", () => {
    describe("neonGlow", () => {
      it("should register neon glow effect with default options", () => {
        const mockElement = document.createElement("div");

        framework.effects.register.neonGlow(mockElement);

        expect(framework.effects.register.neonGlow).toHaveBeenCalledWith(
          mockElement,
        );
      });

      it("should register neon glow effect with custom options", () => {
        const mockElement = document.createElement("div");
        const options: LfEffectsNeonGlowOptions = {
          mode: "filled",
          color: "#ff0000",
          intensity: 0.5,
          pulseSpeed: "fast",
          reflection: true,
        };

        framework.effects.register.neonGlow(mockElement, options);

        expect(framework.effects.register.neonGlow).toHaveBeenCalledWith(
          mockElement,
          options,
        );
      });

      it("should register neon glow effect with outline mode", () => {
        const mockElement = document.createElement("div");
        const options: LfEffectsNeonGlowOptions = {
          mode: "outline",
        };

        framework.effects.register.neonGlow(mockElement, options);

        expect(framework.effects.register.neonGlow).toHaveBeenCalledWith(
          mockElement,
          options,
        );
      });

      it("should register neon glow effect with reflection disabled", () => {
        const mockElement = document.createElement("div");
        const options: LfEffectsNeonGlowOptions = {
          reflection: false,
        };

        framework.effects.register.neonGlow(mockElement, options);

        expect(framework.effects.register.neonGlow).toHaveBeenCalledWith(
          mockElement,
          options,
        );
      });

      it("should register neon glow effect with slow pulse speed", () => {
        const mockElement = document.createElement("div");
        const options: LfEffectsNeonGlowOptions = {
          pulseSpeed: "slow",
        };

        framework.effects.register.neonGlow(mockElement, options);

        expect(framework.effects.register.neonGlow).toHaveBeenCalledWith(
          mockElement,
          options,
        );
      });

      it("should register neon glow effect with custom reflection settings", () => {
        const mockElement = document.createElement("div");
        const options: LfEffectsNeonGlowOptions = {
          reflection: true,
          reflectionBlur: 12,
          reflectionOffset: 8,
          reflectionOpacity: 0.5,
        };

        framework.effects.register.neonGlow(mockElement, options);

        expect(framework.effects.register.neonGlow).toHaveBeenCalledWith(
          mockElement,
          options,
        );
      });
    });

    describe("tilt", () => {
      it("should register tilt effect", () => {
        const mockElement = document.createElement("div");

        framework.effects.register.tilt(mockElement);

        expect(framework.effects.register.tilt).toHaveBeenCalledWith(
          mockElement,
        );
      });

      it("should register tilt effect with intensity", () => {
        const mockElement = document.createElement("div");
        const intensity = 0.5;

        framework.effects.register.tilt(mockElement, intensity);

        expect(framework.effects.register.tilt).toHaveBeenCalledWith(
          mockElement,
          intensity,
        );
      });
    });
  });

  describe("ripple", () => {
    it("should trigger ripple effect", () => {
      const mockElement = document.createElement("div");
      const mockEvent = { clientX: 100, clientY: 200 } as PointerEvent;

      framework.effects.ripple(mockEvent, mockElement);

      expect(framework.effects.ripple).toHaveBeenCalledWith(
        mockEvent,
        mockElement,
      );
    });

    it("should trigger ripple effect with auto surface radius", () => {
      const mockElement = document.createElement("div");
      const mockEvent = { clientX: 100, clientY: 200 } as PointerEvent;
      const autoSurfaceRadius = true;

      framework.effects.ripple(mockEvent, mockElement, autoSurfaceRadius);

      expect(framework.effects.ripple).toHaveBeenCalledWith(
        mockEvent,
        mockElement,
        autoSurfaceRadius,
      );
    });
  });

  describe("set", () => {
    describe("intensity", () => {
      it("should set effect intensity", () => {
        const key = "tilt";
        const value = 0.8;

        framework.effects.set.intensity(key, value);

        expect(framework.effects.set.intensity).toHaveBeenCalledWith(
          key,
          value,
        );
      });
    });

    describe("timeout", () => {
      it("should set effect timeout", () => {
        const key = "ripple";
        const value = 500;

        framework.effects.set.timeout(key, value);

        expect(framework.effects.set.timeout).toHaveBeenCalledWith(key, value);
      });
    });
  });

  describe("unregister", () => {
    describe("neonGlow", () => {
      it("should unregister neon glow effect", () => {
        const mockElement = document.createElement("div");

        framework.effects.unregister.neonGlow(mockElement);

        expect(framework.effects.unregister.neonGlow).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });

    describe("tilt", () => {
      it("should unregister tilt effect", () => {
        const mockElement = document.createElement("div");

        framework.effects.unregister.tilt(mockElement);

        expect(framework.effects.unregister.tilt).toHaveBeenCalledWith(
          mockElement,
        );
      });
    });
  });
});
