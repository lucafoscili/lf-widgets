import {
  CY_ATTRIBUTES,
  LfFrameworkClickCb,
  LfFrameworkInterface,
  LfPortalAnchor,
  LfPortalInterface,
  LfPortalPlacements,
  LfPortalState,
} from "@lf-widgets/foundations";

/**
 * Manages elements within a portal to control their position and click-away behavior.
 *
 * @remarks
 * This class provides functionality to:
 * - Append an element to a dedicated portal container.
 * - Track positions using requestAnimationFrame, allowing for continuous repositioning.
 * - Handle click-away actions.
 *
 * @example
 * ```typescript
 * const portal = new LfPortal(lfFramework);
 * const element = document.createElement('div');
 * portal.open(element, document.body);
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

  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
  }

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
  #clean = (element: HTMLElement) => {
    if (!this.isInPortal(element)) {
      return;
    }

    const { dismissCb, parent } = this.#STATE.get(element)!;
    this.#MANAGER.removeClickCallback(dismissCb);
    if (parent) {
      parent.appendChild(element);
    }

    this.#STATE.delete(element);
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
      this.#clean(element);
      return;
    }

    this.#resetStyle(element);

    const state = this.#STATE.get(element);
    if (!state) {
      this.#MANAGER.debug.logs.new(
        this,
        `State for element not found.`,
        "warning",
      );
      return;
    }

    const { anchor, margin, placement } = state;
    const { offsetHeight, offsetWidth, style } = element;

    style.display = "block";

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

    let verticalPart: "t" | "b" | "auto" = "auto";
    let horizontalPart: "l" | "r" | "auto" = "auto";

    if (placement === "auto") {
      verticalPart = "auto";
      horizontalPart = "auto";
    } else {
      const lower = placement.toLowerCase();

      // check first char for vertical
      if (lower.startsWith("t")) {
        verticalPart = "t";
      } else if (lower.startsWith("b")) {
        verticalPart = "b";
      } else if (lower.startsWith("l") || lower.startsWith("r")) {
      }

      if (lower.endsWith("l")) {
        horizontalPart = "l";
      } else if (lower.endsWith("r")) {
        horizontalPart = "r";
      }
    }

    let finalVertical = verticalPart;
    if (verticalPart === "auto") {
      if (spaceBelow >= offsetHeight) {
        finalVertical = "b";
      } else if (spaceAbove >= offsetHeight) {
        finalVertical = "t";
      } else {
        finalVertical = "b"; // fallback
      }
    } else if (verticalPart === "b") {
      if (spaceBelow < offsetHeight && spaceAbove > offsetHeight) {
        finalVertical = "t";
      }
    } else if (verticalPart === "t") {
      if (spaceAbove < offsetHeight && spaceBelow > offsetHeight) {
        finalVertical = "b";
      }
    }

    let finalHorizontal = horizontalPart;
    if (horizontalPart === "auto") {
      if (spaceOnRight >= offsetWidth) {
        finalHorizontal = "l";
      } else if (spaceOnLeft >= offsetWidth) {
        finalHorizontal = "r";
      } else {
        finalHorizontal = "l"; // fallback prefers left alignment
      }
    } else if (horizontalPart === "r") {
      if (spaceOnRight < offsetWidth && spaceOnLeft > offsetWidth) {
        finalHorizontal = "l";
      }
    } else if (horizontalPart === "l") {
      if (spaceOnLeft < offsetWidth && spaceOnRight > offsetWidth) {
        finalHorizontal = "r";
      }
    }

    switch (finalVertical) {
      case "t":
        style.bottom = `${window.innerHeight - top + margin}px`;
        break;
      case "b":
        style.top = `${bottom + margin}px`;
        break;
      default:
        style.top =
          offsetHeight < top && window.innerHeight - bottom < offsetHeight
            ? `${window.innerHeight - top + margin}px`
            : `${bottom + margin}px`;
        break;
    }

    let scrollbarWidth =
      window.innerWidth - document.documentElement.offsetWidth;
    if (scrollbarWidth > 30) {
      scrollbarWidth = 0;
    }

    switch (finalHorizontal) {
      case "l":
        style.left = `${left}px`;
        break;
      case "r":
        style.right = `${window.innerWidth - scrollbarWidth - right}px`;
        break;
      default:
        style.left =
          offsetWidth < right && window.innerWidth - left < offsetWidth
            ? `${window.innerWidth - scrollbarWidth - right}px`
            : `${left}px`;
        break;
    }

    requestAnimationFrame(() => this.#schedulePositionUpdate(element));
  };

  #isAnchorHTMLElement = (anchor: LfPortalAnchor): anchor is HTMLElement => {
    return (anchor as HTMLElement).tagName !== undefined;
  };

  #resetStyle = (element: HTMLElement) => {
    const { style } = element;

    style.bottom = "";
    style.display = "";
    style.left = "";
    style.right = "";
    style.top = "";
  };

  //#endregion

  //#region Close
  /**
   * Closes the portal element by cleaning and resetting its style.
   */
  close = (element: HTMLElement) => {
    this.#clean(element);
    this.#resetStyle(element);
  };
  //#endregion

  //#region getState
  /**
   * Retrieves the state associated with the given HTML element.
   */
  getState = (element: HTMLElement) => {
    return this.#STATE.get(element);
  };
  //#endregion

  //#region isInPortal
  /**
   * Checks if the given HTML element is registered within the portal manager.
   */
  isInPortal = (element: HTMLElement) => {
    return this.#STATE.has(element);
  };
  //#endregion

  //#region Open
  /**
   * Opens (or reopens) a portal element and positions it.
   * - If the element is already being managed, updates its configuration.
   * - Otherwise, sets up the element with click-away handling and adds it to the portal.
   */
  open = (
    element: HTMLElement,
    parent: HTMLElement,
    anchor: LfPortalAnchor = parent,
    margin = 0,
    placement: LfPortalPlacements = "auto",
  ) => {
    let state = this.#STATE.get(element);
    if (state) {
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
    } else {
      const dismissCb: LfFrameworkClickCb = {
        cb: () => {
          this.close(element);
        },
        element,
      };

      this.#STATE.set(element, {
        anchor,
        dismissCb,
        margin,
        parent,
        placement,
      });

      this.#MANAGER.addClickCallback(dismissCb, true);
      this.#appendToWrapper(element);
    }

    this.#schedulePositionUpdate(element);
  };
  //#endregion
}
