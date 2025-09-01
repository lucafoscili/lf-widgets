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
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_BUTTON_BLOCKS,
  LF_BUTTON_EVENTS,
  LF_BUTTON_PARTS,
  LF_BUTTON_STATE,
  LF_BUTTON_STYLINGS,
  LF_BUTTON_TYPES,
} from "./button.constants";
import { LfListElement, LfListEventPayload } from "./list.declarations";

//#region Class
export interface LfButtonInterface
  extends LfComponent<"LfButton">,
    LfButtonPropsInterface {
  setMessage: (
    label?: string,
    icon?: string,
    timeout?: number,
  ) => Promise<void>;
}
export interface LfButtonElement
  extends HTMLStencilElement,
    Omit<LfButtonInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
export interface LfButtonAdapter extends LfComponentAdapter<LfButtonInterface> {
  controller: {
    get: LfButtonAdapterControllerGetters;
    set: LfButtonAdapterControllerSetters;
  };
  elements: {
    jsx: LfButtonAdapterJsx;
    refs: LfButtonAdapterRefs;
  };
  handlers: LfButtonAdapterHandlers;
}
export interface LfButtonAdapterRefs extends LfComponentAdapterRefs {
  button: HTMLButtonElement;
  dropdown: HTMLButtonElement;
  dropdownRipple: HTMLDivElement;
  icon: HTMLButtonElement;
  list: LfListElement;
  ripple: HTMLDivElement;
}
export interface LfButtonAdapterJsx extends LfComponentAdapterJsx {
  button: () => VNode;
  dropdown: () => VNode;
  icon: () => VNode;
}
export interface LfButtonAdapterHandlers extends LfComponentAdapterHandlers {
  list: (e: LfEvent<LfListEventPayload>) => void;
}
export type LfButtonAdapterInitializerGetters = Pick<
  LfButtonAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "isDisabled"
  | "isDropdown"
  | "isOn"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "styling"
>;
export interface LfButtonAdapterControllerGetters
  extends LfComponentAdapterGetters<LfButtonInterface> {
  blocks: typeof LF_BUTTON_BLOCKS;
  compInstance: LfButtonInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  isDisabled: () => boolean;
  isDropdown: () => boolean;
  isOn: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  parts: typeof LF_BUTTON_PARTS;
  styling: () => LfButtonStyling;
}
export interface LfButtonAdapterControllerSetters
  extends LfComponentAdapterSetters {
  list: (state?: "close" | "open" | "toggle") => void;
}
//#endregion

//#region Events
export type LfButtonEvent = (typeof LF_BUTTON_EVENTS)[number];
export interface LfButtonEventPayload
  extends LfEventPayload<"LfButton", LfButtonEvent> {
  value: string;
  valueAsBoolean: boolean;
}
//#endregion

//#region States
export type LfButtonState = (typeof LF_BUTTON_STATE)[number];
//#endregion

//#region Props
export interface LfButtonPropsInterface {
  lfAriaLabel?: string;
  lfDataset?: LfDataDataset;
  lfIcon?: string;
  lfIconOff?: string;
  lfLabel?: string;
  lfRipple?: boolean;
  lfShowSpinner?: boolean;
  lfStretchX?: boolean;
  lfStretchY?: boolean;
  lfStyle?: string;
  lfStyling?: LfButtonStyling;
  lfToggable?: boolean;
  lfTrailingIcon?: boolean;
  lfType?: LfButtonType;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: boolean;
}
export type LfButtonStyling = (typeof LF_BUTTON_STYLINGS)[number];
export type LfButtonType = (typeof LF_BUTTON_TYPES)[number];
//#endregion
