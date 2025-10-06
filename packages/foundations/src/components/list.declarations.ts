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
    LfListPropsInterface {}
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
  lfNavigation?: boolean;
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion
