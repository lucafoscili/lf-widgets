import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import { LF_ATTRIBUTES } from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_BADGE_BLOCKS,
  LF_BADGE_EVENTS,
  LF_BADGE_PARTS,
  LF_BADGE_POSITIONS,
} from "./badge.constants";
import { LfImagePropsInterface } from "./image.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-badge` component. It merges the shared component contract with the component-specific props.
 */
export interface LfBadgeInterface
  extends LfComponent<"LfBadge">,
    LfBadgePropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-badge`.
 */
export interface LfBadgeElement
  extends HTMLStencilElement,
    Omit<LfBadgeInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-badge` into host integrations.
 */
export interface LfBadgeAdapter extends LfComponentAdapter<LfBadgeInterface> {
  controller: {
    get: LfBadgeAdapterControllerGetters;
    set: LfBadgeAdapterControllerSetters;
  };
  elements: {
    jsx: LfBadgeAdapterJsx;
    refs: LfBadgeAdapterRefs;
  };
  handlers: LfBadgeAdapterHandlers;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfBadgeAdapterRefs extends LfComponentAdapterRefs {
  badge: HTMLDivElement;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfBadgeAdapterJsx extends LfComponentAdapterJsx {
  badge: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfBadgeAdapterHandlers extends LfComponentAdapterHandlers {}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfBadgeAdapterInitializerGetters = Pick<
  LfBadgeAdapterControllerGetters,
  "blocks" | "compInstance" | "lfAttributes" | "manager" | "parts"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfBadgeAdapterControllerGetters
  extends LfComponentAdapterGetters<LfBadgeInterface> {
  blocks: typeof LF_BADGE_BLOCKS;
  compInstance: LfBadgeInterface;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  parts: typeof LF_BADGE_PARTS;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfBadgeAdapterControllerSetters
  extends LfComponentAdapterSetters {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-badge`.
 */
export type LfBadgeEvent = (typeof LF_BADGE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-badge` events.
 */
export interface LfBadgeEventPayload
  extends LfEventPayload<"LfBadge", LfBadgeEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-badge` component.
 */
export interface LfBadgePropsInterface {
  lfImageProps?: LfImagePropsInterface;
  lfLabel?: string;
  lfPosition?: LfBadgePositions;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
/**
 * Utility type used by the `lf-badge` component.
 */
export type LfBadgePositions = (typeof LF_BADGE_POSITIONS)[number];
//#endregion
