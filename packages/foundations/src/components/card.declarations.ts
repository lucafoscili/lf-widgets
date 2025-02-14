import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
} from "../foundations/adapter.declarations";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
} from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import {
  LfDataDataset,
  LfDataShapeDefaults,
  LfDataShapesMap,
} from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_CARD_BLOCKS,
  LF_CARD_EVENTS,
  LF_CARD_LAYOUTS,
  LF_CARD_PARTS,
} from "./card.constants";
import { LfChipElement } from "./chip.declarations";
import { LfCodeElement, LfCodeEventPayload } from "./code.declarations";
import { LfListEventPayload } from "./list.declarations";
import { LfToggleElement, LfToggleEventPayload } from "./toggle.declarations";

//#region Class
export interface LfCardInterface
  extends LfComponent<"LfCard">,
    LfCardPropsInterface {}
export interface LfCardElement
  extends HTMLStencilElement,
    Omit<LfCardInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
export interface LfCardAdapter extends LfComponentAdapter<LfCardInterface> {
  controller: {
    get: LfCardAdapterControllerGetters;
  };
  elements: {
    jsx: LfCardAdapterJsx;
    refs: LfCardAdapterRefs;
  };
  handlers: LfCardAdapterHandlers;
}
export interface LfCardAdapterJsx extends LfComponentAdapterJsx {
  layouts: { [K in LfCardLayout]: () => VNode };
}
export interface LfCardAdapterRefs extends LfComponentAdapterRefs {
  layouts: {
    debug: {
      button: LfButtonElement;
      code: LfCodeElement;
      toggle: LfToggleElement;
    };
    keywords: {
      button: LfButtonElement;
      chip: LfChipElement;
    };
  };
}
export interface LfCardAdapterHandlers extends LfComponentAdapterHandlers {
  layouts: {
    debug: {
      button: (e: CustomEvent<LfButtonEventPayload>) => void;
      code: (e: CustomEvent<LfCodeEventPayload>) => void;
      list: (e: CustomEvent<LfListEventPayload>) => void;
      toggle: (e: CustomEvent<LfToggleEventPayload>) => void;
    };
    keywords: {
      button: (e: CustomEvent<LfButtonEventPayload>) => void;
    };
  };
}
export type LfCardAdapterInitializerGetters = Pick<
  LfCardAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "shapes"
>;
export interface LfCardAdapterControllerGetters
  extends LfComponentAdapterGetters<LfCardInterface> {
  blocks: typeof LF_CARD_BLOCKS;
  compInstance: LfCardInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  defaults: LfCardAdapterDefaults;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  parts: typeof LF_CARD_PARTS;
  shapes: () => LfDataShapesMap;
}
export type LfCardAdapterDefaults = {
  [K in LfCardLayout]: LfDataShapeDefaults;
};
//#endregion

//#region Events
export type LfCardEvent = (typeof LF_CARD_EVENTS)[number];
export interface LfCardEventPayload
  extends LfEventPayload<"LfCard", LfCardEvent> {}
//#endregion

//#region Props
export interface LfCardPropsInterface {
  lfDataset?: LfDataDataset;
  lfLayout?: LfCardLayout;
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
}
export type LfCardLayout = (typeof LF_CARD_LAYOUTS)[number];
//#endregion
