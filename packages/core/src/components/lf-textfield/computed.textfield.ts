import {
  LfTextfieldAdapter,
  LfTextfieldAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-textfield.
 *
 * "Adapter as Core" Architecture:
 * - Computed values read internal state via `controller.get.*`
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping computed logic separate
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepTextfieldComputed = (
  getAdapter: () => LfTextfieldAdapter,
): LfTextfieldAdapterControllerComputed => ({
  /**
   * Whether the textfield is disabled based on lfUiState.
   * Used to control pointer-events and aria-disabled.
   */
  isDisabled: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfUiState === "disabled";
  },

  /**
   * Whether the textfield uses outlined or textarea styling.
   * Determines label placement and underline rendering.
   */
  isOutlined: () => {
    const { compInstance } = getAdapter().controller.get;
    const styling = compInstance().lfStyling;
    return styling === "outlined" || styling === "textarea";
  },

  /**
   * Whether the textfield is a textarea.
   * Controls which input element to render.
   */
  isTextarea: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfStyling === "textarea";
  },
});
