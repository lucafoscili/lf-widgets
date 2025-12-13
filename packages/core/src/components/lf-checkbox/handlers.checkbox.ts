import {
  LfCheckboxAdapter,
  LfCheckboxAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the checkbox component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (toggle)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepCheckboxHandlers = (
  getAdapter: () => LfCheckboxAdapter,
): LfCheckboxAdapterHandlers => {
  return {
    checkbox: {
      onBlur: (e: FocusEvent) => {
        const { dispatcher } = getAdapter();
        dispatcher.emit("blur", { originalEvent: e });
      },
      onChange: (e: Event) => {
        const { controller, dispatcher } = getAdapter();
        const { actions } = controller;

        actions.toggle();
        dispatcher.emit("change", { originalEvent: e });
      },
      onFocus: (e: FocusEvent) => {
        const { dispatcher } = getAdapter();
        dispatcher.emit("focus", { originalEvent: e });
      },
      onPointerDown: (e: PointerEvent) => {
        const { dispatcher } = getAdapter();
        dispatcher.emit("pointerdown", { originalEvent: e });
      },
    },
    label: {
      onClick: (e: MouseEvent) => {
        const { controller, dispatcher } = getAdapter();
        const { actions } = controller;

        actions.toggle();
        dispatcher.emit("change", { originalEvent: e });
      },
    },
  };
};
