import {
  LfArticleAdapter,
  LfArticleAdapterControllerActions,
  LfArticleAdapterControllerComputed,
  LfArticleAdapterControllerGetters,
  LfArticleAdapterControllerSetters,
  LfArticleAdapterHandlers,
  LfArticleAdapterJsx,
  LfArticleAdapterRefs,
} from "@lf-widgets/foundations";
import { prepArticleJsx } from "./elements.article";
import { prepArticleHandlers } from "./handlers.article";

/**
 * Creates the canonical adapter for lf-article.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple setters (none for this component)
 * - controller.computed: Derived predicates (hasNodes)
 * - controller.actions: Complex operations (none for this component)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks for LfShape events
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfArticleAdapterControllerGetters,
  _setters: LfArticleAdapterControllerSetters,
  computed: LfArticleAdapterControllerComputed,
  _actions: LfArticleAdapterControllerActions,
  getAdapter: () => LfArticleAdapter,
): Omit<LfArticleAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      computed,
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
