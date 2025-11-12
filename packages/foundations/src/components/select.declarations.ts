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
  LfTextfieldInterface,
} from "./textfield.declarations";

//#region Interface
export interface LfSelectInterface
  extends LfComponent<"LfSelect">,
    LfSelectPropsInterface {
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
  isDisabled: () => boolean;
  isOpen: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  parts: typeof LF_SELECT_PARTS;
  selectedNode: () => LfDataNode | null;
}

export type LfSelectAdapterInitializerGetters = Pick<
  LfSelectAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "isDisabled"
  | "isOpen"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "selectedNode"
>;

export interface LfSelectAdapterControllerSetters {
  select: {
    open: (open: boolean) => void;
    value: (id: string) => void;
  };
}

export type LfSelectAdapterInitializerSetters = Pick<
  LfSelectAdapterControllerSetters,
  "select"
>;

export interface LfSelectAdapterJsx {
  list: () => VNode | null;
  textfield: () => VNode;
}

export interface LfSelectAdapterRefs {
  list: LfListElement;
  textfield: LfTextfieldElement;
}

export interface LfSelectAdapterHandlers {
  list: (event: LfEvent<LfListEventPayload>) => Promise<void>;
  textfield: (event: LfEvent<LfEventPayload<"LfTextfield">>) => Promise<void>;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-select`.
 */
export type LfSelectEvent = (typeof LF_SELECT_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-select` events.
 */
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
  lfStyle?: string;
  lfTextfieldProps?: Partial<LfTextfieldInterface>;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string | number;
}
//#endregion
