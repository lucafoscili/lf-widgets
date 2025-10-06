import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import { CY_ATTRIBUTES } from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import {
  LF_CANVAS_BLOCKS,
  LF_CANVAS_BRUSH,
  LF_CANVAS_CURSOR,
  LF_CANVAS_EVENTS,
  LF_CANVAS_PARTS,
  LF_CANVAS_TYPES,
} from "./canvas.constants";
import {
  LfImageElement,
  LfImageEventPayload,
  LfImagePropsInterface,
} from "./image.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-canvas` component. It merges the shared component contract with the component-specific props.
 */
export interface LfCanvasInterface
  extends LfComponent<"LfCanvas">,
    LfCanvasPropsInterface {
  clearCanvas: (type?: LfCanvasType) => Promise<void>;
  getCanvas: () => Promise<HTMLCanvasElement>;
  getImage: () => Promise<LfImageElement>;
  resizeCanvas: () => Promise<void>;
  setCanvasHeight: (value?: number) => Promise<void>;
  setCanvasWidth: (value?: number) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-canvas`.
 */
export interface LfCanvasElement
  extends HTMLStencilElement,
    Omit<LfCanvasInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-canvas` into host integrations.
 */
export interface LfCanvasAdapter extends LfComponentAdapter<LfCanvasInterface> {
  controller: {
    get: LfCanvasAdapterControllerGetters;
    set: LfCanvasAdapterControllerSetters;
  };
  elements: {
    jsx: LfCanvasAdapterJsx;
    refs: LfCanvasAdapterRefs;
  };
  handlers: LfCanvasAdapterHandlers;
  toolkit: LfCanvasAdapterToolkit;
}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfCanvasAdapterInitializerGetters = Pick<
  LfCanvasAdapterControllerGetters,
  | "blocks"
  | "boxing"
  | "compInstance"
  | "cyAttributes"
  | "isCursorPreview"
  | "isPainting"
  | "manager"
  | "orientation"
  | "parts"
  | "points"
>;
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfCanvasAdapterInitializerSetters = Pick<
  LfCanvasAdapterControllerSetters,
  "boxing" | "isPainting" | "orientation" | "points"
>;
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfCanvasAdapterHandlers extends LfComponentAdapterHandlers {
  board: {
    endCapture: (e: PointerEvent) => void;
    onPointerDown: (e: PointerEvent) => void;
    onPointerMove: (e: PointerEvent) => void;
    onPointerOut: (e: PointerEvent) => void;
    onPointerUp: (e: PointerEvent) => void;
  };
  image: {
    onLoad: (e: CustomEvent<LfImageEventPayload>) => Promise<void>;
  };
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfCanvasAdapterControllerGetters
  extends LfComponentAdapterGetters<LfCanvasInterface> {
  blocks: typeof LF_CANVAS_BLOCKS;
  boxing: () => LfCanvasBoxing;
  compInstance: LfCanvasInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  isCursorPreview: () => boolean;
  isPainting: () => boolean;
  manager: LfFrameworkInterface;
  orientation: () => LfCanvasOrientation;
  parts: typeof LF_CANVAS_PARTS;
  points: () => LfCanvasPoints;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfCanvasAdapterControllerSetters
  extends LfComponentAdapterSetters {
  boxing: (value: LfCanvasBoxing) => void;
  isPainting: (value: boolean) => void;
  orientation: (value: LfCanvasOrientation) => void;
  points: (value: LfCanvasPoints) => void;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfCanvasAdapterJsx extends LfComponentAdapterJsx {
  board: () => VNode;
  image: () => VNode;
  preview: () => VNode;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfCanvasAdapterRefs extends LfComponentAdapterRefs {
  board: HTMLCanvasElement;
  image: LfImageElement;
  preview: HTMLCanvasElement;
}
/**
 * Utility interface used by the `lf-canvas` component.
 */
export interface LfCanvasAdapterToolkitCtx {
  clear(type: LfCanvasType): void;
  get(type: LfCanvasType): {
    ctx: CanvasRenderingContext2D;
    height: number;
    width: number;
  };
  redraw(type: LfCanvasType): void;
  setup(type: LfCanvasType, isFill?: boolean): void;
}
/**
 * Utility interface used by the `lf-canvas` component.
 */
export interface LfCanvasAdapterToolkitCoordinates {
  get: (
    e: PointerEvent,
    rect: DOMRect,
  ) => {
    x: number;
    y: number;
  };
  normalize: (
    e: PointerEvent,
    rect: DOMRect,
  ) => {
    x: number;
    y: number;
  };
  simplify: (points: LfCanvasPoints, tolerance: number) => LfCanvasPoints;
}
/**
 * Utility interface used by the `lf-canvas` component.
 */
export interface LfCanvasAdapterToolkitDraw {
  cursor: (e: PointerEvent) => void;
  shape: (type: LfCanvasType, x: number, y: number, isFill?: boolean) => void;
  point: (e: PointerEvent) => void;
}
/**
 * Utility interface used by the `lf-canvas` component.
 */
export interface LfCanvasAdapterToolkit {
  ctx: LfCanvasAdapterToolkitCtx;
  coordinates: LfCanvasAdapterToolkitCoordinates;
  draw: LfCanvasAdapterToolkitDraw;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-canvas`.
 */
export type LfCanvasEvent = (typeof LF_CANVAS_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-canvas` events.
 */
export interface LfCanvasEventPayload
  extends LfEventPayload<"LfCanvas", LfCanvasEvent> {
  points: Array<{ x: number; y: number }>;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-canvas` component.
 */
export type LfCanvasBoxing = "letterbox" | "pillarbox" | null;
/**
 * Utility type used by the `lf-canvas` component.
 */
export type LfCanvasOrientation = "portrait" | "landscape" | null;
/**
 * Utility type used by the `lf-canvas` component.
 */
export type LfCanvasPoints = Array<{ x: number; y: number }>;
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-canvas` component.
 */
export interface LfCanvasPropsInterface {
  lfBrush?: LfCanvasBrush;
  lfColor?: string;
  lfCursor?: LfCanvasCursor;
  lfImageProps?: LfImagePropsInterface;
  lfOpacity?: number;
  lfPreview?: boolean;
  lfSize?: number;
  lfStrokeTolerance?: number;
  lfStyle?: string;
}
/**
 * Utility type used by the `lf-canvas` component.
 */
export type LfCanvasBrush = (typeof LF_CANVAS_BRUSH)[number];
/**
 * Utility type used by the `lf-canvas` component.
 */
export type LfCanvasCursor = (typeof LF_CANVAS_CURSOR)[number];
/**
 * Union of type identifiers defined in `LF_CANVAS_TYPES`.
 */
export type LfCanvasType = (typeof LF_CANVAS_TYPES)[number];
//#endregion
