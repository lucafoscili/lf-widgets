import type { ECElementEvent } from "echarts";
import { CY_ATTRIBUTES, LF_ATTRIBUTES } from "./components.constants";
import { LfComponent, VNode } from "./components.declarations";
import { LfEvent, LfEventPayload } from "./events.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";

//#region Dispatcher
/**
 * Payload subset accepted as `detail` by adapter dispatchers.
 *
 * Removes framework-populated fields (`comp`, `id`, `eventType`) so callers only provide
 * contextual data such as `originalEvent` or component-specific extras.
 */
export type LfComponentAdapterDispatchDetail<P extends LfEventPayload> =
  Partial<Omit<P, "comp" | "eventType" | "id">>;
/**
 * Resolves the payload variant for a specific event type when payloads are represented
 * as discriminated unions.
 */
export type LfComponentAdapterPayloadForEvent<
  P extends LfEventPayload,
  E extends P["eventType"],
> = [Extract<P, { eventType: E }>] extends [never]
  ? P
  : Extract<P, { eventType: E }>;
/**
 * Resolves the `detail` signature for a specific event type.
 */
export type LfComponentAdapterDispatchDetailForEvent<
  P extends LfEventPayload,
  E extends P["eventType"],
> = LfComponentAdapterDispatchDetail<LfComponentAdapterPayloadForEvent<P, E>>;
/**
 * Optional overrides that allow adapters to provide event-specific `detail` typing.
 *
 * If an event key is present, its value becomes the `detail` type for that `emit` call.
 * Otherwise the dispatcher falls back to `LfComponentAdapterDispatchDetailForEvent`.
 */
export type LfComponentAdapterDispatcherDetailOverrides<
  P extends LfEventPayload,
> = {
  [E in P["eventType"]]?: LfComponentAdapterDispatchDetailForEvent<P, E>;
};
/**
 * Canonical dispatcher contract for adapter-driven event emission.
 *
 * Supports event-specific `detail` typing through discriminated payload unions and/or
 * explicit override maps.
 *
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfComponentAdapterDispatcher<
  P extends LfEventPayload = LfEventPayload,
  Overrides extends LfComponentAdapterDispatcherDetailOverrides<P> = {},
> = {
  emit: <E extends P["eventType"]>(
    eventType: E,
    detail?: E extends keyof Overrides
      ? Required<Overrides>[E]
      : LfComponentAdapterDispatchDetailForEvent<P, E>,
  ) => void;
};
//#endregion

//#region Adapter
/**
 * Canonical adapter interface that wires a Web Component into host integrations.
 *
 * v4.0.0 Architecture:
 * - `controller.get`: Read-only state accessors (ALL must be functions `() => T`)
 * - `controller.set`: Simple single-value assignments
 * - `controller.computed`: Derived values, predicates, builders (pure functions)
 * - `controller.actions`: Complex multi-step operations
 * - `elements.jsx`: Pure VNode factories
 * - `elements.refs`: DOM reference registry
 * - `dispatcher`: REQUIRED - centralized event emission
 * - `handlers`: Event callbacks
 *
 * @template C Component interface type
 * @template P Event payload type for dispatcher typing (defaults to LfEventPayload for backwards compatibility)
 * @template H Handler map shape
 * @template J JSX factory shape
 * @template R Refs registry shape
 * @template CGet Controller getters shape
 * @template CSet Controller setters shape
 * @template CComputed Controller computed shape
 * @template CActions Controller actions shape
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfComponentAdapter<
  C extends LfComponent,
  P extends LfEventPayload = LfEventPayload,
  H = LfComponentAdapterHandlers,
  J = LfComponentAdapterJsx,
  R = LfComponentAdapterRefs,
  CGet = LfComponentAdapterGetters<C>,
  CSet = LfComponentAdapterSetters,
  CComputed = LfComponentAdapterComputed,
  CActions = LfComponentAdapterActions,
> {
  /**
   * Controller namespace containing state accessors and mutators.
   */
  controller: {
    /**
     * Read-only state accessors. ALL values MUST be functions `() => T`.
     * Includes base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
     * plus component-specific state reads.
     */
    get: CGet;
    /**
     * Simple single-value assignments. Each setter performs ONE state change.
     */
    set?: CSet;
    /**
     * Derived values, predicates, and builders. Pure functions that compute from state.
     * Examples: `isDisabled()`, `isExpanded(node)`, `buildOptions()`.
     */
    computed?: CComputed;
    /**
     * Complex multi-step operations. May have side effects, async, batch changes.
     * Examples: `toggle()`, `expandAll()`, `submitForm()`.
     */
    actions?: CActions;
  };
  /**
   * Element-related factories and references.
   * REQUIRED for v4.0.0 compliant components.
   */
  elements?: {
    /**
     * Pure JSX factories that produce VNode fragments.
     */
    jsx: J;
    /**
     * DOM reference registry. Values are `HTMLElement | null` or `Map<string, HTMLElement>`.
     */
    refs: R;
  };
  /**
   * Centralized event emission for the component.
   * All interactions route through `dispatcher.emit(eventType, detail)`.
   * REQUIRED for v4.0.0 compliant components.
   *
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  dispatcher?: LfComponentAdapterDispatcher<P>;
  /**
   * Event handlers and callbacks for DOM/framework events.
   */
  handlers?: H;
}
//#endregion

