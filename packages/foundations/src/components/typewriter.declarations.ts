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
export interface LfTypewriterInterface
  extends LfComponent<"LfTypewriter">,
    LfTypewriterPropsInterface {}
export interface LfTypewriterElement
  extends HTMLStencilElement,
    Omit<LfTypewriterInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfTypewriterEvent = (typeof LF_TYPEWRITER_EVENTS)[number];
export interface LfTypewriterEventPayload
  extends LfEventPayload<"LfTypewriter", LfTypewriterEvent> {}
//#endregion

//#region Props
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
export type LfTypewriterCursor = (typeof LF_TYPEWRITER_CURSORS)[number];
export type LfTypewriterTag = (typeof LF_TYPEWRITER_TAGS)[number];
export type LfTypewriterValue = string | string[];
//#endregion
