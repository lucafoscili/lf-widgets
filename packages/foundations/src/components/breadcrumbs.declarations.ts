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
import { LfFrameworkInterface, LfThemeUIState } from "../framework";
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

//#region Types
export type LfBreadcrumbsRenderable =
  | LfDataNode
  | {
      isTruncation: true;
    };
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
  expanded: () => boolean;
  isInteractive: () => boolean;
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
  | "expanded"
  | "isInteractive"
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
  expanded: (value: boolean) => Promise<void>;
}
export type LfBreadcrumbsAdapterInitializerSetters = Pick<
  LfBreadcrumbsAdapterControllerSetters,
  "currentNode" | "expanded"
>;
export interface LfBreadcrumbsAdapterJsx extends LfComponentAdapterJsx {
  icon: (node: LfDataNode) => VNode | null;
  item: (node: LfDataNode, index: number, totalItems: number) => VNode[];
  items: () => VNode | null;
  separator: (index: number) => VNode | null;
  truncation: (index: number, totalItems: number) => VNode[];
}
export interface LfBreadcrumbsAdapterRefs extends LfComponentAdapterRefs {
  items: Map<string, HTMLElement>;
  ripples: Map<string, HTMLElement>;
}
export interface LfBreadcrumbsAdapterHandlers
  extends LfComponentAdapterHandlers {
  item: {
    click: (e: MouseEvent, node: LfDataNode, index: number) => Promise<void>;
    keydown: (
      e: KeyboardEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
    pointerdown: (e: PointerEvent, node: LfDataNode, index: number) => void;
  };
  truncation: {
    click: (e: MouseEvent) => Promise<void>;
    keydown: (e: KeyboardEvent) => Promise<void>;
  };
}
//#endregion

//#region Props
export interface LfBreadcrumbsPropsInterface {
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfInteractive?: boolean;
  lfMaxItems?: number;
  lfRipple?: boolean;
  lfSeparator?: string;
  lfShowRoot?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
//#endregion
