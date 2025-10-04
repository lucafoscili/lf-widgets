import {
  LF_DRAG_SCROLL_DIRECTION,
  LF_DRAG_SWIPE_DIRECTION,
} from "./drag.constants";

//#region Class
/**
 * Primary interface exposing the drag-and-drop helpers.
 */
export interface LfDragInterface {
  /** Group of helper methods used to bind drag/swipe behaviours onto DOM elements. */
  register: {
    /** Registers a custom drag implementation with pointer-down handler. */
    customDrag: (
      element: HTMLElement,
      onPointerDown: (e: PointerEvent, session: LfDragSession) => void,
      callbacks?: LfDragCallbacks,
    ) => void;
    /** Enables element to be dragged and dropped; updates styles and dispatches callbacks during the gesture. */
    dragToDrop: (element: HTMLElement, callbacks?: LfDragCallbacks) => void;
    /** Adds pointer handlers so element can be resized via drag. */
    dragToResize: (element: HTMLElement, callbacks?: LfDragCallbacks) => void;
    /** Hooks drag events to perform scroll behaviour in the requested direction. */
    dragToScroll: (
      element: HTMLElement,
      callbacks?: LfDragCallbacks,
      direction?: LfDragScrollDirection,
    ) => void;
    /** Registers swipe detection on the element for the given direction. */
    swipe: (
      element: HTMLElement,
      callbacks?: LfDragCallbacks,
      direction?: LfDragScrollDirection,
    ) => void;
  };
  /** Complements `register` by detaching helpers from DOM elements. */
  unregister: {
    /** Removes every drag listener registered for the element. */
    all: (element: HTMLElement) => void;
    /** Deregisters a custom drag configuration. */
    customDrag: (element: HTMLElement) => void;
    /** Removes drag-to-drop handlers. */
    dragToDrop: (element: HTMLElement) => void;
    /** Removes drag-to-resize handlers. */
    dragToResize: (element: HTMLElement) => void;
    /** Removes drag-to-scroll handlers. */
    dragToScroll: (element: HTMLElement) => void;
    /** Removes swipe recognition handlers. */
    swipe: (element: HTMLElement) => void;
  };
  /** Returns the active drag session for the element, if any. */
  getActiveSession: (element: HTMLElement) => LfDragSession | undefined;
}
//#endregion

//#region Utilities
/**
 * Utility interface used by the drag-and-drop helpers.
 */
export interface LfDragSession {
  /** Cleans up event listeners and styling when the session ends. */
  cleanupCb: () => void;
  /** Element currently associated with the drag session. */
  element: HTMLElement;
  /** Callbacks invoked throughout the drag lifecycle. */
  callbacks?: LfDragCallbacks;
  /** Runtime drag metrics captured for drag-based behaviours. */
  dragData?: LfDragData;
  /** Swipe-only metadata used by swipe gestures. */
  swipeData?: LfSwipeData;
}
/**
 * Utility interface used by the drag-and-drop helpers.
 */
export interface LfDragData {
  /** Pointer X coordinate where the drag started. */
  startX: number;
  /** Pointer Y coordinate where the drag started. */
  startY: number;
  /** Scroll top position of the element/parent at drag start. */
  startScrollTop: number;
  /** Scroll left position at drag start. */
  startScrollLeft: number;
  /** Horizontal delta since drag start. */
  deltaX: number;
  /** Vertical delta since drag start. */
  deltaY: number;
  /** Last known pointer X. */
  lastX: number;
  /** Last known pointer Y. */
  lastY: number;
  /** Last recorded scroll top during the drag. */
  lastScrollTop: number;
  /** Last recorded scroll left during the drag. */
  lastScrollLeft: number;
  /** Timestamp for the most recent pointer move. */
  lastMoveTime?: number;
  /** Calculated horizontal velocity (pixels per ms). */
  velocityX?: number;
  /** Calculated vertical velocity (pixels per ms). */
  velocityY?: number;
}
/**
 * Utility interface used by the drag-and-drop helpers.
 */
export interface LfSwipeData {
  /** Detected swipe direction, if any. */
  direction?: LfDragSwipeDirection;
}
/**
 * Callback signature invoked by the drag-and-drop helpers when handling drag.
 */
export interface LfDragCallbacks {
  /** Invoked once the drag passes threshold and begins. */
  onStart?: (e: PointerEvent, session: LfDragSession) => void;
  /** Fires on pointer move after drag is active. */
  onMove?: (e: PointerEvent, session: LfDragSession) => void;
  /** Called when the drag ends or is cancelled. */
  onEnd?: (e: PointerEvent, session: LfDragSession) => void;
}
/** Supported scroll directions when using drag-to-scroll helpers. */
export type LfDragScrollDirection = (typeof LF_DRAG_SCROLL_DIRECTION)[number];
/** Supported swipe directions recognised by the swipe helper. */
export type LfDragSwipeDirection = (typeof LF_DRAG_SWIPE_DIRECTION)[number];
//#endregion
