import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  LfComponentName,
  LfComponentProps,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeIcon } from "../framework/theme.declarations";
import {
  LF_PLACEHOLDER_EVENTS,
  LF_PLACEHOLDER_TRIGGERS,
} from "./placeholder.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-placeholder` component. It merges the shared component contract with the component-specific props.
 */
export interface LfPlaceholderInterface
  extends LfComponent<"LfPlaceholder">,
    LfPlaceholderPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-placeholder`.
 */
export interface LfPlaceholderElement
  extends HTMLStencilElement,
    Omit<LfPlaceholderInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-placeholder`.
 */
export type LfPlaceholderEvent = (typeof LF_PLACEHOLDER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-placeholder` events.
 */
export interface LfPlaceholderEventPayload
  extends LfEventPayload<"LfPlaceholder", LfPlaceholderEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-placeholder` component.
 */
export interface LfPlaceholderPropsInterface {
  lfIcon?: LfThemeIcon;
  lfProps?: LfComponentProps;
  lfStyle?: string;
  lfThreshold?: number;
  lfTrigger?: LfPlaceholderTrigger;
  lfValue?: LfComponentName;
}
/**
 * Utility type used by the `lf-placeholder` component.
 */
export type LfPlaceholderTrigger = (typeof LF_PLACEHOLDER_TRIGGERS)[number];
//#endregion
