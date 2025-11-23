import { CY_ATTRIBUTES, LF_ATTRIBUTES } from "../foundations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_AUTOCOMPLETE_BLOCKS,
  LF_AUTOCOMPLETE_EVENTS,
  LF_AUTOCOMPLETE_PARTS,
} from "./autocomplete.constants";
import {
  LfListElement,
  LfListEventPayload,
  LfListInterface,
} from "./list.declarations";
import { LfSpinnerElement, LfSpinnerInterface } from "./spinner.declarations";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
  LfTextfieldInterface,
} from "./textfield.declarations";

//#region Interface
export interface LfAutocompleteInterface
  extends LfComponent<"LfAutocomplete">,
    LfAutocompletePropsInterface {
  clearCache: () => Promise<void>;
  clearInput: () => Promise<void>;
  getValue: () => Promise<string>;
  setValue: (value: string) => Promise<void>;
}
export interface LfAutocompleteElement
  extends HTMLStencilElement,
    Omit<LfAutocompleteInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
export interface LfAutocompleteAdapter {
  controller: {
    get: LfAutocompleteAdapterControllerGetters;
    set: LfAutocompleteAdapterControllerSetters;
  };
  elements: {
    jsx: LfAutocompleteAdapterJsx;
    refs: LfAutocompleteAdapterRefs;
  };
  handlers: LfAutocompleteAdapterHandlers;
}
export interface LfAutocompleteAdapterControllerGetters {
  blocks: typeof LF_AUTOCOMPLETE_BLOCKS;
  cache: () => Map<string, { dataset: LfDataDataset; timestamp: number }>;
  compInstance: LfAutocompleteInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  hasCache: () => boolean;
  highlightedIndex: () => number;
  indexById: (id: string) => number;
  inputValue: () => string;
  isDisabled: () => boolean;
  isLoading: () => boolean;
  lfAllowFreeInput: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  lfDataset: () => LfDataDataset;
  manager: LfFrameworkInterface;
  parts: typeof LF_AUTOCOMPLETE_PARTS;
  selectedNode: () => LfDataNode | null;
}
export type LfAutocompleteAdapterInitializerGetters = Pick<
  LfAutocompleteAdapterControllerGetters,
  | "blocks"
  | "cache"
  | "compInstance"
  | "cyAttributes"
  | "hasCache"
  | "highlightedIndex"
  | "indexById"
  | "inputValue"
  | "isDisabled"
  | "isLoading"
  | "lfAllowFreeInput"
  | "lfAttributes"
  | "lfDataset"
  | "manager"
  | "parts"
  | "selectedNode"
>;
export interface LfAutocompleteAdapterControllerSetters {
  blurTimeout: {
    clear: () => void;
    new: (callback: () => void, delay?: number) => void;
  };
  dataset: (dataset: LfDataDataset | null) => void;
  highlight: (index: number) => void;
  input: (value: string) => Promise<void>;
  list: (state?: "toggle" | "open" | "close") => void;
  select: (node: LfDataNode) => Promise<void>;
}
export type LfAutocompleteAdapterInitializerSetters = Pick<
  LfAutocompleteAdapterControllerSetters,
  "blurTimeout" | "dataset" | "input" | "select" | "highlight"
>;
export interface LfAutocompleteAdapterJsx {
  dropdown: () => VNode;
  textfield: () => VNode;
}
export interface LfAutocompleteAdapterRefs {
  autocomplete: HTMLDivElement;
  dropdown: HTMLElement;
  list: LfListElement;
  spinner: LfSpinnerElement;
  textfield: LfTextfieldElement;
}
export interface LfAutocompleteAdapterHandlers {
  list: (event: LfEvent<LfListEventPayload>) => Promise<void>;
  textfield: (event: LfEvent<LfTextfieldEventPayload>) => Promise<void>;
}
//#endregion

//#region Events
export type LfAutocompleteEvent = (typeof LF_AUTOCOMPLETE_EVENTS)[number];
export interface LfAutocompleteEventPayload
  extends LfEventPayload<"LfAutocomplete", LfAutocompleteEvent> {
  node?: LfDataNode;
  query?: string;
}
//#endregion

//#region Props
export interface LfAutocompletePropsInterface {
  lfAllowFreeInput?: boolean;
  lfCache?: boolean;
  lfCacheTTL?: number;
  lfDataset?: LfDataDataset;
  lfDebounceMs?: number;
  lfListProps?: Partial<LfListInterface>;
  lfMaxCacheSize?: number;
  lfMinChars?: number;
  lfNavigation?: boolean;
  lfSpinnerProps?: Partial<LfSpinnerInterface>;
  lfStyle?: string;
  lfTextfieldProps?: Partial<LfTextfieldInterface>;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
export type LfAutocompleteCache = Map<string, LfAutocompleteCacheEntry>;
export type LfAutocompleteCacheEntry = {
  dataset: LfDataDataset;
  timestamp: number;
};
//#endregion
