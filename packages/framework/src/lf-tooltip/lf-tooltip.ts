import {
  LF_TOOLTIP_ATTRIBUTES,
  LF_TOOLTIP_CLASSES,
  LF_TOOLTIP_DEFAULTS,
  LfFrameworkInterface,
  LfTooltipElementData,
  LfTooltipInterface,
  LfTooltipOptions,
  LfTooltipPlacement,
  LfTooltipResolvedOptions,
} from "@lf-widgets/foundations";

/**
 * LfTooltip - Framework service for managing tooltips.
 *
 * Provides a fire-and-forget registration pattern similar to effects.
 * Supports both Light DOM and Shadow DOM contexts.
 */
export class LfTooltip implements LfTooltipInterface {
  #MANAGER: LfFrameworkInterface;

  /**
   * Tracks registered tooltips and their data.
   * WeakMap ensures automatic cleanup when elements are garbage collected.
   */
  #ELEMENTS = new WeakMap<HTMLElement, LfTooltipElementData>();

  /**
   * The single shared tooltip element used across all registrations.
   * Created lazily on first use.
   */
  #TOOLTIP: HTMLElement | null = null;

  /**
   * The currently active anchor element (if tooltip is visible).
   */
  #ACTIVE_ANCHOR: HTMLElement | null = null;

  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
  }

  //#region Private Helpers
  /**
   * Ensures the tooltip DOM element exists.
   * Creates it lazily and appends to document.body.
   */
  #ensureTooltip = (): HTMLElement => {
    if (this.#TOOLTIP) {
      return this.#TOOLTIP;
    }

    const tooltip = document.createElement("div");
    tooltip.className = LF_TOOLTIP_CLASSES.tooltip;
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");

    const arrow = document.createElement("div");
    arrow.className = LF_TOOLTIP_CLASSES.arrow;
    tooltip.appendChild(arrow);

    document.body.appendChild(tooltip);
    this.#TOOLTIP = tooltip;

    return tooltip;
  };

  /**
   * Calculates the position for the tooltip based on anchor and placement.
   */
  #calculatePosition = (
    anchor: HTMLElement,
    tooltip: HTMLElement,
    placement: LfTooltipPlacement,
    offset: number,
  ): { top: number; left: number; actualPlacement: LfTooltipPlacement } => {
    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;
    let actualPlacement = placement;

    // Calculate base position based on placement
    const positions = this.#getPositions(
      anchorRect,
      tooltipRect,
      offset,
      placement,
    );
    top = positions.top;
    left = positions.left;

    // Viewport boundary checks and flip if needed
    const flipped = this.#flipIfNeeded(
      top,
      left,
      tooltipRect,
      anchorRect,
      offset,
      placement,
      viewportWidth,
      viewportHeight,
    );

    if (flipped) {
      top = flipped.top;
      left = flipped.left;
      actualPlacement = flipped.placement;
    }

    // Constrain to viewport
    left = Math.max(8, Math.min(left, viewportWidth - tooltipRect.width - 8));
    top = Math.max(8, Math.min(top, viewportHeight - tooltipRect.height - 8));

    return { top, left, actualPlacement };
  };

  /**
   * Gets base positions for each placement.
   */
  #getPositions = (
    anchor: DOMRect,
    tooltip: DOMRect,
    offset: number,
    placement: LfTooltipPlacement,
  ): { top: number; left: number } => {
    const placements: Record<
      LfTooltipPlacement,
      { top: number; left: number }
    > = {
      top: {
        top: anchor.top - tooltip.height - offset,
        left: anchor.left + (anchor.width - tooltip.width) / 2,
      },
      "top-start": {
        top: anchor.top - tooltip.height - offset,
        left: anchor.left,
      },
      "top-end": {
        top: anchor.top - tooltip.height - offset,
        left: anchor.right - tooltip.width,
      },
      bottom: {
        top: anchor.bottom + offset,
        left: anchor.left + (anchor.width - tooltip.width) / 2,
      },
      "bottom-start": {
        top: anchor.bottom + offset,
        left: anchor.left,
      },
      "bottom-end": {
        top: anchor.bottom + offset,
        left: anchor.right - tooltip.width,
      },
      left: {
        top: anchor.top + (anchor.height - tooltip.height) / 2,
        left: anchor.left - tooltip.width - offset,
      },
      "left-start": {
        top: anchor.top,
        left: anchor.left - tooltip.width - offset,
      },
      "left-end": {
        top: anchor.bottom - tooltip.height,
        left: anchor.left - tooltip.width - offset,
      },
      right: {
        top: anchor.top + (anchor.height - tooltip.height) / 2,
        left: anchor.right + offset,
      },
      "right-start": {
        top: anchor.top,
        left: anchor.right + offset,
      },
      "right-end": {
        top: anchor.bottom - tooltip.height,
        left: anchor.right + offset,
      },
    };

    return placements[placement];
  };

  /**
   * Checks if tooltip would overflow viewport and flips placement if needed.
   */
  #flipIfNeeded = (
    top: number,
    left: number,
    tooltip: DOMRect,
    anchor: DOMRect,
    offset: number,
    placement: LfTooltipPlacement,
    viewportWidth: number,
    viewportHeight: number,
  ): { top: number; left: number; placement: LfTooltipPlacement } | null => {
    const overflowTop = top < 0;
    const overflowBottom = top + tooltip.height > viewportHeight;
    const overflowLeft = left < 0;
    const overflowRight = left + tooltip.width > viewportWidth;

    // Determine flip direction based on primary axis
    const primaryAxis = placement.split("-")[0] as
      | "top"
      | "bottom"
      | "left"
      | "right";
    const alignment = placement.includes("-")
      ? (placement.split("-")[1] as "start" | "end")
      : undefined;

    let flippedPlacement: LfTooltipPlacement | null = null;

    if (primaryAxis === "top" && overflowTop) {
      flippedPlacement = alignment ? `bottom-${alignment}` : "bottom";
    } else if (primaryAxis === "bottom" && overflowBottom) {
      flippedPlacement = alignment ? `top-${alignment}` : "top";
    } else if (primaryAxis === "left" && overflowLeft) {
      flippedPlacement = alignment ? `right-${alignment}` : "right";
    } else if (primaryAxis === "right" && overflowRight) {
      flippedPlacement = alignment ? `left-${alignment}` : "left";
    }

    if (flippedPlacement) {
      const newPos = this.#getPositions(
        anchor,
        tooltip,
        offset,
        flippedPlacement as LfTooltipPlacement,
      );
      return {
        top: newPos.top,
        left: newPos.left,
        placement: flippedPlacement as LfTooltipPlacement,
      };
    }

    return null;
  };

  /**
   * Shows the tooltip for a specific anchor element.
   */
  #showTooltip = (anchor: HTMLElement): void => {
    const data = this.#ELEMENTS.get(anchor);
    if (!data) return;

    // Clear any pending hide timeout
    if (data.hideTimeoutId) {
      clearTimeout(data.hideTimeoutId);
      data.hideTimeoutId = undefined;
    }

    // Set show timeout
    data.showTimeoutId = setTimeout(() => {
      const tooltip = this.#ensureTooltip();
      const textNode = tooltip.firstChild;

      // Update content (preserve arrow element)
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = data.options.content;
      } else {
        tooltip.insertBefore(
          document.createTextNode(data.options.content),
          tooltip.firstChild,
        );
      }

      // First, make tooltip visible but with no transition to measure
      tooltip.style.visibility = "hidden";
      tooltip.classList.add(LF_TOOLTIP_CLASSES.visible.split(" ")[0]);

      // Force layout calculation by reading a layout property
      void tooltip.getBoundingClientRect();

      // Calculate position
      const { top, left, actualPlacement } = this.#calculatePosition(
        anchor,
        tooltip,
        data.options.placement,
        data.options.offset,
      );

      // Apply position and placement
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.dataset.placement = actualPlacement;

      // Now make visible with transition
      tooltip.style.visibility = "";
      tooltip.setAttribute("aria-hidden", "false");

      this.#ACTIVE_ANCHOR = anchor;
    }, data.options.showDelay);
  };

  /**
   * Hides the tooltip for a specific anchor element.
   */
  #hideTooltip = (anchor: HTMLElement): void => {
    const data = this.#ELEMENTS.get(anchor);
    if (!data) return;

    // Clear any pending show timeout
    if (data.showTimeoutId) {
      clearTimeout(data.showTimeoutId);
      data.showTimeoutId = undefined;
    }

    // Set hide timeout
    data.hideTimeoutId = setTimeout(() => {
      if (this.#ACTIVE_ANCHOR !== anchor) return;

      const tooltip = this.#TOOLTIP;
      if (!tooltip) return;

      tooltip.classList.remove(LF_TOOLTIP_CLASSES.visible.split(" ")[0]);
      tooltip.setAttribute("aria-hidden", "true");
      this.#ACTIVE_ANCHOR = null;
    }, data.options.hideDelay);
  };
  //#endregion

  //#region Public API
  /**
   * Registers a tooltip on an anchor element.
   */
  register = (element: HTMLElement, options: LfTooltipOptions): void => {
    if (this.#ELEMENTS.has(element)) {
      this.#MANAGER.debug.logs.new(
        this,
        "Element already has a tooltip registered.",
        "warning",
      );
      return;
    }

    const resolvedOptions: LfTooltipResolvedOptions = {
      content: options.content,
      placement: options.placement ?? LF_TOOLTIP_DEFAULTS.placement,
      showDelay: options.showDelay ?? LF_TOOLTIP_DEFAULTS.showDelay,
      hideDelay: options.hideDelay ?? LF_TOOLTIP_DEFAULTS.hideDelay,
      offset: options.offset ?? LF_TOOLTIP_DEFAULTS.offset,
    };

    const enterHandler = () => this.#showTooltip(element);
    const leaveHandler = () => this.#hideTooltip(element);
    const focusHandler = () => this.#showTooltip(element);
    const blurHandler = () => this.#hideTooltip(element);

    const data: LfTooltipElementData = {
      options: resolvedOptions,
      enterHandler,
      leaveHandler,
      focusHandler,
      blurHandler,
    };

    this.#ELEMENTS.set(element, data);

    // Mark element as tooltip anchor
    element.setAttribute(LF_TOOLTIP_ATTRIBUTES.anchor, "");

    // Add event listeners
    element.addEventListener("mouseenter", enterHandler);
    element.addEventListener("mouseleave", leaveHandler);
    element.addEventListener("focus", focusHandler);
    element.addEventListener("blur", blurHandler);
  };

  /**
   * Unregisters a tooltip from an anchor element.
   */
  unregister = (element: HTMLElement): void => {
    const data = this.#ELEMENTS.get(element);
    if (!data) return;

    // Clear any pending timeouts
    if (data.showTimeoutId) {
      clearTimeout(data.showTimeoutId);
    }
    if (data.hideTimeoutId) {
      clearTimeout(data.hideTimeoutId);
    }

    // Remove event listeners
    element.removeEventListener("mouseenter", data.enterHandler);
    element.removeEventListener("mouseleave", data.leaveHandler);
    element.removeEventListener("focus", data.focusHandler);
    element.removeEventListener("blur", data.blurHandler);

    // Remove anchor attribute
    element.removeAttribute(LF_TOOLTIP_ATTRIBUTES.anchor);

    // Hide if this is the active anchor
    if (this.#ACTIVE_ANCHOR === element) {
      this.hideAll();
    }

    this.#ELEMENTS.delete(element);
  };

  /**
   * Checks if an element has a tooltip registered.
   */
  isRegistered = (element: HTMLElement): boolean => {
    return this.#ELEMENTS.has(element);
  };

  /**
   * Updates the content of an existing tooltip.
   */
  updateContent = (element: HTMLElement, content: string): void => {
    const data = this.#ELEMENTS.get(element);
    if (!data) {
      this.#MANAGER.debug.logs.new(
        this,
        "Cannot update content: element has no tooltip registered.",
        "warning",
      );
      return;
    }

    data.options.content = content;

    // If this tooltip is currently visible, update the displayed content
    if (this.#ACTIVE_ANCHOR === element && this.#TOOLTIP) {
      const textNode = this.#TOOLTIP.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = content;
      }
    }
  };

  /**
   * Programmatically shows the tooltip for an element.
   */
  show = (element: HTMLElement): void => {
    if (!this.#ELEMENTS.has(element)) {
      this.#MANAGER.debug.logs.new(
        this,
        "Cannot show tooltip: element has no tooltip registered.",
        "warning",
      );
      return;
    }

    this.#showTooltip(element);
  };

  /**
   * Programmatically hides the tooltip for an element.
   */
  hide = (element: HTMLElement): void => {
    if (!this.#ELEMENTS.has(element)) return;
    this.#hideTooltip(element);
  };

  /**
   * Hides all visible tooltips.
   */
  hideAll = (): void => {
    if (!this.#TOOLTIP) return;

    this.#TOOLTIP.classList.remove(LF_TOOLTIP_CLASSES.visible.split(" ")[0]);
    this.#TOOLTIP.setAttribute("aria-hidden", "true");
    this.#ACTIVE_ANCHOR = null;
  };
  //#endregion
}
