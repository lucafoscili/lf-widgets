import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_CHIP_EVENTS, LF_CHIP_STYLING } from "./chip.constants";

//#region Class
export interface LfChipInterface
  extends LfComponent<"LfChip">,
    LfChipPropsInterface {
  getSelectedNodes: () => Promise<Set<LfDataNode>>;
  setSelectedNodes: (
    nodes: (LfDataNode[] | string[]) & Array<any>,
  ) => Promise<void>;
}
export interface LfChipElement
  extends HTMLStencilElement,
    Omit<LfChipInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfChipEvent = (typeof LF_CHIP_EVENTS)[number];
export interface LfChipEventPayload
  extends LfEventPayload<"LfChip", LfChipEvent> {
  node: LfDataNode;
  selectedNodes: Set<LfDataNode>;
}
//#endregion

//#region Internal usage
export interface LfChipEventArguments {
  expansion?: boolean;
  node?: LfDataNode;
}
//#endregion

//#region Props
export interface LfChipPropsInterface {
  lfDataset?: LfDataDataset;
  lfRipple?: boolean;
  lfStyle?: string;
  lfStyling?: LfChipStyling;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string[];
}
export type LfChipStyling = (typeof LF_CHIP_STYLING)[number];
//#endregion
