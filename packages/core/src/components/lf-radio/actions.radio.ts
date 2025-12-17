import {
  LfDataNode,
  LfRadioAdapter,
  LfRadioAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-radio.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * "Adapter as Core" Pattern:
 * - Reads value from adapter closure via `controller.get.value()`
 * - Writes value via `controller.set.value()` (triggers onStateChange)
 * - NOT via `compInstance().value` (which is now a bridge getter)
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepRadioActions = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterControllerActions => ({
  /**
   * Selects a radio item by node ID.
   * Only works when:
   * - The node exists
   * - The node is not disabled
   * - The radio group is not disabled
   */
  select: (nodeId: string | undefined) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const comp = compInstance();

    if (comp.lfUiState === "disabled") {
      return;
    }

    if (nodeId) {
      const node = comp.lfDataset?.nodes?.find(
        (n: LfDataNode) => n.id === nodeId,
      );
      if (node?.isDisabled) {
        return;
      }
    }

    // Write to adapter closure state via setter
    adapter.controller.set.value(nodeId);
  },

  /**
   * Clears the current selection.
   * Sets value to undefined via adapter setter.
   */
  clear: () => {
    getAdapter().controller.set.value(undefined);
  },

  /**
   * Focuses the next radio item in the list.
   * Wraps around at the end.
   */
  focusNext: () => {
    const adapter = getAdapter();
    const { compInstance, value } = adapter.controller.get;
    const comp = compInstance();
    const nodes = comp.lfDataset?.nodes;

    if (!nodes || nodes.length === 0) {
      return;
    }

    const currentValue = value();
    const currentIndex = currentValue
      ? nodes.findIndex((n: LfDataNode) => n.id === currentValue)
      : -1;

    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % nodes.length;
    const nextNode = nodes[nextIndex];

    if (nextNode && !nextNode.isDisabled) {
      adapter.controller.set.value(nextNode.id);
      const inputEl = adapter.elements.refs.inputs.get(nextNode.id);
      inputEl?.focus();
    }
  },

  /**
   * Focuses the previous radio item in the list.
   * Wraps around at the beginning.
   */
  focusPrevious: () => {
    const adapter = getAdapter();
    const { compInstance, value } = adapter.controller.get;
    const comp = compInstance();
    const nodes = comp.lfDataset?.nodes;

    if (!nodes || nodes.length === 0) {
      return;
    }

    const currentValue = value();
    const currentIndex = currentValue
      ? nodes.findIndex((n: LfDataNode) => n.id === currentValue)
      : -1;

    const prevIndex =
      currentIndex === -1
        ? nodes.length - 1
        : (currentIndex - 1 + nodes.length) % nodes.length;
    const prevNode = nodes[prevIndex];

    if (prevNode && !prevNode.isDisabled) {
      adapter.controller.set.value(prevNode.id);
      const inputEl = adapter.elements.refs.inputs.get(prevNode.id);
      inputEl?.focus();
    }
  },

  /**
   * Updates the dataset.
   * Resets selection if current selection is not in new dataset.
   */
  updateDataset: (dataset) => {
    const adapter = getAdapter();
    const { compInstance, value } = adapter.controller.get;
    const comp = compInstance();

    const currentSelectedId = value();
    comp.lfDataset = dataset;

    if (currentSelectedId) {
      const stillExists = dataset?.nodes?.some(
        (n) => n.id === currentSelectedId,
      );
      if (!stillExists) {
        adapter.controller.actions.clear();
      }
    }
  },
});
