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
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import { LfTextfieldEventPayload } from "./textfield.declarations";
import { LF_TREE_EVENTS } from "./tree.constants";

//#region Class
export interface LfTreeInterface
  extends LfComponent<"LfTree">,
    LfTreePropsInterface {
  onLfEvent: (
    e: Event | CustomEvent,
    eventType: LfTreeEvent,
    args?: LfTreeEventArguments,
  ) => void;
  _filterTimeout?: any;
}
export interface LfTreeElement
  extends HTMLStencilElement,
    Omit<LfTreeInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
export interface LfTreeAdapter extends LfComponentAdapter<LfTreeInterface> {
  controller: {
    get: LfTreeAdapterControllerGetters;
    set: LfTreeAdapterControllerSetters;
  };
  elements: { jsx: LfTreeAdapterJsx; refs: LfTreeAdapterRefs };
  handlers: LfTreeAdapterHandlers;
}
export interface LfTreeAdapterInitializerGetters {
  blocks: typeof import("./tree.constants").LF_TREE_BLOCKS;
  compInstance: LfTreeInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  dataset: () => LfDataDataset;
  columns: () => NonNullable<LfDataDataset["columns"]>;
  isGrid: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: import("../framework/framework.declarations").LfFrameworkInterface;
  parts: typeof import("./tree.constants").LF_TREE_PARTS;
  isExpanded: (node: LfDataNode) => boolean;
  isHidden: (node: LfDataNode) => boolean;
  isSelected: (node: LfDataNode) => boolean;
  filterValue: () => string; // kept as function to always reflect latest value
}
export interface LfTreeAdapterInitializerSetters {
  expansion: { toggle: (node: LfDataNode) => void };
  selection: { set: (node: LfDataNode) => void };
  filter: { setValue: (value: string) => void; apply: (value: string) => void };
}
export interface LfTreeAdapterControllerGetters
  extends LfComponentAdapterGetters<LfTreeInterface> {
  blocks: typeof import("./tree.constants").LF_TREE_BLOCKS;
  compInstance: LfTreeInterface;
  manager: import("../framework/framework.declarations").LfFrameworkInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  dataset: () => LfDataDataset;
  columns: () => NonNullable<LfDataDataset["columns"]>;
  isGrid: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  parts: typeof import("./tree.constants").LF_TREE_PARTS;
  isExpanded: (node: LfDataNode) => boolean;
  isHidden: (node: LfDataNode) => boolean;
  isSelected: (node: LfDataNode) => boolean;
  filterValue: () => string;
}
export interface LfTreeAdapterControllerSetters
  extends LfComponentAdapterSetters {
  expansion: { toggle: (node: LfDataNode) => void };
  selection: { set: (node: LfDataNode) => void };
  filter: { setValue: (value: string) => void; apply: (value: string) => void };
}
export interface LfTreeAdapterJsx extends LfComponentAdapterJsx {
  filter: () => VNode;
  header: () => VNode;
  nodes: () => VNode;
  empty: () => VNode;
}
export interface LfTreeAdapterRefs extends LfComponentAdapterRefs {
  rippleSurfaces: Record<string, HTMLElement>;
  filterField: HTMLElement | null;
}
export interface LfTreeAdapterHandlers extends LfComponentAdapterHandlers {
  node: {
    click: (e: Event, node: LfDataNode) => void;
    expand: (e: Event, node: LfDataNode) => void;
    pointerDown: (e: Event, node: LfDataNode) => void;
  };
  filter: {
    input: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
}
//#endregion

//#region Events
export type LfTreeEvent = (typeof LF_TREE_EVENTS)[number];
export interface LfTreeEventPayload
  extends LfEventPayload<"LfTree", LfTreeEvent> {
  node?: LfDataNode;
}
export interface LfTreeEventArguments {
  expansion?: boolean;
  node?: LfDataNode;
  selected?: boolean;
}
//#endregion

//#region Internal usage
export interface LfTreeNodeProps {
  accordionLayout: boolean;
  depth: number;
  elements: { ripple: VNode; value: VNode };
  events: {
    onClick: (event: MouseEvent) => void;
    onClickExpand: (event: MouseEvent) => void;
    onPointerDown: (event: MouseEvent) => void;
  };
  expanded: boolean;
  manager: LfFrameworkInterface;
  node: LfDataNode;
  selected: boolean;
}
export interface LfTreeTraversedNode {
  node: LfDataNode;
  depth: number;
  expanded: boolean;
  hidden: boolean;
  selected: boolean;
}
//#endregion

//#region Props
export interface LfTreePropsInterface {
  lfAccordionLayout?: boolean;
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfFilter?: boolean;
  lfInitialExpansionDepth?: number;
  lfGrid?: boolean;
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
}
//#endregion
