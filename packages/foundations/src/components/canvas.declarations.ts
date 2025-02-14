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
import { LfImageElement, LfImagePropsInterface } from "./image.declarations";

//#region Class
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
export interface LfCanvasElement
  extends HTMLStencilElement,
    Omit<LfCanvasInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
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
export type LfCanvasAdapterInitializerGetters = Pick<
  LfCanvasAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "isCursorPreview"
  | "isPainting"
  | "manager"
  | "parts"
  | "points"
>;
export type LfCanvasAdapterInitializerSetters = Pick<
  LfCanvasAdapterControllerSetters,
  "isPainting" | "points"
>;
export interface LfCanvasAdapterHandlers extends LfComponentAdapterHandlers {
  board: {
    endCapture: (e: PointerEvent) => void;
    onPointerDown: (e: PointerEvent) => void;
    onPointerMove: (e: PointerEvent) => void;
    onPointerOut: (e: PointerEvent) => void;
    onPointerUp: (e: PointerEvent) => void;
  };
}
export interface LfCanvasAdapterControllerGetters
  extends LfComponentAdapterGetters<LfCanvasInterface> {
  blocks: typeof LF_CANVAS_BLOCKS;
  compInstance: LfCanvasInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  isCursorPreview: () => boolean;
  isPainting: () => boolean;
  manager: LfFrameworkInterface;
  parts: typeof LF_CANVAS_PARTS;
  points: () => LfCanvasPoints;
}
export interface LfCanvasAdapterControllerSetters
  extends LfComponentAdapterSetters {
  isPainting: (value: boolean) => void;
  points: (value: LfCanvasPoints) => void;
}
export interface LfCanvasAdapterJsx extends LfComponentAdapterJsx {
  board: () => VNode;
  image: () => VNode;
  preview: () => VNode;
}
export interface LfCanvasAdapterRefs extends LfComponentAdapterRefs {
  board: HTMLCanvasElement;
  image: LfImageElement;
  preview: HTMLCanvasElement;
}
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
export interface LfCanvasAdapterToolkitDraw {
  cursor: (e: PointerEvent) => void;
  shape: (type: LfCanvasType, x: number, y: number, isFill?: boolean) => void;
  point: (e: PointerEvent) => void;
}
export interface LfCanvasAdapterToolkit {
  ctx: LfCanvasAdapterToolkitCtx;
  coordinates: LfCanvasAdapterToolkitCoordinates;
  draw: LfCanvasAdapterToolkitDraw;
}
//#endregion

//#region Events
export type LfCanvasEvent = (typeof LF_CANVAS_EVENTS)[number];
export interface LfCanvasEventPayload
  extends LfEventPayload<"LfCanvas", LfCanvasEvent> {
  points: Array<{ x: number; y: number }>;
}
//#endregion

//#region States
export type LfCanvasPoints = Array<{ x: number; y: number }>;
//#endregion

//#region Props
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
export type LfCanvasBrush = (typeof LF_CANVAS_BRUSH)[number];
export type LfCanvasCursor = (typeof LF_CANVAS_CURSOR)[number];
export type LfCanvasType = (typeof LF_CANVAS_TYPES)[number];
//#endregion
