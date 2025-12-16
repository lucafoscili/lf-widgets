import {
  LfToggleAdapter,
  LfToggleAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the toggle component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (toggle)
 * - Routes all events through dispatcher
 * - Manually triggers ripple on pointerdown (input covers the ripple host)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepToggleHandlers = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterHandlers => {
  return {
    toggle: {
      onBlur: (e: FocusEvent) => {
        const { dispatcher } = getAdapter();
        dispatcher.emit("blur", { originalEvent: e });
      },
      onChange: (e: Event) => {
        const adapter = getAdapter();
        const { controller, dispatcher } = adapter;
        const { actions } = controller;

        actions.toggle();
        dispatcher.emit("change", { originalEvent: e });
      },
      onFocus: (e: FocusEvent) => {
        const { dispatcher } = getAdapter();
        dispatcher.emit("focus", { originalEvent: e });
      },
      onPointerDown: (e: PointerEvent) => {
        const adapter = getAdapter();
        const { controller, dispatcher, elements } = adapter;
        const { get } = controller;
        const { refs } = elements;

        // Manually trigger ripple on the underlay (native input covers it)
        const framework = get.framework();
        const thumbUnderlay = refs.thumbUnderlay;
        if (framework && thumbUnderlay) {
          framework.effects.trigger.ripple(thumbUnderlay, e);
        }

        dispatcher.emit("pointerdown", { originalEvent: e });
      },
    },
    label: {
      onClick: (e: MouseEvent) => {
        const adapter = getAdapter();
        const { controller, dispatcher } = adapter;
        const { actions } = controller;

        actions.toggle();
        dispatcher.emit("change", { originalEvent: e });
      },
    },
  };
};
