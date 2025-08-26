import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import { LF_TREE_EVENTS } from "./tree.constants";

//#region Class
export interface LfTreeInterface
  extends LfComponent<"LfTree">,
    LfTreePropsInterface {}
export interface LfTreeElement
  extends HTMLStencilElement,
    Omit<LfTreeInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfTreeEvent = (typeof LF_TREE_EVENTS)[number];
export interface LfTreeEventPayload
  extends LfEventPayload<"LfTree", LfTreeEvent> {
  node?: LfDataNode;
}
export interface LfTreeEventArguments {
  expansion?: boolean;
  node?: LfDataNode;
}
//#endregion

//#region Internal usage
export interface LfTreeNodeProps {
  accordionLayout: boolean;
  depth: number;
  elements: { ripple: VNode; value: VNode };
  events: {
    onClick: (event: MouseEvent) => void;
    onClickExpand: (event: MouseEvent) => void;
    onPointerDown: (event: MouseEvent) => void;
  };
  expanded: boolean;
  manager: LfFrameworkInterface;
  node: LfDataNode;
  selected: boolean;
}
//#endregion

//#region Props
export interface LfTreePropsInterface {
  lfAccordionLayout?: boolean;
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfFilter?: boolean;
  lfInitialExpansionDepth?: number;
  lfGrid?: boolean;
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
}
//#endregion
