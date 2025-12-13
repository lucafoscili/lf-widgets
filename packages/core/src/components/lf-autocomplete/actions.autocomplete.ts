import {
  LfAutocompleteAdapter,
  LfAutocompleteAdapterControllerActions,
  LfDataNode,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-autocomplete.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepAutocompleteActions = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterControllerActions => ({
  /**
   * Updates the input value.
   * Note: Debounce logic is handled in the handlers for better encapsulation.
   */
  updateInput: async (value: string) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const { elements } = adapter;
    const comp = compInstance();

    comp.inputValue = value;

    const { textfield } = elements.refs;
    if (textfield) {
      await textfield.setValue(value);
    }
  },

  /**
   * Selects a node from the dropdown list.
   * Updates input value and emits change event.
   */
  selectNode: async (node: LfDataNode) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const { dispatcher, elements } = adapter;
    const comp = compInstance();

    comp.inputValue = String(node.value || "");

    const { textfield } = elements.refs;
    if (textfield) {
      await textfield.setValue(comp.inputValue);
    }

    adapter.controller.set.list("close");
    textfield?.setFocus();

    dispatcher.emit("change", { node });
  },

  /**
   * Highlights a specific index in the dropdown list.
   */
  highlight: (index: number) => {
    const { compInstance } = getAdapter().controller.get;
    compInstance().highlightedIndex = index;
  },

  /**
   * Clears the autocomplete cache.
   */
  clearCache: () => {
    const { cache } = getAdapter().controller.get;
    cache().clear();
  },

  /**
   * Clears the input field.
   */
  clearInput: async () => {
    const adapter = getAdapter();
    await adapter.controller.actions.updateInput("");
  },
});
