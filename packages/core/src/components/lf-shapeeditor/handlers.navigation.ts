import {
  LfShapeeditorAdapter,
  LfShapeeditorAdapterHandlers,
} from "@lf-widgets/foundations";
import { clearSelection, load } from "./helpers.utils";
import { LfShapeeditor } from "./lf-shapeeditor";

/**
 * Prepares the navigation panel event handlers.
 */
export const prepNavigationHandlers = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterHandlers["navigation"] => {
  return {
    //#region Expander handler (toggle navigation tree)
    expander: async (e: MouseEvent) => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { get, actions } = controller;
      const { compInstance } = get;

      const c = compInstance() as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      actions.navigation.toggle();
    },
    //#endregion

    //#region Load handler (load directory)
    load: async (e: MouseEvent) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;
      const { navigation } = adapter.elements.refs;

      const c = compInstance() as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      // Use the native button element for spinner toggle
      const buttonEl = navigation.jump.load;
      if (buttonEl) {
        buttonEl.setAttribute("data-loading", "true");
        try {
          await load(adapter);
        } finally {
          buttonEl.removeAttribute("data-loading");
        }
      } else {
        await load(adapter);
      }
    },
    //#endregion

    //#region Masonry handler
    masonry: (e) => {
      const { eventType, selectedShape } = e.detail;

      const adapter = getAdapter();
      const { controller } = adapter;
      const { get, set, actions } = controller;
      const { compInstance, history } = get;
      const { current } = history;

      const c = compInstance() as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      switch (eventType) {
        case "click":
          const currentShape = get.currentShape();
          if (currentShape?.shape?.index === selectedShape.index) {
            clearSelection(adapter);
          } else {
            set.currentShape(selectedShape);

            const h = current();
            set.history.index(h ? h.length - 1 : 0);
            actions.history.new(selectedShape);
          }
          break;
      }
    },
    //#endregion

    //#region Textfield handler
    textfield: (e: Event, value: string) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance() as LfShapeeditor;

      // Store the value for the load handler to use
      // The textfield value is accessed via the native input element ref
      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Tree handler
    tree: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance() as LfShapeeditor;

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion
  };
};
