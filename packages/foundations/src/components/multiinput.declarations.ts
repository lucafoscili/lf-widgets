import { CY_ATTRIBUTES, LF_ATTRIBUTES, VNode } from "../foundations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LfChipElement,
  LfChipEventPayload,
  LfChipInterface,
} from "./chip.declarations";
import {
  LF_MULTIINPUT_BLOCKS,
  LF_MULTIINPUT_EVENTS,
  LF_MULTIINPUT_PARTS,
} from "./multiinput.constants";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
  LfTextfieldInterface,
} from "./textfield.declarations";

//#region Interface
export interface LfMultiInputInterface
  extends LfComponent<"LfMultiInput">,
    LfMultiInputPropsInterface {
  addToHistory: (value: string) => Promise<void>;
  getHistory: () => Promise<string[]>;
  getState: () => Promise<{ value: string; history: string[] }>;
  getValue: () => Promise<string>;
  setHistory: (values: string[]) => Promise<void>;
  setValue: (value: string) => Promise<void>;
}
export interface LfMultiInputElement
  extends HTMLStencilElement,
    Omit<LfMultiInputInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
export interface LfMultiInputAdapter {
  controller: {
    get: LfMultiInputAdapterControllerGetters;
    set: LfMultiInputAdapterControllerSetters;
  };
  elements: {
    jsx: LfMultiInputAdapterJsx;
    refs: LfMultiInputAdapterRefs;
  };
  handlers: LfMultiInputAdapterHandlers;
}
export interface LfMultiInputAdapterControllerGetters {
  blocks: typeof LF_MULTIINPUT_BLOCKS;
  compInstance: LfMultiInputInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  historyNodes: () => LfDataNode[];
  historyValues: () => string[];
  lfAttributes: typeof LF_ATTRIBUTES;
  lfDataset: () => LfDataDataset;
  isDisabled: () => boolean;
  manager: LfFrameworkInterface;
  parts: typeof LF_MULTIINPUT_PARTS;
  value: () => string;
}
export type LfMultiInputAdapterInitializerGetters = Pick<
  LfMultiInputAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "historyNodes"
  | "historyValues"
  | "isDisabled"
  | "lfAttributes"
  | "lfDataset"
  | "manager"
  | "parts"
  | "value"
>;
export interface LfMultiInputAdapterControllerSetters {
  history: (nodes: LfDataNode[]) => Promise<void>;
  value: (value: string) => Promise<void>;
}
export type LfMultiInputAdapterInitializerSetters = Pick<
  LfMultiInputAdapterControllerSetters,
  "history" | "value"
>;
export interface LfMultiInputAdapterJsx {
  chips: () => VNode | null;
  textfield: () => VNode;
}
export interface LfMultiInputAdapterRefs {
  chips: LfChipElement;
  textfield: LfTextfieldElement;
}
export interface LfMultiInputAdapterHandlers {
  chips: (event: LfEvent<LfChipEventPayload>) => Promise<void>;
  textfield: (event: LfEvent<LfTextfieldEventPayload>) => Promise<void>;
}
//#endregion

//#region Events
export type LfMultiInputEvent = (typeof LF_MULTIINPUT_EVENTS)[number];
export interface LfMultiInputEventPayload
  extends LfEventPayload<"LfMultiInput", LfMultiInputEvent> {
  node?: LfDataNode;
  value?: string;
}
//#endregion

//#region Props
export interface LfMultiInputPropsInterface {
  lfAllowFreeInput?: boolean;
  lfChipProps?: Partial<LfChipInterface>;
  lfDataset?: LfDataDataset;
  lfMaxHistory?: number;
  lfMode?: LfMultiInputMode;
  lfStyle?: string;
  lfTextfieldProps?: Partial<LfTextfieldInterface>;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
export type LfMultiInputMode = "history" | "tags";
//#endregion
