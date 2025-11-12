import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_LIST_EVENTS } from "./list.constants";

//#region Component
/**
 * Primary interface implemented by the `lf-list` component. It merges the shared component contract with the component-specific props.
 */
export interface LfListInterface
  extends LfComponent<"LfList">,
    LfListPropsInterface {
  applyFilter: (value: string) => Promise<void>;
  focusNext: () => Promise<void>;
  focusPrevious: () => Promise<void>;
  getSelected: () => Promise<LfDataNode>;
  selectNode: (idx: number) => Promise<void>;
  selectNodeById: (id: string) => Promise<void>;
  setFilterValue: (value: string) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-list`.
 */
export interface LfListElement
  extends HTMLStencilElement,
    Omit<LfListInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-list`.
 */
export type LfListEvent = (typeof LF_LIST_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-list` events.
 */
export interface LfListEventPayload
  extends LfEventPayload<"LfList", LfListEvent> {
  node: LfDataNode;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-list` component.
 */
export interface LfListPropsInterface {
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfEnableDeletions?: boolean;
  lfFilter?: boolean; // NEW
  lfFilterPlaceholder?: string; // NEW
  lfNavigation?: boolean;
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion

//#region Adapter
/**
 * Root adapter structure following the canonical pattern.
 */
export interface LfListAdapter {
  controller: {
    get: LfListAdapterGettersGlobal;
    set: LfListAdapterSetters;
  };
  elements: {
    jsx: LfListAdapterJsx;
    refs: LfListAdapterRefs;
  };
  handlers: LfListAdapterHandlers;
}

//#region Controller - Getters
/**
 * Top-level getters passed to adapter initializer.
 */
export interface LfListAdapterInitializerGetters {
  blocks: typeof import("./list.constants").LF_LIST_BLOCKS;
  compInstance: LfListInterface;
  cyAttributes: Record<string, string>;
  filterValue: () => string; // NEW
  hiddenNodes: () => Set<LfDataNode>; // NEW
  isDisabled: () => boolean;
  lfAttributes: Record<string, string>;
  manager: any; // LfFrameworkInterface
  parts: typeof import("./list.constants").LF_LIST_PARTS;
}

/**
 * Global getters structure (direct pass-through).
 */
export interface LfListAdapterGettersGlobal
  extends LfListAdapterInitializerGetters {
  // filterValue and hiddenNodes are already included in initializer
}

//#endregion

//#region Controller - Setters
/**
 * Mutators for component state.
 */
export interface LfListAdapterSetters {
  filter: {
    apply: (value: string) => void; // NEW
    setValue: (value: string) => void; // NEW
  };
}
//#endregion

//#endregion

//#region Elements - JSX
/**
 * Pure VNode producers for rendering.
 */
export interface LfListAdapterJsx {
  filter: () => any; // VNode; // NEW
  // ... existing methods would go here
}
//#endregion

//#region Elements - Refs
/**
 * Element handles for DOM access.
 */
export interface LfListAdapterRefs {
  filter: any; // HTMLLfTextfieldElement | null; // NEW
  // ... existing refs would go here
}
//#endregion

//#region Handlers
/**
 * UI callbacks that funnel to onLfEvent.
 */
export interface LfListAdapterHandlers {
  filter: (event: CustomEvent) => Promise<void>; // NEW
  // ... existing handlers would go here
}
//#endregion
