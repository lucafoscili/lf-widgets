import {
  LF_DRAG_SCROLL_DIRECTION,
  LF_DRAG_SWIPE_DIRECTION,
} from "./drag.constants";

//#region Class
/**
 * Primary interface exposing the drag-and-drop helpers.
 */
export interface LfDragInterface {
  register: {
    customDrag: (
      element: HTMLElement,
      onPointerDown: (e: PointerEvent, session: LfDragSession) => void,
      callbacks?: LfDragCallbacks,
    ) => void;
    dragToDrop: (element: HTMLElement, callbacks?: LfDragCallbacks) => void;
    dragToResize: (element: HTMLElement, callbacks?: LfDragCallbacks) => void;
    dragToScroll: (
      element: HTMLElement,
      callbacks?: LfDragCallbacks,
      direction?: LfDragScrollDirection,
    ) => void;
    swipe: (
      element: HTMLElement,
      callbacks?: LfDragCallbacks,
      direction?: LfDragScrollDirection,
    ) => void;
  };
  unregister: {
    all: (element: HTMLElement) => void;
    customDrag: (element: HTMLElement) => void;
    dragToDrop: (element: HTMLElement) => void;
    dragToResize: (element: HTMLElement) => void;
    dragToScroll: (element: HTMLElement) => void;
    swipe: (element: HTMLElement) => void;
  };
  getActiveSession: (element: HTMLElement) => LfDragSession | undefined;
}
//#endregion

//#region Utilities
/**
 * Utility interface used by the drag-and-drop helpers.
 */
export interface LfDragSession {
  cleanupCb: () => void;
  element: HTMLElement;
  callbacks?: LfDragCallbacks;
  dragData?: LfDragData;
  swipeData?: LfSwipeData;
}
/**
 * Utility interface used by the drag-and-drop helpers.
 */
export interface LfDragData {
  startX: number;
  startY: number;
  startScrollTop: number;
  startScrollLeft: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
  lastScrollTop: number;
  lastScrollLeft: number;
  lastMoveTime?: number;
  velocityX?: number;
  velocityY?: number;
}
/**
 * Utility interface used by the drag-and-drop helpers.
 */
export interface LfSwipeData {
  direction?: LfDragSwipeDirection;
}
/**
 * Callback signature invoked by the drag-and-drop helpers when handling drag.
 */
export interface LfDragCallbacks {
  onStart?: (e: PointerEvent, session: LfDragSession) => void;
  onMove?: (e: PointerEvent, session: LfDragSession) => void;
  onEnd?: (e: PointerEvent, session: LfDragSession) => void;
}
/**
 * Utility type used by the drag-and-drop helpers.
 */
export type LfDragScrollDirection = (typeof LF_DRAG_SCROLL_DIRECTION)[number];
/**
 * Utility type used by the drag-and-drop helpers.
 */
export type LfDragSwipeDirection = (typeof LF_DRAG_SWIPE_DIRECTION)[number];
//#endregion
