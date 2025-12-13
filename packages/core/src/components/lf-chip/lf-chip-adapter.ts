import {
  LfChipAdapter,
  LfChipAdapterControllerActions,
  LfChipAdapterControllerComputed,
  LfChipAdapterControllerGetters,
  LfChipAdapterControllerSetters,
  LfChipAdapterJsx,
  LfChipAdapterRefs,
} from "@lf-widgets/foundations";

/**
 * Creates the canonical adapter for lf-chip.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + styling
 * - controller.set: Simple setters (empty for chip)
 * - controller.computed: Derived predicates (isChoice, isFilter, isInput, isSelected, etc.)
 * - controller.actions: Complex operations (toggleExpansion, toggleSelection, deleteNode)
 * - elements: JSX + Refs registry
 * - dispatcher: Centralized event emission (passed from component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfChipAdapterControllerGetters,
  setters: LfChipAdapterControllerSetters,
  computed: LfChipAdapterControllerComputed,
  actions: LfChipAdapterControllerActions,
  jsx: LfChipAdapterJsx,
  _getAdapter: () => LfChipAdapter,
): Omit<LfChipAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: setters,
      computed,
      actions,
    },
    elements: {
      jsx,
      refs: createRefs(),
    },
  };
};
//#endregion

//#region Refs
/**
 * Creates refs structure for lf-chip.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfChipAdapterRefs => {
  return {
    items: new Map<string, HTMLElement>(),
  };
};
//#endregion
