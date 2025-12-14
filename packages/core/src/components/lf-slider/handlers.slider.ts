import {
  LfSliderAdapter,
  LfSliderAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the slider component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (setValue, setDisplayValue)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSliderHandlers = (
  getAdapter: () => LfSliderAdapter,
): LfSliderAdapterHandlers => {
  return {
    blur: (e: FocusEvent) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;
      dispatcher.emit("blur", { originalEvent: e });
    },

    change: (e: Event) => {
      const adapter = getAdapter();
      const { controller, dispatcher, elements } = adapter;
      const { setValue } = controller.actions;
      const { input } = elements.refs;

      if (input) {
        setValue(+input.value);
      }
      dispatcher.emit("change", { originalEvent: e });
    },

    focus: (e: FocusEvent) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;
      dispatcher.emit("focus", { originalEvent: e });
    },

    input: (e: Event) => {
      const adapter = getAdapter();
      const { controller, dispatcher, elements } = adapter;
      const { setDisplayValue } = controller.actions;
      const { input } = elements.refs;

      if (input) {
        setDisplayValue(+input.value);
      }
      dispatcher.emit("input", { originalEvent: e });
    },

    pointerdown: (e: PointerEvent) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;
      dispatcher.emit("pointerdown", { originalEvent: e });
    },
  };
};
