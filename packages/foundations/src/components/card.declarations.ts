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
import { LfThemeUISize, LfThemeUIState } from "../framework";
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
/**
 * Primary interface implemented by the `lf-card` component. It merges the shared component contract with the component-specific props.
 */
export interface LfCardInterface
  extends LfComponent<"LfCard">,
    LfCardPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-card`.
 */
export interface LfCardElement
  extends HTMLStencilElement,
    Omit<LfCardInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-card` into host integrations.
 */
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
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfCardAdapterJsx extends LfComponentAdapterJsx {
  layouts: { [K in LfCardLayout]: () => VNode };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
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
/**
 * Handler map consumed by the adapter to react to framework events.
 */
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
/**
 * Subset of adapter getters required during initialisation.
 */
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
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
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
/**
 * Component-specific defaults used when instantiating adapter-managed layouts.
 */
export type LfCardAdapterDefaults = {
  [K in LfCardLayout]: LfDataShapeDefaults;
};
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-card`.
 */
export type LfCardEvent = (typeof LF_CARD_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-card` events.
 */
export interface LfCardEventPayload
  extends LfEventPayload<"LfCard", LfCardEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-card` component.
 */
export interface LfCardPropsInterface {
  lfDataset?: LfDataDataset;
  lfLayout?: LfCardLayout;
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
/**
 * Union of layouts listed in `LF_CARD_LAYOUTS`.
 */
export type LfCardLayout = (typeof LF_CARD_LAYOUTS)[number];
//#endregion
