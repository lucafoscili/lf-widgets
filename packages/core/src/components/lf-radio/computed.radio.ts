import {
  LfRadioAdapter,
  LfRadioAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-radio.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepRadioComputed = (
  getAdapter: () => LfRadioAdapter,
): LfRadioAdapterControllerComputed => ({
  /**
   * Whether the radio group is disabled based on lfUiState.
   * Used to control pointer-events and aria-disabled.
   */
  isDisabled: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfUiState === "disabled";
  },

  /**
   * Whether the radio group has nodes to display.
   * Determines if the component should render.
   */
  hasNodes: () => {
    const { compInstance } = getAdapter().controller.get;
    const nodes = compInstance().lfDataset?.nodes;
    return Boolean(nodes && nodes.length > 0);
  },

  /**
   * Whether the radio group is in horizontal orientation.
   * Controls layout direction.
   */
  isHorizontal: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfOrientation === "horizontal";
  },

  /**
   * Whether labels should be leading (before the radio control).
   * Controls label position.
   */
  isLeadingLabel: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfLeadingLabel === true;
  },

  /**
   * Whether ripple effect is enabled.
   * Controls ripple interaction.
   */
  hasRipple: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfRipple === true;
  },

  /**
   * Gets the currently selected node ID.
   */
  selectedId: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().value;
  },

  /**
   * Returns a function that checks if a specific node is selected.
   */
  isSelected: (nodeId: string) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().value === nodeId;
  },
});
