import {
  LfDataNode,
  LfTabbarAdapter,
  LfTabbarAdapterHandlers,
  LfTabbarEvent,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the tabbar component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (select, scroll)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepTabbarHandlers = (
  getAdapter: () => LfTabbarAdapter,
): LfTabbarAdapterHandlers => {
  return {
    tab: (
      e: Event | CustomEvent,
      eventType: LfTabbarEvent,
      index: number,
      node: LfDataNode,
    ) => {
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const { actions } = controller;

      if (eventType === "click") {
        actions.select(index, node);
      }

      dispatcher.emit(eventType, {
        index,
        node,
        originalEvent: e,
      });
    },
    navigation: (_e?: Event, direction?: "left" | "right") => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { actions } = controller;

      if (direction) {
        actions.scroll(direction);
      }
    },
  };
};
