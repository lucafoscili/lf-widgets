import {
  LfImageAdapter,
  LfImageAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the image component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.set` for simple assignments (error, isLoaded)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepImageHandlers = (
  getAdapter: () => LfImageAdapter,
): LfImageAdapterHandlers => {
  return {
    click: (e) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;
      dispatcher.emit("click", { originalEvent: e });
    },
    contextmenu: (e) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;
      dispatcher.emit("contextmenu", { originalEvent: e });
    },
    error: (e) => {
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const { set } = controller;

      set.error(true);
      set.isLoaded(false);
      dispatcher.emit("error", { originalEvent: e });
    },
    load: (e) => {
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const { set } = controller;

      set.error(false);
      set.isLoaded(true);
      dispatcher.emit("load", { originalEvent: e });
    },
  };
};
