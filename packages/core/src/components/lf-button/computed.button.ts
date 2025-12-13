import {
  LfButtonAdapter,
  LfButtonAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-button.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepButtonComputed = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterControllerComputed => ({
  /**
   * Whether the button is disabled based on lfUiState.
   * Used to control pointer-events and aria-disabled.
   */
  isDisabled: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfUiState === "disabled";
  },

  /**
   * Whether the button has dropdown children.
   * Determines if the dropdown section should render.
   */
  isDropdown: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfDataset?.nodes?.[0]?.children?.length);
  },

  /**
   * Whether the button is in "on" state (for toggable buttons).
   * Controls icon display and aria-pressed attribute.
   */
  isOn: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().value === "on";
  },
});
