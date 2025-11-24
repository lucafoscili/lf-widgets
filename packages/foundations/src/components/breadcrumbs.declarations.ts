import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
} from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import {
  LF_BREADCRUMBS_BLOCKS,
  LF_BREADCRUMBS_EVENTS,
  LF_BREADCRUMBS_PARTS,
} from "./breadcrumbs.constants";

//#region Class
export interface LfBreadcrumbsInterface
  extends LfComponent<"LfBreadcrumbs">,
    LfBreadcrumbsPropsInterface {
  onLfEvent: (
    e: Event | CustomEvent,
    eventType: LfBreadcrumbsEvent,
    args?: LfBreadcrumbsEventArguments,
  ) => void;
  setCurrentNode: (nodeId: string) => Promise<void>;
}
export interface LfBreadcrumbsElement
  extends HTMLStencilElement,
    Omit<LfBreadcrumbsInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfBreadcrumbsEvent = (typeof LF_BREADCRUMBS_EVENTS)[number];
export type LfBreadcrumbsEventArguments = {
  node?: LfDataNode;
  index?: number;
};
export type LfBreadcrumbsEventPayload = LfEventPayload<
  "LfBreadcrumbs",
  LfBreadcrumbsEvent
> &
  LfBreadcrumbsEventArguments;
//#endregion

//#region Adapter
export interface LfBreadcrumbsAdapter
  extends LfComponentAdapter<LfBreadcrumbsInterface> {
  controller: {
    get: LfBreadcrumbsAdapterControllerGetters;
    set: LfBreadcrumbsAdapterControllerSetters;
  };
  elements: {
    jsx: LfBreadcrumbsAdapterJsx;
    refs: LfBreadcrumbsAdapterRefs;
  };
  handlers: LfBreadcrumbsAdapterHandlers;
}
export interface LfBreadcrumbsAdapterControllerGetters
  extends LfComponentAdapterGetters<LfBreadcrumbsInterface> {
  blocks: typeof LF_BREADCRUMBS_BLOCKS;
  cyAttributes: typeof CY_ATTRIBUTES;
  dataset: () => LfDataDataset;
  isEnabled: (value?: boolean | string) => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: () => LfFrameworkInterface;
  parts: typeof LF_BREADCRUMBS_PARTS;
  path: () => LfDataNode[];
  separator: () => string;
  uiSize: () => LfThemeUISize;
}
export type LfBreadcrumbsAdapterInitializerGetters = Pick<
  LfBreadcrumbsAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "dataset"
  | "isEnabled"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "path"
  | "separator"
  | "uiSize"
>;
export interface LfBreadcrumbsAdapterControllerSetters
  extends LfComponentAdapterSetters {
  currentNode: (nodeId: string) => Promise<void>;
}
export type LfBreadcrumbsAdapterInitializerSetters = Pick<
  LfBreadcrumbsAdapterControllerSetters,
  "currentNode"
>;
export interface LfBreadcrumbsAdapterJsx extends LfComponentAdapterJsx {
  items: () => VNode | null;
  separator: (index: number) => VNode | null;
}
export interface LfBreadcrumbsAdapterRefs extends LfComponentAdapterRefs {
  items: Map<string, HTMLElement>;
  ripples: Map<string, HTMLElement>;
}
export interface LfBreadcrumbsAdapterHandlers
  extends LfComponentAdapterHandlers {
  item: {
    click: (e: MouseEvent, node: LfDataNode, index: number) => void;
    keydown: (e: KeyboardEvent, node: LfDataNode, index: number) => void;
  };
}
//#endregion

//#region Props
export interface LfBreadcrumbsPropsInterface {
  lfCurrentNodeId?: string;
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfInteractive?: boolean;
  lfMaxItems?: number;
  lfRipple?: boolean;
  lfSeparator?: string;
  lfShowRoot?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
}
//#endregion
