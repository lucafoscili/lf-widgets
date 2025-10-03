import {
  LfEvent,
  LfImageviewerAdapter,
  LfImageviewerAdapterHandlers,
} from "@lf-widgets/foundations";
import { clearSelection, load, toggleButtonSpinner } from "./helpers.utils";
import { LfImageviewer } from "./lf-imageviewer";

export const prepNavigationHandlers = (
  getAdapter: () => LfImageviewerAdapter,
): LfImageviewerAdapterHandlers["navigation"] => {
  return {
    //#region Button handler
    button: async (e) => {
      const { comp, eventType } = e.detail;

      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const c = compInstance as LfImageviewer;

      c.onLfEvent(e, "lf-event");

      switch (eventType) {
        case "click":
          toggleButtonSpinner(comp, () => load(adapter));
          break;
      }
    },
    //#endregion

    //#region Masonry handler
    masonry: (e) => {
      const { eventType, originalEvent, selectedShape } = e.detail;

      const adapter = getAdapter();
      const { controller } = adapter;
      const { get, set } = controller;
      const { compInstance, history } = get;
      const { current } = history;

      const c = compInstance as LfImageviewer;

      c.onLfEvent(e, "lf-event");

      switch (eventType) {
        case "lf-event":
          const orig = originalEvent as LfEvent;
          switch (orig.detail.eventType) {
            case "click":
              const currentShape = get.currentShape();
              if (currentShape?.shape?.index === selectedShape.index) {
                clearSelection(adapter);
              } else {
                set.currentShape(selectedShape);

                const h = current();
                set.history.index(h ? h.length - 1 : 0);
                set.history.new(selectedShape);
              }
              break;
          }
      }
    },
    //#endregion

    //#region Textfield handler
    textfield: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance as LfImageviewer;

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Tree handler
    tree: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance as LfImageviewer;

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Tree toggle handler
    treeToggle: (e) => {
      const { eventType } = e.detail;

      const adapter = getAdapter();
      const { controller } = adapter;
      const { get, set } = controller;
      const { compInstance, navigationTree } = get;

      const comp = compInstance as LfImageviewer;

      comp.onLfEvent(e, "lf-event");

      if (eventType === "click") {
        const config = navigationTree();
        set.navigationTreeOpen(!config.open);
      }
    },
    //#endregion
  };
};
