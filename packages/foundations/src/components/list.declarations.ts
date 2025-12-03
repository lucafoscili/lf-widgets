import { CY_ATTRIBUTES, LF_ATTRIBUTES, VNode } from "../foundations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_LIST_BLOCKS,
  LF_LIST_EVENTS,
  LF_LIST_PARTS,
} from "./list.constants";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
} from "./textfield.declarations";

//#region Class
export interface LfListInterface
  extends LfComponent<"LfList">,
    LfListPropsInterface {
  applyFilter: (value: string) => Promise<void>;
  focusNext: () => Promise<void>;
  focusPrevious: () => Promise<void>;
  getSelected: () => Promise<LfDataNode>;
  selectNode: (idx: number) => Promise<void>;
  selectNodeById: (id: string) => Promise<void>;
  setFilter: (value: string) => Promise<void>;
}
export interface LfListElement
  extends HTMLStencilElement,
    Omit<LfListInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfListEvent = (typeof LF_LIST_EVENTS)[number];
export interface LfListEventPayload
  extends LfEventPayload<"LfList", LfListEvent> {
  node: LfDataNode;
}
//#endregion

//#region Adapter
export interface LfListAdapter {
  controller: {
    get: LfListAdapterControllerGetters;
    set: LfListAdapterControllerSetters;
  };
  elements: {
    jsx: LfListAdapterJsx;
    refs: LfListAdapterRefs;
  };
  handlers: LfListAdapterHandlers;
}
export interface LfListAdapterControllerGetters {
  blocks: typeof LF_LIST_BLOCKS;
  compInstance: LfListInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  filterValue: () => string;
  focused: () => number;
  hiddenNodes: () => Set<LfDataNode>;
  indexById: (id: string) => number;
  isDisabled: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  nodeById: (id: string) => LfDataNode | undefined;
  parts: typeof LF_LIST_PARTS;
  selected: () => number;
}
export type LfListAdapterInitializerGetters = Pick<
  LfListAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "filterValue"
  | "focused"
  | "hiddenNodes"
  | "indexById"
  | "isDisabled"
  | "lfAttributes"
  | "manager"
  | "nodeById"
  | "parts"
  | "selected"
>;
export interface LfListAdapterControllerSetters {
  filter: {
    debounce: (value: string) => void;
    setValue: (value: string) => void;
  };
}
export type LfListAdapterInitializerSetters = Pick<
  LfListAdapterControllerSetters,
  "filter"
>;
export interface LfListAdapterJsx {
  deleteIcon: (node: LfDataNode) => VNode | null;
  filter: () => VNode | null;
  icon: (node: LfDataNode) => VNode;
  node: (node: LfDataNode, index: number, isSelected: boolean) => VNode;
  subtitle: (node: LfDataNode) => VNode;
  title: (node: LfDataNode) => VNode;
}
export interface LfListAdapterRefs {
  deleteIcon: HTMLElement | null;
  filter: LfTextfieldElement | null;
  icon: HTMLElement | null;
  node: HTMLElement | null;
  subtitle: HTMLElement | null;
  title: HTMLElement | null;
}
//#endregion

//#region Handlers
export interface LfListAdapterHandlers {
  deleteIcon: (event: MouseEvent, node: LfDataNode) => Promise<void>;
  filter: (event: CustomEvent<LfTextfieldEventPayload>) => Promise<void>;
  node: {
    blur: (event: FocusEvent, node: LfDataNode, index: number) => Promise<void>;
    click: (
      event: MouseEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
    focus: (
      event: FocusEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
    pointerdown: (
      event: PointerEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
  };
}
//#endregion

//#region Props
export interface LfListPropsInterface {
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfEnableDeletions?: boolean;
  lfFilter?: boolean;
  lfNavigation?: boolean;
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion
