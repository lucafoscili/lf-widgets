import {
  HTMLStencilElement, LfComponent,
  LfComponentName,
  LfComponentProps
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeIcon } from "../framework/theme.declarations";
import {
  LF_PLACEHOLDER_EVENTS,
  LF_PLACEHOLDER_TRIGGERS,
} from "./placeholder.constants";

//#region Class
export interface LfPlaceholderInterface
  extends LfComponent<"LfPlaceholder">,
    LfPlaceholderPropsInterface {}
export interface LfPlaceholderElement
  extends HTMLStencilElement,
    LfPlaceholderInterface {}
//#endregion

//#region Events
export type LfPlaceholderEvent = (typeof LF_PLACEHOLDER_EVENTS)[number];
export interface LfPlaceholderEventPayload
  extends LfEventPayload<"LfPlaceholder", LfPlaceholderEvent> {}
//#endregion

//#region Props
export interface LfPlaceholderPropsInterface {
  lfIcon?: LfThemeIcon;
  lfProps?: LfComponentProps;
  lfStyle?: string;
  lfThreshold?: number;
  lfTrigger?: LfPlaceholderTrigger;
  lfValue?: LfComponentName;
}
export type LfPlaceholderTrigger = (typeof LF_PLACEHOLDER_TRIGGERS)[number];
//#endregion
