import {
  LfButtonAdapter,
  LfButtonAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-button.
 *
 * "Adapter as Core" Architecture:
 * - Computed values read internal state via `controller.get.value()`
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping computed logic separate
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
   * Reads from adapter's internal state via the getter.
   * Controls icon display and aria-pressed attribute.
   */
  isOn: () => {
    return getAdapter().controller.get.value() === "on";
  },
});
