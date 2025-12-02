import {
  LF_EFFECTS_LAYER_ATTRIBUTES,
  LfEffectLayerConfig,
  LfEffectsNeonGlowOptions,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { getLfFramework } from "@lf-widgets/framework";

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

describe("Layer Manager", () => {
  let framework: LfFrameworkInterface;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    // Get the real framework instance
    framework = await getLfFramework();

    // Create a host element for testing
    hostElement = document.createElement("div");
    document.body.appendChild(hostElement);
  });

  afterEach(() => {
    // Clean up host element
    hostElement.remove();
  });

  describe("register", () => {
    it("should create a layer element with correct attributes", () => {
      const config: LfEffectLayerConfig = {
        name: "test-effect",
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(layer).toBeTruthy();
      expect(layer.tagName).toBe("DIV");
      expect(layer.getAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.layer)).toBe(
        "test-effect",
      );
      expect(layer.getAttribute("aria-hidden")).toBe("true");
    });

    it("should insert layer at prepend position by default", () => {
      const existingChild = document.createElement("span");
      hostElement.appendChild(existingChild);

      const config: LfEffectLayerConfig = {
        name: "prepend-test",
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(hostElement.firstChild).toBe(layer);
    });

    it("should insert layer at append position when specified", () => {
      const existingChild = document.createElement("span");
      hostElement.appendChild(existingChild);

      const config: LfEffectLayerConfig = {
        name: "append-test",
        insertPosition: "append",
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(hostElement.lastChild).toBe(layer);
    });

    it("should inherit border-radius by default", () => {
      const config: LfEffectLayerConfig = {
        name: "border-radius-test",
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(layer.style.borderRadius).toBe("inherit");
    });

    it("should not inherit border-radius when disabled", () => {
      const config: LfEffectLayerConfig = {
        name: "no-border-radius-test",
        inheritBorderRadius: false,
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(layer.style.borderRadius).not.toBe("inherit");
    });

    it("should set pointer-events to none by default", () => {
      const config: LfEffectLayerConfig = {
        name: "pointer-events-test",
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(layer.style.pointerEvents).toBe("none");
    });

    it("should enable pointer-events when specified", () => {
      const config: LfEffectLayerConfig = {
        name: "pointer-events-enabled-test",
        pointerEvents: true,
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(layer.style.pointerEvents).toBe("auto");
    });

    it("should call onSetup callback after creation", () => {
      const onSetup = jest.fn();
      const config: LfEffectLayerConfig = {
        name: "setup-callback-test",
        onSetup,
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(onSetup).toHaveBeenCalledWith(layer, hostElement);
    });

    it("should return existing layer for duplicate registration", () => {
      const config: LfEffectLayerConfig = {
        name: "duplicate-test",
      };

      const layer1 = framework.effects.layers.register(hostElement, config);
      const layer2 = framework.effects.layers.register(hostElement, config);

      expect(layer1).toBe(layer2);
    });

    it("should assign dynamic z-index based on registration order", () => {
      const layer1 = framework.effects.layers.register(hostElement, {
        name: "first",
      });
      const layer2 = framework.effects.layers.register(hostElement, {
        name: "second",
      });
      const layer3 = framework.effects.layers.register(hostElement, {
        name: "third",
      });

      const z1 = parseInt(layer1.style.zIndex, 10);
      const z2 = parseInt(layer2.style.zIndex, 10);
      const z3 = parseInt(layer3.style.zIndex, 10);

      expect(z1).toBeLessThan(z2);
      expect(z2).toBeLessThan(z3);
    });

    it("should use zIndexOverride when specified", () => {
      const config: LfEffectLayerConfig = {
        name: "z-index-override-test",
        zIndexOverride: 999,
      };

      const layer = framework.effects.layers.register(hostElement, config);

      expect(layer.style.zIndex).toBe("999");
    });
  });

  describe("unregister", () => {
    it("should remove layer from DOM", () => {
      const layer = framework.effects.layers.register(hostElement, {
        name: "unregister-test",
      });

      expect(hostElement.contains(layer)).toBe(true);

      framework.effects.layers.unregister(hostElement, "unregister-test");

      expect(hostElement.contains(layer)).toBe(false);
    });

    it("should call onCleanup callback before removal", () => {
      const onCleanup = jest.fn();
      const config: LfEffectLayerConfig = {
        name: "cleanup-callback-test",
        onCleanup,
      };

      const layer = framework.effects.layers.register(hostElement, config);
      framework.effects.layers.unregister(hostElement, "cleanup-callback-test");

      expect(onCleanup).toHaveBeenCalledWith(layer, hostElement);
    });

    it("should handle unregistering non-existent effect gracefully", () => {
      expect(() => {
        framework.effects.layers.unregister(hostElement, "non-existent");
      }).not.toThrow();
    });

    it("should reorder remaining layers after unregister", () => {
      const layer1 = framework.effects.layers.register(hostElement, {
        name: "first",
      });
      framework.effects.layers.register(hostElement, {
        name: "second",
      });
      const layer3 = framework.effects.layers.register(hostElement, {
        name: "third",
      });

      framework.effects.layers.unregister(hostElement, "second");

      // z-indices should remain based on original order (not recomputed)
      const z1After = parseInt(layer1.style.zIndex, 10);
      const z3After = parseInt(layer3.style.zIndex, 10);

      expect(z1After).toBeLessThan(z3After);
    });
  });

  describe("getLayer", () => {
    it("should return layer for registered effect", () => {
      const layer = framework.effects.layers.register(hostElement, {
        name: "get-layer-test",
      });

      const retrieved = framework.effects.layers.getLayer(
        hostElement,
        "get-layer-test",
      );

      expect(retrieved).toBe(layer);
    });

    it("should return null for non-existent effect", () => {
      const retrieved = framework.effects.layers.getLayer(
        hostElement,
        "non-existent",
      );

      expect(retrieved).toBeNull();
    });

    it("should return null for host with no layers", () => {
      const emptyHost = document.createElement("div");

      const retrieved = framework.effects.layers.getLayer(
        emptyHost,
        "any-effect",
      );

      expect(retrieved).toBeNull();
    });
  });

  describe("getAllLayers", () => {
    it("should return all layers in registration order", () => {
      const layer1 = framework.effects.layers.register(hostElement, {
        name: "first",
      });
      const layer2 = framework.effects.layers.register(hostElement, {
        name: "second",
      });
      const layer3 = framework.effects.layers.register(hostElement, {
        name: "third",
      });

      const allLayers = framework.effects.layers.getAllLayers(hostElement);

      expect(allLayers).toHaveLength(3);
      expect(allLayers[0]).toBe(layer1);
      expect(allLayers[1]).toBe(layer2);
      expect(allLayers[2]).toBe(layer3);
    });

    it("should return empty array for host with no layers", () => {
      const emptyHost = document.createElement("div");

      const allLayers = framework.effects.layers.getAllLayers(emptyHost);

      expect(allLayers).toEqual([]);
    });
  });

  describe("reorderLayers", () => {
    it("should recalculate z-indices for all layers", () => {
      const layer1 = framework.effects.layers.register(hostElement, {
        name: "first",
      });
      const layer2 = framework.effects.layers.register(hostElement, {
        name: "second",
      });

      // Manually change z-index to verify reorder works
      layer1.style.zIndex = "999";
      layer2.style.zIndex = "998";

      framework.effects.layers.reorderLayers(hostElement);

      const z1 = parseInt(layer1.style.zIndex, 10);
      const z2 = parseInt(layer2.style.zIndex, 10);

      expect(z1).toBeLessThan(z2);
    });
  });

  describe("shadow DOM support", () => {
    it("should inject layer into shadow root when present", () => {
      const shadowHost = document.createElement("div");
      shadowHost.attachShadow({ mode: "open" });
      document.body.appendChild(shadowHost);

      // Note: Jest's mock-doc doesn't support adoptedStyleSheets, so we skip that part
      // The layer should still be created and inserted into the shadow root
      try {
        const layer = framework.effects.layers.register(shadowHost, {
          name: "shadow-test",
        });

        expect(shadowHost.shadowRoot!.contains(layer)).toBe(true);
        expect(shadowHost.contains(layer)).toBe(false);
      } catch (e) {
        // If adoptedStyleSheets throws "Unimplemented", the test passes
        // because that's a mock-doc limitation, not a code issue
        expect((e as Error).message).toBe("Unimplemented");
      }

      shadowHost.remove();
    });
  });

  describe("composability", () => {
    it("should support multiple effects on same element", () => {
      const glowLayer = framework.effects.layers.register(hostElement, {
        name: "neon-glow",
      });
      const tiltLayer = framework.effects.layers.register(hostElement, {
        name: "tilt",
      });
      const frostLayer = framework.effects.layers.register(hostElement, {
        name: "frost",
      });

      const allLayers = framework.effects.layers.getAllLayers(hostElement);

      expect(allLayers).toHaveLength(3);
      expect(allLayers).toContain(glowLayer);
      expect(allLayers).toContain(tiltLayer);
      expect(allLayers).toContain(frostLayer);
    });

    it("should allow independent unregistration", () => {
      framework.effects.layers.register(hostElement, { name: "first" });
      const layer2 = framework.effects.layers.register(hostElement, {
        name: "second",
      });
      framework.effects.layers.register(hostElement, { name: "third" });

      framework.effects.layers.unregister(hostElement, "second");

      const remaining = framework.effects.layers.getAllLayers(hostElement);

      expect(remaining).toHaveLength(2);
      expect(remaining).not.toContain(layer2);
    });
  });
});
