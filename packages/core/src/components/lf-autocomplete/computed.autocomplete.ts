import {
  LfAutocompleteAdapter,
  LfAutocompleteAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-autocomplete.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepAutocompleteComputed = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterControllerComputed => ({
  /**
   * Whether the autocomplete is disabled based on lfUiState.
   * Used to control pointer-events and aria-disabled.
   */
  isDisabled: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfUiState === "disabled";
  },

  /**
   * Whether the autocomplete is currently loading results.
   * Controls the spinner visibility.
   */
  isLoading: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().loading;
  },

  /**
   * Whether the autocomplete has cache enabled and populated.
   * Determines if cache-related UI elements should show.
   */
  hasCache: () => {
    const adapter = getAdapter();
    const { compInstance, cache } = adapter.controller.get;
    return compInstance().lfCache && cache().size > 0;
  },

  /**
   * Whether free input (non-dataset values) is allowed.
   * Controls validation behavior.
   */
  allowsFreeInput: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfAllowFreeInput;
  },

  /**
   * Gets the currently highlighted index for keyboard navigation.
   */
  highlightedIndex: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().highlightedIndex;
  },

  /**
   * Gets the current input value.
   */
  inputValue: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().inputValue;
  },

  /**
   * Gets the currently selected node (if any).
   */
  selectedNode: () => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const comp = compInstance();
    const dataset = comp.lfDataset;
    const inputVal = comp.inputValue;

    if (!dataset?.nodes?.length || !inputVal) {
      return null;
    }

    return (
      dataset.nodes.find((node) => String(node.value || "") === inputVal) ||
      null
    );
  },

  /**
   * Gets the index of a node by its ID.
   */
  indexById: (id: string) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfDataset?.nodes?.findIndex((n) => n.id === id) ?? -1;
  },
});
