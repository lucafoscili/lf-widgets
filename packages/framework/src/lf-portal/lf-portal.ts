import {
  CY_ATTRIBUTES,
  LF_PORTAL_BASE_ZINDEX,
  LF_PORTAL_DEFAULT_OPTIONS,
  LfFrameworkClickCb,
  LfFrameworkInterface,
  LfPortalAnchor,
  LfPortalInterface,
  LfPortalOptions,
  LfPortalPlacements,
  LfPortalState,
} from "@lf-widgets/foundations";

/**
 * Manages elements within a portal to control their position and click-away behavior.
 *
 * @remarks
 * This class provides functionality to:
 * - Append an element to a dedicated portal container.
 * - Position elements using absolute (document-relative) or fixed (viewport-relative) strategies.
 * - Handle click-away actions (can be disabled).
 * - Support fullscreen mode for elements that need to escape transform ancestors.
 * - Auto-increment z-index for nested portals.
 * - Watch anchor elements for size changes.
 * - Handle scroll containers.
 * - Support enter/exit animations.
 *
 * Position strategies:
 * - `absolute` (default for element anchors): Document-relative positioning that scrolls
 *   naturally with the page. Position is calculated once on open.
 * - `fixed` (default for coordinate anchors): Viewport-relative positioning that stays
 *   fixed on screen. Uses RAF loop for continuous updates.
 *
 * @example
 * ```typescript
 * const portal = new LfPortal(lfFramework);
 * const element = document.createElement('div');
 *
 * // Standard dropdown (absolute positioning)
 * portal.open(element, parentEl, anchorEl);
 *
 * // Context menu (fixed positioning)
 * portal.open(element, parentEl, { x: 100, y: 200 });
 *
 * // Fullscreen mode
 * portal.open(element, parentEl, undefined, 0, 'auto', { fullscreen: true });
 *
 * // Modal dialog (no click-away, auto z-index)
 * portal.open(element, parentEl, undefined, 0, 'auto', {
 *   fullscreen: true,
 *   disableClickAway: true,
 *   zIndex: 'auto'
 * });
 *
 * // Animated dropdown
 * portal.open(element, parentEl, anchorEl, 4, 'bl', {
 *   enterClass: 'dropdown-enter',
 *   exitClass: 'dropdown-exit',
 *   exitDuration: 200
 * });
 * ```
 *
 * @public
 */
