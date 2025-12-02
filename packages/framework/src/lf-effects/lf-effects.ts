import {
  CY_ATTRIBUTES,
  LF_UTILITY_ATTRIBUTES,
  LfComponentRootElement,
  LfEffectsIntensities,
  LfEffectsInterface,
  LfEffectsNeonGlowOptions,
  LfEffectsRippleOptions,
  LfEffectsTimeouts,
  LfEffectName,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { layerManager } from "./helpers.layers";
import { neonGlowEffect } from "./helpers.neon-glow";
import { rippleEffect } from "./helpers.ripple";
import { tiltEffect } from "./helpers.tilt";

export class LfEffects implements LfEffectsInterface {
  #BACKDROP: HTMLDivElement | null = null;
  /**
   * Tracks which effects are registered on each element.
   * Key: HTMLElement, Value: Set of effect names registered on that element.
   */
  #COMPONENTS: Map<HTMLElement, Set<LfEffectName>> = new Map();
  #EFFECTS: HTMLDivElement;
  #INTENSITY: LfEffectsIntensities = {
    "neon-glow": 0.7,
    tilt: 15,
  };
  #LIGHTBOX: HTMLElement | null = null;
  #MANAGER: LfFrameworkInterface;
  #TIMEOUT: LfEffectsTimeouts = {
    lightbox: 300,
    "neon-glow": 2000,
    ripple: 500,
  };

  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
  }

  //#region Private helpers
  #appendToWrapper = (element: HTMLElement) => {
    if (typeof document === "undefined") {
      return;
    }

    if (!this.#EFFECTS) {
      this.#EFFECTS = document.createElement("div");
      this.#EFFECTS.classList.add("lf-effects");
      this.#EFFECTS.dataset.cy = CY_ATTRIBUTES.effects;
      document.body.appendChild(this.#EFFECTS);
    }

    this.#EFFECTS.appendChild(element);
  };
  //#endregion

  //#region layers
  /**
   * Layer manager for creating and managing isolated effect layers.
   * Use this for effects that need their own DOM element to avoid pseudo-element conflicts.
   */
  layers = layerManager;
  //#endregion

  //#region set
  set = {
    intensity: (key: keyof LfEffectsIntensities, value: number) =>
      (this.#INTENSITY[key] = value),
    timeout: (key: keyof LfEffectsTimeouts, value: number) =>
      (this.#TIMEOUT[key] = value),
  };
  //#endregion

  //#region backdrop
  backdrop = {
    hide: () => {
      if (!this.#BACKDROP) {
        return;
      }

      const backdrop = this.#BACKDROP;
      backdrop.style.opacity = "0";
      backdrop.addEventListener("transitionend", () => {
        backdrop.remove();
        this.#BACKDROP = null;
      });
    },
    isVisible: () => !!this.#BACKDROP,
    show: (onClose?: () => void) => {
      const { logs } = this.#MANAGER.debug;
      if (this.#BACKDROP) {
        logs.new(this, "A modal is already open.", "warning");
        return;
      }

      const backdrop = document.createElement("div");
      backdrop.setAttribute("data-lf", LF_UTILITY_ATTRIBUTES.backdrop);
      backdrop.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      backdrop.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClose) {
          onClose();
        }
      });
      backdrop.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        { passive: false },
      );

      this.#appendToWrapper(backdrop);

      requestAnimationFrame(() => {
        backdrop.style.opacity = "1";
      });

      this.#BACKDROP = backdrop;
    },
  };
  //#endregion

  //#region lightbox
  lightbox = {
    show: async (element: HTMLElement, closeCb?: (...args: any[]) => void) => {
      const { debug } = this.#MANAGER;

      if (this.#LIGHTBOX) {
        debug.logs.new(this, "Lightbox is already open.", "warning");
        return;
      }

      const clone = element.cloneNode(true) as HTMLElement;
      if (element.tagName.startsWith("LF-") && "getProps" in element) {
        const props = await (element as LfComponentRootElement).getProps();
        Object.assign(clone, props);
      }

      clone.setAttribute("data-lf", LF_UTILITY_ATTRIBUTES.lightboxContent);
      clone.setAttribute("role", "dialog");
      clone.setAttribute("aria-modal", "true");
      clone.setAttribute("tabindex", "-1");

      const escKeyHandler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          this.lightbox.hide();
        }
      };
      clone.addEventListener("keydown", escKeyHandler);

      const originalHide = this.lightbox.hide;
      this.lightbox.hide = () => {
        if (closeCb) {
          closeCb();
        }
        originalHide.call(this.lightbox);
        document.removeEventListener("keydown", escKeyHandler);
        this.lightbox.hide = originalHide;
      };

      const portal = document.createElement("div");
      portal.setAttribute("data-lf", LF_UTILITY_ATTRIBUTES.lightbox);
      portal.appendChild(clone);
      this.#appendToWrapper(portal);

      this.#LIGHTBOX = portal;

      this.backdrop.show(() => this.lightbox.hide());
      requestAnimationFrame(async () => {
        clone.focus();
      });
    },
    hide: () => {
      if (!this.#LIGHTBOX) {
        return;
      }

      this.#LIGHTBOX.remove();
      this.#LIGHTBOX = null;

      this.backdrop.hide();
    },
    isVisible: () => !!this.#LIGHTBOX,
  };
  //#endregion

  //#region ripple
  ripple = (
    e: PointerEvent,
    element: HTMLElement,
    autoSurfaceRadius = true,
  ) => {
    rippleEffect.trigger(e, element, this.#TIMEOUT.ripple, autoSurfaceRadius);
  };
  //#endregion

  //#region Registration
  /**
   * Checks if an element has effects registered.
   * @param element - The element to check
   * @param effectName - Optional: check for a specific effect. If omitted, checks for any effect.
   * @returns true if the element has the specified effect (or any effect if not specified)
   */
  isRegistered = (element: HTMLElement, effectName?: LfEffectName): boolean => {
    const effects = this.#COMPONENTS.get(element);
    if (!effects) return false;
    if (effectName) return effects.has(effectName);
    return effects.size > 0;
  };

  /**
   * Adds an effect to the element's registered effects set.
   */
  #addEffect = (element: HTMLElement, effectName: LfEffectName): void => {
    let effects = this.#COMPONENTS.get(element);
    if (!effects) {
      effects = new Set();
      this.#COMPONENTS.set(element, effects);
    }
    effects.add(effectName);
  };

  /**
   * Removes an effect from the element's registered effects set.
   * Cleans up the map entry if no effects remain.
   */
  #removeEffect = (element: HTMLElement, effectName: LfEffectName): void => {
    const effects = this.#COMPONENTS.get(element);
    if (!effects) return;

    effects.delete(effectName);
    if (effects.size === 0) {
      this.#COMPONENTS.delete(element);
    }
  };

  register = {
    neonGlow: (
      element: HTMLElement,
      options: LfEffectsNeonGlowOptions = {},
    ) => {
      if (this.isRegistered(element, "neon-glow")) {
        this.#MANAGER.debug.logs.new(
          this,
          "Element already has neon-glow registered.",
          "warning",
        );
        return;
      }

      neonGlowEffect.register(element, options, this.#INTENSITY["neon-glow"]);
      this.#addEffect(element, "neon-glow");
    },

    ripple: (element: HTMLElement, options: LfEffectsRippleOptions = {}) => {
      if (this.isRegistered(element, "ripple")) {
        this.#MANAGER.debug.logs.new(
          this,
          "Element already has ripple registered.",
          "warning",
        );
        return;
      }

      rippleEffect.register(element, {
        duration: options.duration ?? this.#TIMEOUT.ripple,
        ...options,
      });
      this.#addEffect(element, "ripple");
    },

    tilt: (element: HTMLElement, intensity?: number) => {
      if (this.isRegistered(element, "tilt")) {
        this.#MANAGER.debug.logs.new(
          this,
          "Element already has tilt registered.",
          "warning",
        );
        return;
      }

      // Ensure tilt has access to the layer manager for highlight layer
      tiltEffect.setLayerManager(layerManager);
      tiltEffect.register(element, intensity ?? this.#INTENSITY.tilt);
      this.#addEffect(element, "tilt");
    },
  };

  unregister = {
    neonGlow: (element: HTMLElement) => {
      if (!this.isRegistered(element, "neon-glow")) {
        return;
      }

      neonGlowEffect.unregister(element);
      this.#removeEffect(element, "neon-glow");
    },

    ripple: (element: HTMLElement) => {
      if (!this.isRegistered(element, "ripple")) {
        return;
      }

      rippleEffect.unregister(element);
      this.#removeEffect(element, "ripple");
    },

    tilt: (element: HTMLElement) => {
      if (!this.isRegistered(element, "tilt")) {
        return;
      }

      tiltEffect.unregister(element);
      this.#removeEffect(element, "tilt");
    },
  };
  //#endregion
}
