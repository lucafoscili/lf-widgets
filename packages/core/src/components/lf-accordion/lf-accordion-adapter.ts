import {
  LfAccordionAdapter,
  LfAccordionAdapterControllerActions,
  LfAccordionAdapterControllerComputed,
  LfAccordionAdapterControllerGetters,
  LfAccordionAdapterControllerSetters,
  LfAccordionAdapterJsx,
  LfAccordionAdapterRefs,
} from "@lf-widgets/foundations";
import { prepAccordion } from "./elements.accordion";

/**
 * Creates the canonical adapter for lf-accordion.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: N/A for accordion
 * - controller.computed: Derived predicates (isExpanded, isExpandible, isSelected)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: N/A for accordion
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfAccordionAdapterControllerGetters,
  setters: LfAccordionAdapterControllerSetters,
  computed: LfAccordionAdapterControllerComputed,
  actions: LfAccordionAdapterControllerActions,
  getAdapter: () => LfAccordionAdapter,
): Omit<LfAccordionAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: setters,
      computed,
      actions,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfAccordionAdapter,
): LfAccordionAdapterJsx => {
  return prepAccordion(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_ACCORDION_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfAccordionAdapterRefs => {
  return {
    accordion: null,
    headers: new Map(),
  };
};
//#endregion
