import {
  LfTextfieldAdapter,
  LfTextfieldAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the textfield component.
 *
 * "Adapter as Core" Architecture:
 * - Handlers read internal state via `controller.get.value()`
 * - Handlers write via `controller.set.value()` which triggers onStateChange
 * - Uses `controller.actions` for complex operations (updateState, formatJSON)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepTextfieldHandlers = (
  getAdapter: () => LfTextfieldAdapter,
): LfTextfieldAdapterHandlers => {
  /**
   * Check if a keyboard shortcut should be captured.
   */
  const shouldCaptureShortcut = (e: KeyboardEvent): boolean => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const comp = compInstance();

    if (!comp.lfCaptureShortcuts) {
      return false;
    }

    const isModifierPressed = e.ctrlKey || e.metaKey;
    if (!isModifierPressed) {
      return false;
    }

    const key = (e.key || "").toLowerCase();

    if (e.shiftKey && key === "z") {
      return true;
    }

    switch (key) {
      case "c":
      case "v":
      case "x":
      case "z":
      case "y":
      case "a":
        return true;
      default:
        return false;
    }
  };

  return {
    input: {
      onBlur: (e: FocusEvent) => {
        const adapter = getAdapter();
        const { compInstance, value: getValue } = adapter.controller.get;
        const { status } = adapter.controller.set;
        const { formatJSON } = adapter.controller.actions;
        const comp = compInstance();

        status("focused", false);

        // Handle JSON formatting on blur if configured
        const { onBlur } = comp.lfFormatJSON || {};
        if (comp.lfFormatJSON !== null && onBlur) {
          formatJSON();
        }

        adapter.dispatcher.emit("blur", {
          originalEvent: e,
          inputValue: (e.target as HTMLInputElement)?.value,
          value: getValue(),
          target: adapter.elements.refs.input,
        });
      },

      onChange: (e: Event) => {
        const adapter = getAdapter();
        const { updateState, formatJSON } = adapter.controller.actions;
        const { compInstance } = adapter.controller.get;
        const comp = compInstance();

        const value = (e.currentTarget as HTMLInputElement).value;
        updateState(value, e);

        // Handle JSON formatting on blur (change fires after blur for textarea)
        const { onBlur } = comp.lfFormatJSON || {};
        if (comp.lfFormatJSON !== null && onBlur) {
          formatJSON();
        }
      },

      onClick: (e: MouseEvent) => {
        const adapter = getAdapter();
        const { value: getValue } = adapter.controller.get;

        adapter.dispatcher.emit("click", {
          originalEvent: e,
          inputValue: (e.target as HTMLInputElement)?.value,
          value: getValue(),
          target: adapter.elements.refs.input,
        });
      },

      onFocus: (e: FocusEvent) => {
        const adapter = getAdapter();
        const { value: getValue } = adapter.controller.get;
        const { status } = adapter.controller.set;

        status("focused", true);

        adapter.dispatcher.emit("focus", {
          originalEvent: e,
          inputValue: (e.target as HTMLInputElement)?.value,
          value: getValue(),
          target: adapter.elements.refs.input,
        });
      },

      onInput: (e: Event) => {
        const adapter = getAdapter();
        const { value: getValue } = adapter.controller.get;

        adapter.dispatcher.emit("input", {
          originalEvent: e,
          inputValue: (e.target as HTMLInputElement)?.value,
          value: getValue(),
          target: adapter.elements.refs.input,
        });

        // Note: Debounced JSON formatting on input is handled in the component via timeout
      },

      onKeyDown: (e: KeyboardEvent) => {
        const adapter = getAdapter();
        const { value: getValue } = adapter.controller.get;

        if (shouldCaptureShortcut(e)) {
          e.stopPropagation();
        }

        adapter.dispatcher.emit("keydown", {
          originalEvent: e,
          inputValue: (e.target as HTMLInputElement)?.value,
          value: getValue(),
          target: adapter.elements.refs.input,
        });
      },
    },

    icon: {
      onClick: (e: MouseEvent, iconType: "regular" | "action") => {
        const adapter = getAdapter();
        const { value: getValue } = adapter.controller.get;

        adapter.dispatcher.emit("click", {
          originalEvent: e,
          iconType,
          value: getValue(),
          target:
            iconType === "action"
              ? adapter.elements.refs.iconAction
              : adapter.elements.refs.icon,
        });
      },
    },
  };
};
