import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_LIST_EVENTS } from "./list.constants";

//#region Component
export interface LfListInterface
  extends LfComponent<"LfList">,
    LfListPropsInterface {}
export interface LfListElement extends HTMLStencilElement, LfListInterface {}
//#endregion

//#region Events
export type LfListEvent = (typeof LF_LIST_EVENTS)[number];
export interface LfListEventPayload
  extends LfEventPayload<"LfList", LfListEvent> {
  node: LfDataNode;
}
//#endregion

//#region Props
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