//#region Handlers
/**
 * Function signature shared by every adapter handler.
 *
 * Handlers receive the originating DOM or framework event along with optional
 * positional arguments and may resolve synchronously or asynchronously.
 */
export type LfComponentAdapterHandler = (
  e?: ECElementEvent | Event | PointerEvent | LfEvent,
  ...args: unknown[]
) => unknown | Promise<unknown>;
/**
 * Nested dictionary of adapter handlers grouped by namespace keys.
 *
 * The recursive shape lets adapters organise handlers without losing type safety.
 */
export type LfComponentAdapterHandlers = {
  [key: string]: LfComponentAdapterHandler | LfComponentAdapterHandlers;
};
//#endregion

//#region Elements
/**
 * Dictionary of JSX factory helpers that generate Stencil `VNode` fragments.
 *
 * Entries may be render helpers or nested namespaces of helpers.
 * Functions can return single VNode or VNode[] (for cases like siblings with separators).
 */
export type LfComponentAdapterJsx = {
  [key: string]:
    | ((...args: unknown[]) => VNode | VNode[] | null)
    | LfComponentAdapterJsx;
};
/**
 * Recursive dictionary of DOM references collected from the rendered tree.
 * All leaf values MUST be `HTMLElement | null` or `Map<string, HTMLElement>`.
 *
 * @see Section 5.7 of 4_0_0_REFACTORING.md
 */
export type LfComponentAdapterRefs = {
  [key: string]:
    | Map<string, HTMLElement>
    | HTMLElement
    | null
    | LfComponentAdapterRefs;
};
//#endregion

//#region Controller
/**
 * Base getters that ALL v4.0.0 compliant adapters MUST provide.
 * These are enforced by the type system and automatically included via extension.
 *
 * ALL values MUST be functions `() => T` to capture current state dynamically.
 *
 * @template C Component interface type
 * @template Blocks BEM blocks constant type
 * @template Ids Element IDs constant type
 * @template Parts CSS parts constant type
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfComponentAdapterBaseGetters<
  C extends LfComponent,
  Blocks extends Record<string, unknown> = Record<string, unknown>,
  Ids extends Record<string, unknown> = Record<string, unknown>,
  Parts extends Record<string, unknown> = Record<string, unknown>,
> {
  /** BEM block structure for the component */
  blocks: () => Blocks;
  /** Live component instance accessor */
  compInstance: () => C;
  /** Cypress test attributes */
  cyAttributes: () => typeof CY_ATTRIBUTES;
  /** Framework services (theme, data, effects, etc.) */
  framework: () => LfFrameworkInterface;
  /** Element ID constants */
  ids: () => Ids;
  /** LF data attributes */
  lfAttributes: () => typeof LF_ATTRIBUTES;
  /** CSS ::part() names */
  parts: () => Parts;
}
/**
 * Legacy controller getters interface for backwards compatibility.
 * Components being migrated to v4.0.0 should use LfComponentAdapterBaseGetters instead.
 *
 * @template C Component interface type
 * @template I Instance type (defaults to C)
 * @deprecated Use LfComponentAdapterBaseGetters for v4.0.0 compliant adapters
 */
export type LfComponentAdapterGetters<C extends LfComponent, I = C> = {
  [key: string]: unknown;
  /**
   * Live component instance (or accessor) forwarded to external controllers for
   * direct access to public methods or state.
   */
  compInstance: I;
};
/**
 * Controller setters for simple single-value assignments.
 * Each setter performs exactly ONE state change.
 */
export type LfComponentAdapterSetters = {
  [key: string]: ((...args: unknown[]) => void) | LfComponentAdapterSetters;
};
/**
 * Controller computed values - derived state, predicates, builders.
 * Pure functions that compute values from current state.
 * Examples: `isDisabled()`, `isExpanded(node)`, `buildLabel()`.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export type LfComponentAdapterComputed = {
  [key: string]: ((...args: unknown[]) => unknown) | LfComponentAdapterComputed;
};
/**
 * Controller actions for complex multi-step operations.
 * May have side effects, be async, or batch multiple state changes.
 * Examples: `toggle()`, `expandAll()`, `submitForm()`.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export type LfComponentAdapterActions = {
  [key: string]:
    | ((...args: unknown[]) => void | Promise<void>)
    | LfComponentAdapterActions;
};
//#endregion
