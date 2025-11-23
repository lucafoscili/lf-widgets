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
  LfListElement,
  LfListEventPayload,
  LfListInterface,
} from "./list.declarations";
import {
  LF_SELECT_BLOCKS,
  LF_SELECT_EVENTS,
  LF_SELECT_PARTS,
} from "./select.constants";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
  LfTextfieldInterface,
} from "./textfield.declarations";

//#region Interface
export interface LfSelectInterface
  extends LfComponent<"LfSelect">,
    LfSelectPropsInterface {
  getSelectedIndex: () => Promise<number>;
  getValue: () => Promise<LfDataNode>;
  setValue: (id: string) => Promise<void>;
}
export interface LfSelectElement
  extends HTMLStencilElement,
    Omit<LfSelectInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
export interface LfSelectAdapter {
  controller: {
    get: LfSelectAdapterControllerGetters;
    set: LfSelectAdapterControllerSetters;
  };
  elements: {
    jsx: LfSelectAdapterJsx;
    refs: LfSelectAdapterRefs;
  };
  handlers: LfSelectAdapterHandlers;
}
export interface LfSelectAdapterControllerGetters {
  blocks: typeof LF_SELECT_BLOCKS;
  compInstance: LfSelectInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  indexById: (id: string) => number;
  isDisabled: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  lfDataset: () => LfDataDataset;
  manager: LfFrameworkInterface;
  parts: typeof LF_SELECT_PARTS;
  selectedNode: () => LfDataNode | null;
}
export type LfSelectAdapterInitializerGetters = Pick<
  LfSelectAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "indexById"
  | "isDisabled"
  | "lfAttributes"
  | "lfDataset"
  | "manager"
  | "parts"
  | "selectedNode"
>;
export interface LfSelectAdapterControllerSetters {
  list: (state?: "toggle" | "open" | "close") => void;
  value: (id: string) => Promise<void>;
}
export type LfSelectAdapterInitializerSetters = Pick<
  LfSelectAdapterControllerSetters,
  "value"
>;
export interface LfSelectAdapterJsx {
  list: () => VNode | null;
  textfield: () => VNode;
}
export interface LfSelectAdapterRefs {
  list: LfListElement;
  select: HTMLDivElement;
  textfield: LfTextfieldElement;
}
export interface LfSelectAdapterHandlers {
  list: (event: LfEvent<LfListEventPayload>) => Promise<void>;
  textfield: (event: LfEvent<LfTextfieldEventPayload>) => Promise<void>;
}
//#endregion

//#region Events
export type LfSelectEvent = (typeof LF_SELECT_EVENTS)[number];
export interface LfSelectEventPayload
  extends LfEventPayload<"LfSelect", LfSelectEvent> {
  node?: LfDataNode;
  value?: string | number;
}
//#endregion

//#region Props
export interface LfSelectPropsInterface {
  lfDataset?: LfDataDataset;
  lfListProps?: Partial<LfListInterface>;
  lfNavigation?: boolean;
  lfStyle?: string;
  lfTextfieldProps?: Partial<LfTextfieldInterface>;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string | number;
}
//#endregion
