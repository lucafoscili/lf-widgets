import { LfIconType } from "../foundations";
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
/**
 * Primary interface implemented by the `lf-button` component. It merges the shared component contract with the component-specific props.
 */
export interface LfButtonInterface
  extends LfComponent<"LfButton">,
    LfButtonPropsInterface {
  setMessage: (
    label?: string,
    icon?: LfIconType,
    timeout?: number,
  ) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-button`.
 */
export interface LfButtonElement
  extends HTMLStencilElement,
    Omit<LfButtonInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-button` into host integrations.
 */
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
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfButtonAdapterRefs extends LfComponentAdapterRefs {
  button: HTMLButtonElement;
  dropdown: HTMLButtonElement;
  icon: HTMLButtonElement;
  list: LfListElement;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfButtonAdapterJsx extends LfComponentAdapterJsx {
  button: () => VNode;
  dropdown: () => VNode;
  icon: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfButtonAdapterHandlers extends LfComponentAdapterHandlers {
  list: (e: LfEvent<LfListEventPayload>) => void;
}
/**
 * Subset of adapter getters required during initialisation.
 */
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
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
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
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfButtonAdapterControllerSetters
  extends LfComponentAdapterSetters {
  list: (state?: "close" | "open" | "toggle") => void;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-button`.
 */
export type LfButtonEvent = (typeof LF_BUTTON_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-button` events.
 */
export interface LfButtonEventPayload
  extends LfEventPayload<"LfButton", LfButtonEvent> {
  value: string;
  valueAsBoolean: boolean;
}
//#endregion

//#region States
/**
 * Union of runtime states declared in `LF_BUTTON_STATE`.
 */
export type LfButtonState = (typeof LF_BUTTON_STATE)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-button` component.
 */
export interface LfButtonPropsInterface {
  lfAriaLabel?: string;
  lfDataset?: LfDataDataset;
  lfIcon?: LfIconType | null;
  lfIconOff?: LfIconType | null;
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
/**
 * Union of styling tokens listed in `LF_BUTTON_STYLINGS`.
 */
export type LfButtonStyling = (typeof LF_BUTTON_STYLINGS)[number];
/**
 * Union of type identifiers defined in `LF_BUTTON_TYPES`.
 */
export type LfButtonType = (typeof LF_BUTTON_TYPES)[number];
//#endregion
