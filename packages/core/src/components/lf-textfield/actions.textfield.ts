import {
  LfTextfieldAdapter,
  LfTextfieldAdapterControllerActions,
} from "@lf-widgets/foundations";
import { forceUpdate } from "@stencil/core";

/**
 * Factory to create action functions for lf-textfield.
 *
 * "Adapter as Core" Architecture:
 * - Actions read internal state via `controller.get.value()`
 * - Actions write via `controller.set.value()` which triggers onStateChange
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping action logic separate
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
   * Reads current state via getter, writes via setter.
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
   * Reads value via getter, writes via setter.
   */
  formatJSON: async () => {
    const adapter = getAdapter();
    const { compInstance, value: getValue } = adapter.controller.get;
    const { formattingError: setFormattingError, value: setValue } =
      adapter.controller.set;
    const comp = compInstance();

    try {
      const indentSpaces = comp.lfFormatJSON?.indentSpaces || 2;
      const trimmed = (getValue() ?? "").trim();
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
