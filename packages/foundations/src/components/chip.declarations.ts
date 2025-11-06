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
/**
 * Primary interface implemented by the `lf-chip` component. It merges the shared component contract with the component-specific props.
 */
export interface LfChipInterface
  extends LfComponent<"LfChip">,
    LfChipPropsInterface {
  getSelectedNodes: () => Promise<Set<LfDataNode>>;
  setSelectedNodes: (
    nodes: (LfDataNode[] | string[]) & Array<any>,
  ) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-chip`.
 */
export interface LfChipElement
  extends HTMLStencilElement,
    Omit<LfChipInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-chip`.
 */
export type LfChipEvent = (typeof LF_CHIP_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-chip` events.
 */
export interface LfChipEventPayload
  extends LfEventPayload<"LfChip", LfChipEvent> {
  node: LfDataNode;
  selectedNodes: Set<LfDataNode>;
}
//#endregion

//#region Internal usage
/**
 * Utility interface used by the `lf-chip` component.
 */
export interface LfChipEventArguments {
  expansion?: boolean;
  node?: LfDataNode;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-chip` component.
 */
export interface LfChipPropsInterface {
  lfAriaLabel?: string;
  lfDataset?: LfDataDataset;
  lfFlat?: boolean;
  lfRipple?: boolean;
  lfShowSpinner?: boolean;
  lfStyle?: string;
  lfStyling?: LfChipStyling;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string[];
}
/**
 * Union of styling tokens listed in `LF_CHIP_STYLING`.
 */
export type LfChipStyling = (typeof LF_CHIP_STYLING)[number];
//#endregion
