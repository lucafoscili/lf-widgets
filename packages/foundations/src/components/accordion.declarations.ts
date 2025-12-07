import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_ACCORDION_EVENTS } from "./accordion.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-accordion` component. It merges the shared component contract with the component-specific props.
 */
export interface LfAccordionInterface
  extends LfComponent<"LfAccordion">,
    LfAccordionPropsInterface {
  getExpandedNodes: () => Promise<Set<string>>;
}
/**
 * DOM element type for the custom element registered as `lf-accordion`.
 */
export interface LfAccordionElement
  extends HTMLStencilElement,
    Omit<LfAccordionInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-accordion`.
 */
export type LfAccordionEvent = (typeof LF_ACCORDION_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-accordion` events.
 */
export interface LfAccordionEventPayload
  extends LfEventPayload<"LfAccordion", LfAccordionEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-accordion` component.
 */
export interface LfAccordionPropsInterface {
  lfDataset?: LfDataDataset;
  lfExpanded?: string[];
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
//#endregion
