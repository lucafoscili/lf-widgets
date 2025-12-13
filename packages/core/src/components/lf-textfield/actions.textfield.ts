import {
  LfTextfieldAdapter,
  LfTextfieldAdapterControllerActions,
} from "@lf-widgets/foundations";
import { forceUpdate } from "@stencil/core";

/**
 * Factory to create action functions for lf-textfield.
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
export const prepTextfieldActions = (
  getAdapter: () => LfTextfieldAdapter,
): LfTextfieldAdapterControllerActions => ({
  /**
   * Focuses the input element.
   */
  focus: () => {
    const adapter = getAdapter();
    const { input } = adapter.elements.refs;
    input?.focus();
  },

  /**
   * Blurs the input element.
   */
  blur: () => {
    const adapter = getAdapter();
    const { input } = adapter.elements.refs;
    input?.blur();
  },

  /**
   * Updates the field value and emits change event.
   * Only works when not disabled.
   */
  updateState: (
    value: string,
    e: Event | CustomEvent = new CustomEvent("change"),
  ) => {
    const adapter = getAdapter();
    const { isDisabled } = adapter.controller.computed;
    const { value: setValue } = adapter.controller.set;

    if (!isDisabled()) {
      setValue(value);
      adapter.dispatcher.emit("change", {
        originalEvent: e,
        inputValue: value,
        value,
      });
    }
  },

  /**
   * Formats the content of the textarea as JSON.
   * Updates formatting error state on failure.
   */
  formatJSON: async () => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const { formattingError: setFormattingError, value: setValue } =
      adapter.controller.set;
    const comp = compInstance();

    try {
      const indentSpaces = comp.lfFormatJSON?.indentSpaces || 2;
      const trimmed = (comp.value ?? "").trim();
      const parsed = JSON.parse(trimmed);
      setValue(JSON.stringify(parsed, null, indentSpaces));
      setFormattingError("");
      forceUpdate(comp);
    } catch (err) {
      setFormattingError(err?.message || "Invalid JSON format");
      forceUpdate(comp);
    }
  },
});