export class LfPortal implements LfPortalInterface {
  #RAF = {
    frameId: 0 as number,
    queue: new Set<HTMLElement>(),
  };

  #MANAGER: LfFrameworkInterface;
  #PORTAL: HTMLDivElement;
  #STATE = new WeakMap<HTMLElement, LfPortalState>();

  #resizeElements = new Set<HTMLElement>();
  #resizeHandler: (() => void) | null = null;

  /** Current auto-increment z-index counter */
  #currentZIndex = LF_PORTAL_BASE_ZINDEX;

  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
  }

  //#region Private Methods

  #appendToWrapper = (element: HTMLElement) => {
    if (typeof document === "undefined") {
      return;
    }

    if (!this.#PORTAL) {
      this.#PORTAL = document.createElement("div");
      this.#PORTAL.classList.add("lf-portal");
      this.#PORTAL.dataset.cy = CY_ATTRIBUTES.portal;
      document.body.appendChild(this.#PORTAL);
    }

    this.#PORTAL.appendChild(element);
  };

  #clean = (element: HTMLElement, skipAnimation = false) => {
    if (!this.isInPortal(element)) {
      return;
    }

    const state = this.#STATE.get(element);
    if (!state) return;

    const { anchorObserver, dismissCb, options, parent, scrollHandler } = state;

    // Handle exit animation
    if (!skipAnimation && options.exitClass && options.exitDuration) {
      element.classList.add(options.exitClass);
      if (options.enterClass) {
        element.classList.remove(options.enterClass);
      }

      setTimeout(() => {
        this.#cleanupElement(
          element,
          dismissCb,
          anchorObserver,
          scrollHandler,
          options,
          parent,
        );
      }, options.exitDuration);
      return;
    }

    this.#cleanupElement(
      element,
      dismissCb,
      anchorObserver,
      scrollHandler,
      options,
      parent,
    );
  };

  #cleanupElement = (
    element: HTMLElement,
    dismissCb: LfFrameworkClickCb | null,
    anchorObserver: ResizeObserver | undefined,
    scrollHandler: (() => void) | undefined,
    options: LfPortalOptions,
    parent: HTMLElement,
  ) => {
    // Remove click callback if it exists
    if (dismissCb) {
      this.#MANAGER.removeClickCallback(dismissCb);
    }

    // Clean up anchor observer
    if (anchorObserver) {
      anchorObserver.disconnect();
    }

    // Clean up scroll handler
    if (scrollHandler && options.scrollContainer) {
      options.scrollContainer.removeEventListener("scroll", scrollHandler);
    }

    // Remove from resize tracking
    this.#resizeElements.delete(element);
    if (this.#resizeElements.size === 0 && this.#resizeHandler) {
      window.removeEventListener("resize", this.#resizeHandler);
      this.#resizeHandler = null;
    }

    // Remove fullscreen attribute if present
    delete element.dataset.lfFullscreen;

    // Remove animation classes
    if (options.enterClass) {
      element.classList.remove(options.enterClass);
    }
    if (options.exitClass) {
      element.classList.remove(options.exitClass);
    }

    if (parent) {
      parent.appendChild(element);
    }

    this.#STATE.delete(element);
  };

  #debounce = <T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  #setupResizeListener = () => {
    if (this.#resizeHandler) return;

    this.#resizeHandler = this.#debounce(() => {
      this.#resizeElements.forEach((el) => this.recalculate(el));
    }, 100);

    window.addEventListener("resize", this.#resizeHandler);
  };

  #setupAnchorObserver = (
    element: HTMLElement,
    anchor: HTMLElement,
  ): ResizeObserver => {
    const observer = new ResizeObserver(
      this.#debounce(() => {
        this.recalculate(element);
      }, 50),
    );
    observer.observe(anchor);
    return observer;
  };

  #setupScrollHandler = (
    element: HTMLElement,
    container: HTMLElement,
  ): (() => void) => {
    const handler = this.#debounce(() => {
      this.recalculate(element);
    }, 16); // ~60fps throttle

    container.addEventListener("scroll", handler, { passive: true });
    return handler;
  };

  #getNextZIndex = (): number => {
    this.#currentZIndex += 1;
    return this.#currentZIndex;
  };

  #schedulePositionUpdate = (element: HTMLElement) => {
    this.#RAF.queue.add(element);

    if (!this.#RAF.frameId) {
      this.#RAF.frameId = requestAnimationFrame(() => {
        this.#RAF.frameId = 0;

        this.#RAF.queue.forEach((el) => this.#executeRun(el));
        this.#RAF.queue.clear();
      });
    }
  };

  #executeRun = (element: HTMLElement) => {
    if (!this.isInPortal(element) || !element.isConnected) {
      this.#clean(element, true);
      return;
    }

    const state = this.#STATE.get(element);
    if (!state) {
      this.#MANAGER.debug.logs.new(
        this,
        `State for element not found.`,
        "warning",
      );
      return;
    }

    const { options } = state;

    // Handle fullscreen mode
    if (options.fullscreen) {
      this.#applyFullscreen(element, state);
      return;
    }

    // Determine position strategy
    const strategy =
      options.positionStrategy ||
      (this.#isAnchorHTMLElement(state.anchor) ? "absolute" : "fixed");

    if (strategy === "absolute") {
      this.#calculateAbsolutePosition(element, state);
    } else {
      this.#calculateFixedPosition(element, state);
      // Only fixed positioning needs continuous RAF updates
      requestAnimationFrame(() => this.#schedulePositionUpdate(element));
    }

    // Apply custom dimensions after positioning
    this.#applyCustomDimensions(element, options);

    // Apply z-index
    this.#applyZIndex(element, state);
  };

  #applyFullscreen = (element: HTMLElement, state: LfPortalState) => {
    this.#resetStyle(element);

    const { style } = element;
    style.display = "block";
    style.position = "fixed";
    style.top = "0";
    style.left = "0";
    style.width = "100vw";
    style.height = "100vh";
    style.maxWidth = "none";
    style.maxHeight = "none";

    // Apply z-index for fullscreen
    this.#applyZIndex(element, state);

    // Add data attribute for CSS targeting
    element.dataset.lfFullscreen = "true";
  };

  #applyCustomDimensions = (element: HTMLElement, options: LfPortalOptions) => {
    const { style } = element;

    if (options.maxWidth) {
      style.maxWidth = options.maxWidth;
    }
    if (options.maxHeight) {
      style.maxHeight = options.maxHeight;
    }
  };

  #applyZIndex = (element: HTMLElement, state: LfPortalState) => {
    const { options } = state;
    const { style } = element;

    if (state.zIndex !== undefined) {
      style.zIndex = String(state.zIndex);
    } else if (options.zIndex !== undefined && options.zIndex !== "auto") {
      style.zIndex = String(options.zIndex);
    } else if (options.fullscreen) {
      style.zIndex = "var(--lf-ui-zindex-fullscreen, 9999)";
    }
    // Otherwise, CSS default from portal mixin applies
  };

  #calculateAbsolutePosition = (element: HTMLElement, state: LfPortalState) => {
    this.#resetStyle(element);

    const { anchor, margin, placement } = state;
    const { offsetHeight, offsetWidth, style } = element;

    style.display = "block";
    style.position = "absolute";

    if (!this.#isAnchorHTMLElement(anchor)) {
      // For coordinate anchors with absolute strategy, convert to document coords
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const { x, y } = anchor;

      const spaceBelow = window.innerHeight - y;
      const spaceRight = window.innerWidth - x;

      if (spaceBelow < offsetHeight && y > offsetHeight) {
        style.top = `${y + scrollY - offsetHeight - margin}px`;
      } else {
        style.top = `${y + scrollY + margin}px`;
      }

      if (spaceRight < offsetWidth && x > offsetWidth) {
        style.left = `${x + scrollX - offsetWidth - margin}px`;
      } else {
        style.left = `${x + scrollX + margin}px`;
      }

      return;
    }

    // Document scroll offsets
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    // Get viewport-relative rect
    const rect = anchor.getBoundingClientRect();

    // Convert to document-relative coordinates
    const docTop = rect.top + scrollY;
    const docBottom = rect.bottom + scrollY;
    const docLeft = rect.left + scrollX;
    const docRight = rect.right + scrollX;

    // Space calculations (still viewport-relative for placement decisions)
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceOnLeft = rect.left;
    const spaceOnRight = window.innerWidth - rect.right;

    // Determine placement
    const { finalVertical, finalHorizontal } = this.#calculatePlacement(
      placement,
      spaceBelow,
      spaceAbove,
      spaceOnLeft,
      spaceOnRight,
      offsetHeight,
      offsetWidth,
    );

    // Apply vertical position (document-relative)
    switch (finalVertical) {
      case "t":
        style.top = `${docTop - offsetHeight - margin}px`;
        break;
      case "b":
      default:
        style.top = `${docBottom + margin}px`;
        break;
    }

    // Apply horizontal position (document-relative)
    switch (finalHorizontal) {
      case "r":
        style.left = `${docRight - offsetWidth}px`;
        break;
      case "l":
      default:
        style.left = `${docLeft}px`;
        break;
    }
  };

  #calculateFixedPosition = (element: HTMLElement, state: LfPortalState) => {
    this.#resetStyle(element);

    const { anchor, margin, placement } = state;
    const { offsetHeight, offsetWidth, style } = element;

    style.display = "block";
    style.position = "fixed";

    if (!this.#isAnchorHTMLElement(anchor)) {
      const { x, y } = anchor;

      const spaceBelow = window.innerHeight - y;
      const spaceRight = window.innerWidth - x;

      if (spaceBelow < offsetHeight && y > offsetHeight) {
        style.top = `${y - offsetHeight - margin}px`;
      } else {
        style.top = `${y + margin}px`;
      }

      if (spaceRight < offsetWidth && x > offsetWidth) {
        style.left = `${x - offsetWidth - margin}px`;
      } else {
        style.left = `${x + margin}px`;
      }

      return;
    }

    const { top, bottom, left, right } = anchor.getBoundingClientRect();

    const spaceBelow = window.innerHeight - bottom;
    const spaceAbove = top;
    const spaceOnLeft = left;
    const spaceOnRight = window.innerWidth - right;

    const { finalVertical, finalHorizontal } = this.#calculatePlacement(
      placement,
      spaceBelow,
      spaceAbove,
      spaceOnLeft,
      spaceOnRight,
      offsetHeight,
      offsetWidth,
    );

    let scrollbarWidth =
      window.innerWidth - document.documentElement.offsetWidth;
    if (scrollbarWidth > 30) {
      scrollbarWidth = 0;
    }

    switch (finalVertical) {
      case "t":
        style.bottom = `${window.innerHeight - top + margin}px`;
        break;
      case "b":
      default:
        style.top = `${bottom + margin}px`;
        break;
    }

    switch (finalHorizontal) {
      case "l":
        style.left = `${left}px`;
        break;
      case "r":
        style.right = `${window.innerWidth - scrollbarWidth - right}px`;
        break;
      default:
        style.left = `${left}px`;
        break;
    }
  };

  #calculatePlacement = (
    placement: LfPortalPlacements,
    spaceBelow: number,
    spaceAbove: number,
    spaceOnLeft: number,
    spaceOnRight: number,
    offsetHeight: number,
    offsetWidth: number,
  ): { finalVertical: "t" | "b"; finalHorizontal: "l" | "r" } => {
    let verticalPart: "t" | "b" | "auto" = "auto";
    let horizontalPart: "l" | "r" | "auto" = "auto";

    if (placement === "auto") {
      verticalPart = "auto";
      horizontalPart = "auto";
    } else {
      const lower = placement.toLowerCase();

      if (lower.startsWith("t")) {
        verticalPart = "t";
      } else if (lower.startsWith("b")) {
        verticalPart = "b";
      }

      if (lower.endsWith("l")) {
        horizontalPart = "l";
      } else if (lower.endsWith("r")) {
        horizontalPart = "r";
      }
    }

    let finalVertical: "t" | "b" = "b";
    if (verticalPart === "auto") {
      if (spaceBelow >= offsetHeight) {
        finalVertical = "b";
      } else if (spaceAbove >= offsetHeight) {
        finalVertical = "t";
      } else {
        finalVertical = "b";
      }
    } else if (verticalPart === "b") {
      finalVertical =
        spaceBelow < offsetHeight && spaceAbove > offsetHeight ? "t" : "b";
    } else if (verticalPart === "t") {
      finalVertical =
        spaceAbove < offsetHeight && spaceBelow > offsetHeight ? "b" : "t";
    }

    let finalHorizontal: "l" | "r" = "l";
    if (horizontalPart === "auto") {
      if (spaceOnRight >= offsetWidth) {
        finalHorizontal = "l";
      } else if (spaceOnLeft >= offsetWidth) {
        finalHorizontal = "r";
      } else {
        finalHorizontal = "l";
      }
    } else if (horizontalPart === "r") {
      finalHorizontal =
        spaceOnRight < offsetWidth && spaceOnLeft > offsetWidth ? "l" : "r";
    } else if (horizontalPart === "l") {
      finalHorizontal =
        spaceOnLeft < offsetWidth && spaceOnRight > offsetWidth ? "r" : "l";
    }

    return { finalVertical, finalHorizontal };
  };

  #isAnchorHTMLElement = (anchor: LfPortalAnchor): anchor is HTMLElement => {
    return (anchor as HTMLElement).tagName !== undefined;
  };

  #resetStyle = (element: HTMLElement) => {
    const { style } = element;

    style.bottom = "";
    style.display = "";
    style.height = "";
    style.left = "";
    style.maxHeight = "";
    style.maxWidth = "";
    style.position = "";
    style.right = "";
    style.top = "";
    style.width = "";
    style.zIndex = "";
  };

  //#endregion

  //#region Public Methods

  /**
   * Closes the portal element by cleaning and resetting its style.
   */
  close = (element: HTMLElement) => {
    this.#clean(element);
    this.#resetStyle(element);
  };

  /**
   * Retrieves the state associated with the given HTML element.
   */
  getState = (element: HTMLElement) => {
    return this.#STATE.get(element);
  };

  /**
   * Checks if the given HTML element is registered within the portal manager.
   */
  isInPortal = (element: HTMLElement) => {
    return this.#STATE.has(element);
  };

  /**
   * Opens (or reopens) a portal element and positions it.
   * - If the element is already being managed, updates its configuration.
   * - Otherwise, sets up the element with click-away handling and adds it to the portal.
   *
   * @param element - The element to portal
   * @param parent - The original parent to restore on close
   * @param anchor - Position anchor (element or coordinates)
   * @param margin - Margin from anchor
   * @param placement - Preferred placement
   * @param options - Portal options (position strategy, resize handling, fullscreen, etc.)
   */
  open = (
    element: HTMLElement,
    parent: HTMLElement,
    anchor: LfPortalAnchor = parent,
    margin = 0,
    placement: LfPortalPlacements = "auto",
    options: LfPortalOptions = {},
  ) => {
    // Merge with defaults
    const resolvedOptions: LfPortalOptions = {
      ...LF_PORTAL_DEFAULT_OPTIONS,
      ...options,
    };

    let state = this.#STATE.get(element);
    if (state) {
      // Update existing state
      if (anchor) {
        state.anchor = anchor;
      }
      if (margin !== undefined) {
        state.margin = margin;
      }
      if (parent) {
        state.parent = parent;
      }
      if (placement) {
        state.placement = placement;
      }
      state.options = resolvedOptions;
    } else {
      // Create new state
      let dismissCb: LfFrameworkClickCb | null = null;

      // Only setup click-away if not disabled
      if (!resolvedOptions.disableClickAway) {
        dismissCb = {
          cb: () => {
            this.close(element);
          },
          element,
        };
        this.#MANAGER.addClickCallback(dismissCb, true);
      }

      // Determine z-index
      let zIndex: number | undefined;
      if (resolvedOptions.zIndex === "auto") {
        zIndex = this.#getNextZIndex();
      } else if (typeof resolvedOptions.zIndex === "number") {
        zIndex = resolvedOptions.zIndex;
      }

      // Setup anchor observer if requested
      let anchorObserver: ResizeObserver | undefined;
      if (resolvedOptions.watchAnchor && this.#isAnchorHTMLElement(anchor)) {
        anchorObserver = this.#setupAnchorObserver(element, anchor);
      }

      // Setup scroll container handler if requested
      let scrollHandler: (() => void) | undefined;
      if (resolvedOptions.scrollContainer) {
        scrollHandler = this.#setupScrollHandler(
          element,
          resolvedOptions.scrollContainer,
        );
      }

      this.#STATE.set(element, {
        anchor,
        anchorObserver,
        dismissCb,
        margin,
        options: resolvedOptions,
        parent,
        placement,
        scrollHandler,
        zIndex,
      });

      this.#appendToWrapper(element);

      // Apply enter animation class
      if (resolvedOptions.enterClass) {
        element.classList.add(resolvedOptions.enterClass);
      }
    }

    // Setup resize listener if requested
    if (resolvedOptions.recalculateOnResize && !resolvedOptions.fullscreen) {
      this.#resizeElements.add(element);
      this.#setupResizeListener();
    }

    this.#schedulePositionUpdate(element);
  };

  /**
   * Force recalculation of portal position.
   * Useful after content changes or manual resize triggers.
   */
  recalculate = (element: HTMLElement) => {
    if (!this.isInPortal(element)) {
      return;
    }

    this.#schedulePositionUpdate(element);
  };

  //#endregion
}
