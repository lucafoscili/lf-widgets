import {
  LfComponentAdapter,
  LfComponentAdapterActions,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterComputed,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import {
  LF_ARTICLE_BLOCKS,
  LF_ARTICLE_EVENTS,
  LF_ARTICLE_IDS,
  LF_ARTICLE_PARTS,
  LF_ARTICLE_TAGNAMES,
} from "./article.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-article` component. It merges the shared component contract with the component-specific props.
 */
export interface LfArticleInterface
  extends LfComponent<"LfArticle">,
    LfArticlePropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfArticleEventPayload) => void;
  };
}
/**
 * DOM element type for the custom element registered as `lf-article`.
 */
export interface LfArticleElement
  extends HTMLStencilElement,
    Omit<LfArticleInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-article` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple assignments (if any)
 * - controller.computed: Derived predicates (hasNodes)
 * - controller.actions: Complex operations (if any)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks for LfShape events
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfArticleAdapter
  extends LfComponentAdapter<
    LfArticleInterface,
    LfArticleEventPayload,
    LfArticleAdapterHandlers,
    LfArticleAdapterJsx,
    LfArticleAdapterRefs,
    LfArticleAdapterControllerGetters,
    LfArticleAdapterControllerSetters,
    LfArticleAdapterControllerComputed,
    LfArticleAdapterControllerActions
  > {
  controller: {
    get: LfArticleAdapterControllerGetters;
    set?: LfArticleAdapterControllerSetters;
    computed: LfArticleAdapterControllerComputed;
    actions?: LfArticleAdapterControllerActions;
  };
  elements: {
    jsx: LfArticleAdapterJsx;
    refs: LfArticleAdapterRefs;
  };
  handlers: LfArticleAdapterHandlers;
  dispatcher: LfArticleAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_ARTICLE_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfArticleAdapterRefs extends LfComponentAdapterRefs {
  articles: Map<string, HTMLElement>;
  sections: Map<string, HTMLElement>;
  paragraphs: Map<string, HTMLElement>;
  contents: Map<string, HTMLElement>;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfArticleAdapterJsx extends LfComponentAdapterJsx {
  /** Main article container factory */
  article: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfArticleAdapterHandlers extends LfComponentAdapterHandlers {
  /** Forwards LfShape events through lf-event emission */
  shape: (e: LfEvent) => Promise<void>;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfArticleAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfArticleInterface,
    typeof LF_ARTICLE_BLOCKS,
    typeof LF_ARTICLE_IDS,
    typeof LF_ARTICLE_PARTS
  > {}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfArticleAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfArticleAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the dataset has any nodes to render */
  hasNodes: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfArticleAdapterControllerActions
  extends LfComponentAdapterActions {}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfArticleAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfArticleEventPayload>;
export type LfArticleAdapterDispatcherDetailOverrides = {
  [E in LfArticleEvent]: E extends "lf-event"
    ? LfArticleAdapterDispatchDetailBase & { originalEvent: LfEvent }
    : E extends "ready" | "unmount"
      ? Omit<LfArticleAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfArticleAdapterDispatchDetailBase;
};
export type LfArticleAdapterDispatcher = LfComponentAdapterDispatcher<
  LfArticleEventPayload,
  LfArticleAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Dataset
/**
 * Dataset wrapper consumed by the component for data-driven rendering.
 */
export interface LfArticleDataset extends LfDataDataset {
  /**
   * Ordered collection of root nodes that describe the article structure.
   *
   * Each entry is rendered sequentially and passed through the depth-specific
   * templates (article, section, paragraph, content) used by the component.
   */
  nodes?: LfArticleNode[];
}
/**
 * Tree node description used by the component in `lf-article`.
 */
export interface LfArticleNode extends LfDataNode {
  /**
   * Nested nodes that become sections, paragraphs, or wrapper content depending
   * on the traversal depth. Children retain their array order when rendered.
   */
  children?: LfArticleNode[];
  /**
   * Optional HTML tag applied when rendering this node.
   *
   * Without an override the component picks sensible defaults (for example
   * "div" wrappers or "span" leaf nodes). If any child declares the "li" tag
   * the parent automatically upgrades to a "ul" wrapper to keep the markup valid.
   */
  tagName?: (typeof LF_ARTICLE_TAGNAMES)[number];
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-article`.
 */
export type LfArticleEvent = (typeof LF_ARTICLE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-article` events.
 */
export interface LfArticleEventPayload
  extends LfEventPayload<"LfArticle", LfArticleEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-article` component.
 */
export interface LfArticlePropsInterface {
  /**
   * Hierarchical dataset that drives the rendered article. Nodes control
   * headings, wrapper elements, and the optional `LfShape` cells used for rich
   * content. When omitted or empty the component renders the empty state.
   */
  lfDataset?: LfArticleDataset;
  /**
   * Message displayed inside the empty-state container when no dataset nodes
   * are available. Defaults to "Empty data." in the Stencil implementation.
   */
  lfEmpty?: string;
  /**
   * Raw CSS string injected into the component shadow root. Use it to tweak
   * layout or typography without touching the global theme helpers.
   */
  lfStyle?: string;
  /**
   * The size of the component.
   */
  lfUiSize?: LfThemeUISize;
}
//#endregion
