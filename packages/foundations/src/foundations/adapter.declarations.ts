import type { ECElementEvent } from "echarts";
import { LfComponent, VNode } from "./components.declarations";
import { LfEvent } from "./events.declarations";

//#region Adapter
export interface LfComponentAdapter<
  C extends LfComponent,
  H = LfComponentAdapterHandlers,
  J = LfComponentAdapterJsx,
  R = LfComponentAdapterRefs,
  CGet = LfComponentAdapterGetters<C>,
  CSet = LfComponentAdapterSetters,
> {
  controller?: {
    get: CGet;
    set?: CSet;
  };
  elements?: {
    jsx: J;
    refs: R;
  };
  handlers?: H;
}
//#endregion

//#region Handlers
export type LfComponentAdapterHandler = (
  e?: ECElementEvent | Event | PointerEvent | LfEvent,
  ...args: unknown[]
) => unknown | Promise<unknown>;
export type LfComponentAdapterHandlers = {
  [key: string]: LfComponentAdapterHandler | LfComponentAdapterHandlers;
};
//#endregion

//#region Elements
export type LfComponentAdapterJsx = {
  [key: string]: ((...args: unknown[]) => VNode) | LfComponentAdapterJsx;
};
export type LfComponentAdapterRefs = {
  [key: string]: HTMLElement | LfComponentAdapterRefs;
};
//#endregion

//#region Controller
export type LfComponentAdapterGetters<C extends LfComponent> = {
  [key: string]: unknown;
  compInstance: C;
};
export type LfComponentAdapterSetters = {
  [key: string]: ((...args: unknown[]) => void) | LfComponentAdapterSetters;
};
//#endregion
