import {
  LfFrameworkInterface,
  LfDragCallbacks,
  LfDragInterface,
  LfDragScrollDirection,
  LfDragSession,
} from "@lf-widgets/foundations";

export class LfDrag implements LfDragInterface {
  #IS_DRAGGING = false;
  #DRAG_THRESHOLD = 5;
  #MANAGER: LfFrameworkInterface;
  #POINTER_ID: number | null = null;
  #REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  #SESSIONS = new WeakMap<HTMLElement, LfDragSession>();

  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
  }

  #initializeSession(
    element: HTMLElement,
    callbacks: LfDragCallbacks = {},
    dragLogicHandler: (e: PointerEvent, distX: number, distY: number) => void,
  ): void {
    this.#SESSIONS.get(element)?.cleanupCb();
    this.#SESSIONS.delete(element);

    const removeThresholdListeners = this.#setupThresholdAwarePointerDown(
      element,
      this.#DRAG_THRESHOLD,
      (moveEvent, distX, distY) => {
        dragLogicHandler(moveEvent, distX, distY);
      },
    );

    const session: LfDragSession = {
      cleanupCb: () => {
        removeThresholdListeners();
        element.style.cursor = "auto";
        element.style.userSelect = "auto";
        element.removeAttribute("aria-grabbed");
        delete element.dataset.lf;
      },
      element,
      callbacks,
      dragData: undefined,
    };

    this.#SESSIONS.set(element, session);
  }
  #defaultPointerMoveAndUp = (element: HTMLElement, session: LfDragSession) => {
    const onPointerMove = (moveEvent: PointerEvent) => {
      session.callbacks?.onMove?.(moveEvent, session);
    };

    const onPointerUp = (endEvent: PointerEvent) => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      session.callbacks?.onEnd?.(endEvent, session);
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
  };
  #setupThresholdAwarePointerDown(
    element: HTMLElement,
    threshold: number,
    startDragHandler: (
      downEvent: PointerEvent,
      distX: number,
      distY: number,
    ) => void,
  ): () => void {
    let pointerDownX = 0;
    let pointerDownY = 0;

    this.#IS_DRAGGING = false;
    this.#POINTER_ID = null;

    const onPointerDown = (e: PointerEvent) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
      this.#IS_DRAGGING = false;
      this.#POINTER_ID = e.pointerId;
    };

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (this.#POINTER_ID === null) {
        return;
      }

      const distX = moveEvent.clientX - pointerDownX;
      const distY = moveEvent.clientY - pointerDownY;
      const distance = Math.sqrt(distX ** 2 + distY ** 2);

      if (!this.#IS_DRAGGING && distance > threshold) {
        this.#IS_DRAGGING = true;

        moveEvent.preventDefault();
        element.setPointerCapture(moveEvent.pointerId);

        startDragHandler(moveEvent, distX, distY);
      }
    };

    const onPointerUp = (_upEvent: PointerEvent) => {
      this.#POINTER_ID = null;
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
    };
  }
  #dragToDropHandler = (element: HTMLElement, e: PointerEvent) => {
    const session = this.#SESSIONS.get(element);
    if (!session) {
      this.#MANAGER.debug.logs.new(
        this,
        "Attempted to interact with an unregistered element.",
        "warning",
      );
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = element.getBoundingClientRect();
    const offsetLeft = rect.left;
    const offsetTop = rect.top;

    session.callbacks?.onStart?.(e, session);

    element.style.position = "absolute";
    element.style.cursor = "grabbing";

    const onPointerMove = (moveEvent: PointerEvent) => {
      session.dragData = {
        ...session.dragData,
        startX,
        startY,
        deltaX: moveEvent.clientX - startX,
        deltaY: moveEvent.clientY - startY,
        lastX: moveEvent.clientX,
        lastY: moveEvent.clientY,
        lastScrollLeft: 0,
        lastScrollTop: 0,
        startScrollLeft: 0,
        startScrollTop: 0,
      };

      const newLeft = offsetLeft + session.dragData.deltaX;
      const newTop = offsetTop + session.dragData.deltaY;
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;

      session.callbacks?.onMove?.(moveEvent, session);
    };

    const onPointerUp = (endEvent: PointerEvent) => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);

      element.style.cursor = "auto";

      session.callbacks?.onEnd?.(endEvent, session);
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
  };

  #dragToResizeHandler = (element: HTMLElement, e: PointerEvent) => {
    const session = this.#SESSIONS.get(element);
    if (!session) {
      this.#MANAGER.debug.logs.new(
        this,
        "Attempted to interact with an unregistered element.",
        "warning",
      );
      return;
    }

    const startWidth = element.offsetWidth;
    const startHeight = element.offsetHeight;
    const startX = e.clientX;
    const startY = e.clientY;

    session.callbacks?.onStart?.(e, session);

    element.style.cursor = "nwse-resize";

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      session.dragData = {
        ...session.dragData,
        startX,
        startY,
        deltaX,
        deltaY,
        lastX: moveEvent.clientX,
        lastY: moveEvent.clientY,
        startScrollLeft: 0,
        startScrollTop: 0,
        lastScrollLeft: 0,
        lastScrollTop: 0,
      };

      element.style.width = `${startWidth + deltaX}px`;
      element.style.height = `${startHeight + deltaY}px`;

      session.callbacks?.onMove?.(moveEvent, session);
    };

    const onPointerUp = (endEvent: PointerEvent) => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);

      element.style.cursor = "auto";
      session.callbacks?.onEnd?.(endEvent, session);
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
  };
  #dragToScrollHandler = (
    element: HTMLElement,
    e: PointerEvent,
    direction: LfDragScrollDirection = "x",
    distX: number,
    distY: number,
  ) => {
    const session = this.#SESSIONS.get(element);
    if (!session) {
      this.#MANAGER.debug.logs.new(
        this,
        "Attempted to interact with an unregistered element.",
        "warning",
      );
      return;
    }

    element.setPointerCapture(e.pointerId);

    const startX = e.clientX - distX;
    const startY = e.clientY - distY;
    const startScrollLeft = element.scrollLeft;
    const startScrollTop = element.scrollTop;
    const startTime = performance.now();

    session.callbacks?.onStart?.(e, session);

    element.style.cursor = "grabbing";
    element.style.userSelect = "none";

    const onPointerMove = (moveEvent: PointerEvent) => {
      const currentTime = performance.now();
      const timeDelta =
        currentTime - (session.dragData?.lastMoveTime || startTime);

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      switch (direction) {
        case "x":
          element.scrollLeft = startScrollLeft - deltaX;
          break;
        case "y":
          element.scrollTop = startScrollTop - deltaY;
          break;
      }

      const newVelocityX = -(deltaX / timeDelta);
      const newVelocityY = -(deltaY / timeDelta);

      session.dragData = {
        startX,
        startY,
        startScrollLeft,
        startScrollTop,
        velocityX: newVelocityX,
        velocityY: newVelocityY,
        lastMoveTime: currentTime,
        deltaX: moveEvent.clientX - startX,
        deltaY: moveEvent.clientY - startY,
        lastX: moveEvent.clientX,
        lastY: moveEvent.clientY,
        lastScrollLeft: element.scrollLeft,
        lastScrollTop: element.scrollTop,
      };

      session.callbacks?.onMove?.(moveEvent, session);
    };

    const onPointerUp = (endEvent: PointerEvent) => {
      element.releasePointerCapture(endEvent.pointerId);

      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);

      if (!this.#REDUCED_MOTION) {
        let vx = session.dragData?.velocityX ?? 0;
        let vy = session.dragData?.velocityY ?? 0;
        const momentumFactor = 1;

        const momentumScroll = () => {
          if (Math.abs(vx) > 0.1) {
            switch (direction) {
              case "x":
                element.scrollLeft += vx * momentumFactor;
                break;
              case "y":
                element.scrollTop += vy * momentumFactor;
                break;
            }
            vx *= 0.95;
            vy *= 0.95;
            requestAnimationFrame(momentumScroll);
          }
        };

        momentumScroll();
      }

      element.setAttribute("aria-grabbed", "false");

      session.callbacks?.onEnd?.(endEvent, session);
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
  };
  #swipeHandler = (
    element: HTMLElement,
    e: PointerEvent,
    direction: LfDragScrollDirection = "x",
  ) => {
    const session = this.#SESSIONS.get(element);
    if (!session) {
      this.#MANAGER.debug.logs.new(
        this,
        "Attempted to interact with an unregistered element.",
        "warning",
      );
      return;
    }

    const swipeThreshold = 50;
    const startX = e.clientX;
    const startY = e.clientY;

    if (!session.swipeData) {
      session.swipeData = { direction: null };
      session.callbacks?.onStart?.(e, session);
    }

    let hasPreventedDefault = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const currentDistX = moveEvent.clientX - startX;
      const currentDistY = moveEvent.clientY - startY;

      const deltaX = Math.abs(currentDistX);
      const deltaY = Math.abs(currentDistY);

      if (deltaX > deltaY && deltaX > swipeThreshold) {
        if (!hasPreventedDefault && moveEvent.cancelable) {
          moveEvent.preventDefault();
          hasPreventedDefault = true;
        }
      }

      if (direction === "x" && deltaX > swipeThreshold) {
        session.swipeData.direction = currentDistX > 0 ? "right" : "left";
      } else if (direction === "y" && deltaY > swipeThreshold) {
        session.swipeData.direction = currentDistY > 0 ? "down" : "up";
      }

      session.callbacks?.onMove?.(moveEvent, session);
    };

    const onPointerUp = (endEvent: PointerEvent) => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);

      if (session.swipeData?.direction) {
        session.callbacks?.onEnd?.(endEvent, session);
      }

      session.swipeData = null;
      hasPreventedDefault = false;
    };

    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
  };

  //#region Register
  /**
   * Registers various drag behaviors on an element.
   * The user can supply optional callbacks (onStart, onMove, onEnd).
   * This includes velocity + momentum.
   * The user can also specify the drag type (scroll, drop, resize, etc.)
   */
  register = {
    /**
     * Registers a custom drag behavior. The user must provide their own onPointerDown handler.
     * The user can also provide optional callbacks (onMove, onEnd).
     * If the user does NOT provide their own onMove/onEnd, the default behavior is to call the defaultPointerMoveAndUp handler.
     *
     * @param element The element to register custom drag behavior on.
     * @param onPointerDown The user-provided handler for pointerdown events.
     * @param callbacks Optional callbacks for onMove, onEnd.
     *
     * @example
     * lfDrag.register.customDrag(element, (e, session) => {
     *  console.log("Custom drag started!");
     * }, {
     * onMove: (e, session) => {
     *  console.log("Custom dragging...");
     * },
     * onEnd: (e, session) => {
     *  console.log("Custom drag ended!");
     * },
     * });
     */
    customDrag: (
      element: HTMLElement,
      onPointerDown: (e: PointerEvent, session: LfDragSession) => void,
      callbacks: LfDragCallbacks = {},
    ) => {
      this.#initializeSession(element, callbacks, (e: PointerEvent) => {
        const session = this.#SESSIONS.get(element);
        if (!session) {
          console.warn("Attempted to interact with an unregistered element.");
          return;
        }
        onPointerDown(e, session);

        if (!callbacks.onMove && !callbacks.onEnd) {
          this.#defaultPointerMoveAndUp(element, session);
        }
      });
    },
    /**
     * Registers a skeleton for drag-to-drop.
     */
    dragToDrop: (element: HTMLElement, callbacks?: LfDragCallbacks) => {
      this.#initializeSession(element, callbacks, (e: PointerEvent) => {
        this.#dragToDropHandler(element, e);
      });
    },
    /**
     * Registers a skeleton for drag-to-resize.
     */
    dragToResize: (element: HTMLElement, callbacks?: LfDragCallbacks) => {
      this.#initializeSession(element, callbacks, (e: PointerEvent) => {
        this.#dragToResizeHandler(element, e);
      });
    },
    /**
     * Registers drag-to-scroll behavior for the element. The user can supply
     * optional callbacks (onStart, onMove, onEnd). This includes velocity + momentum.
     *
     * @param element The element to register drag-to-scroll behavior on.
     * @param callbacks Optional callbacks for onStart, onMove, onEnd.
     * @param direction Optional direction to scroll in (x, y, or both).
     *
     * @example
     * lfDrag.register.dragToScroll(element, {
     *  onStart: (e, session) => {
     *   console.log("Drag started!");
     * },
     *  onMove: (e, session) => {
     *   console.log("Dragging...");
     * },
     *  onEnd: (e, session) => {
     *   console.log("Drag ended!");
     * },
     * });
     */
    dragToScroll: (
      element: HTMLElement,
      callbacks?: LfDragCallbacks,
      direction: LfDragScrollDirection = "x",
    ) => {
      this.#initializeSession(element, callbacks, (e, distX, distY) => {
        this.#dragToScrollHandler(element, e, direction, distX, distY);
      });
    },
    /**
     * Registers a swipe handler for the element. The user can supply optional callbacks (onStart, onMove, onEnd).
     *
     * @param element The element to register swipe behavior on.
     * @param callbacks Optional callbacks for onStart, onMove, onEnd.
     * @param direction Optional direction to swipe in (x, y).
     *
     * @example
     * lfDrag.register.swipe(element, {
     *  onStart: (e, session) => {
     *   console.log("Swipe started!");
     * },
     *  onMove: (e, session) => {
     *   console.log("Swiping...");
     * },
     *  onEnd: (e, session) => {
     *   console.log("Swipe ended!");
     * },
     * });
     */
    swipe: (
      element: HTMLElement,
      callbacks?: LfDragCallbacks,
      direction: LfDragScrollDirection = "x",
    ) => {
      this.#initializeSession(element, callbacks, (e) => {
        this.#swipeHandler(element, e, direction);
      });
    },
  };
  //#endregion

  //#region Unregister
  /**
   * Unregisters various drag behaviors from an element.
   * This includes scroll, drop, resize, etc.
   *
   * @example
   * lfDrag.unregister.all(element);
   * lfDrag.unregister.dragToScroll(element);
   * lfDrag.unregister.dragToDrop(element);
   * lfDrag.unregister.dragToResize(element);
   * lfDrag.unregister.customDrag(element);
   */
  unregister = {
    /**
     * Unregisters any of the standard behaviors (scroll, drop, resize, etc.)
     * by simply calling the session's cleanupCb, then removing the session from the map.
     *
     * @param element The element to unregister drag behavior from.
     *
     * @example
     * lfDrag.unregister.all(element);
     */
    all: (element: HTMLElement) => {
      const session = this.#SESSIONS.get(element);
      if (!session) return;
      session.cleanupCb();
      this.#SESSIONS.delete(element);
    },
    /**
     * Unregisters custom drag behavior from an element.
     *
     * @param element The element to unregister custom drag behavior from.
     *
     * @example
     * lfDrag.unregister.customDrag(element);
     */
    customDrag: (element: HTMLElement) => {
      const session = this.#SESSIONS.get(element);
      session?.cleanupCb();
      this.#SESSIONS.delete(element);
    },
    /**
     * Unregisters drag-to-drop behavior from an element.
     *
     * @param element The element to unregister drag-to-drop behavior from.
     *
     * @example
     * lfDrag.unregister.dragToDrop(element);
     */
    dragToDrop: (element: HTMLElement) => {
      const session = this.#SESSIONS.get(element);
      session?.cleanupCb();
      this.#SESSIONS.delete(element);
    },
    /**
     * Unregisters drag-to-resize behavior from an element.
     *
     * @param element The element to unregister drag-to-resize behavior from.
     *
     * @example
     * lfDrag.unregister.dragToResize(element);
     */
    dragToResize: (element: HTMLElement) => {
      const session = this.#SESSIONS.get(element);
      session?.cleanupCb();
      this.#SESSIONS.delete(element);
    },
    /**
     * Unregisters drag-to-scroll behavior from an element.
     *
     * @param element The element to unregister drag-to-scroll behavior from.
     *
     * @example
     * lfDrag.unregister.dragToScroll(element);
     */
    dragToScroll: (element: HTMLElement) => {
      const session = this.#SESSIONS.get(element);
      session?.cleanupCb();
      this.#SESSIONS.delete(element);
    },
    /**
     * Unregisters swipe behavior from an element.
     *
     * @param element The element to unregister swipe behavior from.
     *
     * @example
     * lfDrag.unregister.swipe(element);
     */
    swipe: (element: HTMLElement) => {
      const session = this.#SESSIONS.get(element);
      session?.cleanupCb();
      this.#SESSIONS.delete(element);
    },
  };
  //#endregion

  //#region getActiveSession
  /**
   * Public API to get the active session for an element, if any.
   *
   * @param element The element to get the active session for.
   *
   * @example
   * const session = lfDrag.getActiveSession(element);
   * if (session) {
   * console.log("Session is active!");
   * }
   */
  getActiveSession(element: HTMLElement): LfDragSession | undefined {
    return this.#SESSIONS.get(element);
  }
  //#endregion
}
