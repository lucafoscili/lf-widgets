import {
  LfArticleAdapter,
  LfArticleAdapterControllerGetters,
  LfArticleAdapterHandlers,
  LfArticleAdapterJsx,
  LfArticleAdapterRefs,
} from "@lf-widgets/foundations";
import { prepArticleComputed } from "./computed.article";
import { prepArticleJsx } from "./elements.article";
import { prepArticleHandlers } from "./handlers.article";

/**
 * Creates the canonical adapter for lf-article.
 *
 * "Adapter as Core" Architecture:
 * - Adapter OWNS the runtime state (not the WC)
 * - State is stored in closure variables (if any)
 * - `controller.get.*` reads from closure state + base getters
 * - `controller.set.*` writes to closure state AND calls `onStateChange()`
 * - `onStateChange` signals WC to increment its single `@State _renderTick`
 * - WC becomes a thin shell: lifecycle + HTML attribute interface + single render trigger
 *
 * Benefits:
 * - Predictable renders (explicit via onStateChange)
 * - Testable (adapter can be tested without DOM)
 * - Portable (adapter works with any renderer)
 * - Batch-friendly (actions can make multiple changes before calling onStateChange once)
 *
 * @param baseGetters - Base getters from createBaseGetters utility
 * @param onStateChange - Callback to trigger WC re-render (increments _renderTick)
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Complete adapter (without dispatcher - added by WC)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter Factory
export const createAdapter = (
  baseGetters: LfArticleAdapterControllerGetters,
  onStateChange: () => void,
  getAdapter: () => LfArticleAdapter,
): Omit<LfArticleAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL STATE (replaces @State in WC)
  // Article component has no mutable internal state beyond props.
  // The onStateChange callback is available for future state additions.
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE GETTERS - Read from closure + base getters
  // ═══════════════════════════════════════════════════════════════════════════
  const getters: LfArticleAdapterControllerGetters = {
    ...baseGetters,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE SETTERS - Write to closure + trigger render
  // Article component currently has no mutable state requiring setters.
  // The onStateChange callback is captured for future extensibility.
  // ═══════════════════════════════════════════════════════════════════════════
  void onStateChange; // Captured for future use

  return {
    controller: {
      get: getters,
      computed: prepArticleComputed(getAdapter),
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfArticleAdapter,
): LfArticleAdapterJsx => {
  return prepArticleJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfArticleAdapter,
): LfArticleAdapterHandlers => {
  return prepArticleHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_ARTICLE_BLOCKS.
 * Uses Maps for collections of elements per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfArticleAdapterRefs => {
  return {
    articles: new Map(),
    sections: new Map(),
    paragraphs: new Map(),
    contents: new Map(),
  };
};
//#endregion
