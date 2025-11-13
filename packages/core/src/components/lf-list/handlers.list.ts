import { LfListAdapter, LfListAdapterHandlers } from "@lf-widgets/foundations";
import { LfList } from "./lf-list";

export const prepListHandlers = (
  getAdapter: () => LfListAdapter,
): LfListAdapterHandlers => {
  return {
    //#region Delete Icon
    deleteIcon: async (event, node) => {
      const { controller } = getAdapter();
      const { compInstance } = controller.get;
      const comp = compInstance as LfList;

      const index = comp.lfDataset?.nodes?.indexOf(node);
      comp.onLfEvent(event, "delete", node, index);
    },
    //#endregion

    //#region Filter
    filter: async (event) => {
      const { detail } = event;
      const { eventType } = detail;

      const { controller } = getAdapter();
      const { get, set } = controller;
      const comp = get.compInstance as LfList;

      switch (eventType) {
        case "input":
          const { value } = detail;
          set.filter.debounce(value);
          break;
      }

      comp.onLfEvent(event, "lf-event");
    },
    //#endregion

    //#region Node
    node: {
      blur: async (event, node, index) => {
        const { controller } = getAdapter();
        const { compInstance } = controller.get;
        const comp = compInstance as LfList;
        comp.onLfEvent(event, "blur", node, index);
      },
      click: async (event, node, index) => {
        const { controller } = getAdapter();
        const { compInstance } = controller.get;
        const comp = compInstance as LfList;
        comp.onLfEvent(event, "click", node, index);
      },
      focus: async (event, node, index) => {
        const { controller } = getAdapter();
        const { compInstance } = controller.get;
        const comp = compInstance as LfList;
        comp.onLfEvent(event, "focus", node, index);
      },
      pointerdown: async (event, node, index) => {
        const { controller } = getAdapter();
        const { compInstance } = controller.get;
        const comp = compInstance as LfList;
        comp.onLfEvent(event, "pointerdown", node, index);
      },
    },
    //#endregion
  };
};
