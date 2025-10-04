import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import {
  LF_TYPEWRITER_CURSORS,
  LF_TYPEWRITER_EVENTS,
  LF_TYPEWRITER_TAGS,
} from "./typewriter.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-typewriter` component. It merges the shared component contract with the component-specific props.
 */
export interface LfTypewriterInterface
  extends LfComponent<"LfTypewriter">,
    LfTypewriterPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-typewriter`.
 */
export interface LfTypewriterElement
  extends HTMLStencilElement,
    Omit<LfTypewriterInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-typewriter`.
 */
export type LfTypewriterEvent = (typeof LF_TYPEWRITER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-typewriter` events.
 */
export interface LfTypewriterEventPayload
  extends LfEventPayload<"LfTypewriter", LfTypewriterEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-typewriter` component.
 */
export interface LfTypewriterPropsInterface {
  lfCursor?: LfTypewriterCursor;
  lfDeleteSpeed?: number;
  lfLoop?: boolean;
  lfPause?: number;
  lfSpeed?: number;
  lfStyle?: string;
  lfTag?: LfTypewriterTag;
  lfUiSize?: LfThemeUISize;
  lfUpdatable?: boolean;
  lfValue?: LfTypewriterValue;
}
/**
 * Utility type used by the `lf-typewriter` component.
 */
export type LfTypewriterCursor = (typeof LF_TYPEWRITER_CURSORS)[number];
/**
 * Utility type used by the `lf-typewriter` component.
 */
export type LfTypewriterTag = (typeof LF_TYPEWRITER_TAGS)[number];
/**
 * Utility type used by the `lf-typewriter` component.
 */
export type LfTypewriterValue = string | string[];
//#endregion
