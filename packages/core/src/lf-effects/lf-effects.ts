import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_EFFECTS_VARS,
  LfComponentRootElement,
  LfCoreInterface,
  LfEffectsIntensities,
  LfEffectsInterface,
  LfEffectsTimeouts,
} from "@lf-widgets/foundations";

export class LfEffects implements LfEffectsInterface {
  #BACKDROP: HTMLDivElement | null = null;
  #COMPONENTS: Set<HTMLElement> = new Set();
  #EFFECTS: HTMLDivElement;
  #INTENSITY: LfEffectsIntensities = {
    tilt: 10,
  };
  #LIGHTBOX: HTMLElement | null = null;
  #MANAGER: LfCoreInterface;
  #TIMEOUT: LfEffectsTimeouts = {
    lightbox: 300,
    ripple: 500,
  };

  constructor(lfCore: LfCoreInterface) {
    this.#MANAGER = lfCore;
  }

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
  #getParentStyle = (
    element: HTMLElement,
  ): Pick<
    CSSStyleDeclaration,
    "backgroundColor" | "borderRadius" | "color"
  > => {
    const { parentElement } = element;
    const { backgroundColor, borderRadius, color } =
      getComputedStyle(parentElement);
    return {
      backgroundColor,
      borderRadius,
      color,
    };
  };

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
      backdrop.setAttribute("data-lf", LF_ATTRIBUTES.backdrop);
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

      clone.setAttribute("data-lf", LF_ATTRIBUTES.lightboxContent);
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
      portal.setAttribute("data-lf", LF_ATTRIBUTES.lightbox);
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
    if (!element) {
      return;
    }

    const ripple = document.createElement("span");

    const { left, height: h, top, width: w } = element.getBoundingClientRect();
    const { backgroundColor, borderRadius, color } =
      this.#getParentStyle(element);

    const rippleX = e.clientX - left - w / 2;
    const rippleY = e.clientY - top - h / 2;

    if (autoSurfaceRadius) {
      element.style.borderRadius = borderRadius;
    }

    const { background, height, width, x, y } = LF_EFFECTS_VARS.ripple;

    ripple.dataset.lf = LF_ATTRIBUTES.ripple;
    ripple.style.setProperty(background, color || backgroundColor);
    ripple.style.setProperty(height, `${h}px`);
    ripple.style.setProperty(width, `${w}px`);
    ripple.style.setProperty(x, `${rippleX}px`);
    ripple.style.setProperty(y, `${rippleY}px`);

    element.appendChild(ripple);

    setTimeout(
      () =>
        requestAnimationFrame(async () => {
          ripple.remove();
        }),
      this.#TIMEOUT.ripple,
    );
  };
  //#endregion

  isRegistered = (element: HTMLElement) => this.#COMPONENTS.has(element);

  register = {
    tilt: (element: HTMLElement, intensity = 10) => {
      const { tilt } = LF_EFFECTS_VARS;

      element.addEventListener("pointermove", (e) => {
        const { clientX, clientY } = e;
        const { height, left, top, width } = element.getBoundingClientRect();

        const x = ((clientX - left) / width) * 100;
        const y = ((clientY - top) / height) * 100;

        element.style.setProperty(
          tilt.x,
          `${((clientX - left) / width - 0.5) * intensity}deg`,
        );
        element.style.setProperty(
          tilt.y,
          `${-((clientY - top) / height - 0.5) * intensity}deg`,
        );
        element.style.setProperty(tilt.lightX, `${x}%`);
        element.style.setProperty(tilt.lightY, `${y}%`);
      });

      element.addEventListener("pointerleave", () => {
        element.style.setProperty(tilt.x, "0deg");
        element.style.setProperty(tilt.y, "0deg");
        element.style.setProperty(tilt.lightX, "50%");
        element.style.setProperty(tilt.lightY, "50%");
      });

      element.dataset.lf = LF_ATTRIBUTES.tilt;
      this.#COMPONENTS.add(element);
    },
  };

  unregister = {
    tilt: (element: HTMLElement) => {
      element.removeEventListener("pointermove", () => {});
      element.removeEventListener("pointerleave", () => {});

      this.#COMPONENTS.delete(element);
    },
  };
}
