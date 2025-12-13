import { LfListAdapter, LfListAdapterHandlers } from "@lf-widgets/foundations";

/**
 * Prepares handler functions for the list component.
 *
 * v4.0.0 Architecture:
 * - All events route through dispatcher.emit()
 * - Uses controller.get for state access (all getters are functions)
 * - Uses controller.actions for complex operations
 * - Uses controller.set for simple state changes
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepListHandlers = (
  getAdapter: () => LfListAdapter,
): LfListAdapterHandlers => {
  return {
    //#region Delete Icon
    deleteIcon: async (event, node) => {
      const { controller, dispatcher } = getAdapter();
      const { compInstance } = controller.get;
      const { deleteNode } = controller.actions;
      const comp = compInstance();

      const index = comp.lfDataset?.nodes?.indexOf(node) ?? -1;
      deleteNode(index);
      dispatcher.emit("delete", { originalEvent: event, node });
    },
    //#endregion

    //#region Filter
    filter: async (event) => {
      const { eventType, inputValue } = event.detail;

      const { controller, dispatcher } = getAdapter();
      const { set } = controller;

      switch (eventType) {
        case "input":
          set.filter.debounce(inputValue);
          break;
      }

      dispatcher.emit("lf-event", { originalEvent: event, node: null });
    },
    //#endregion

    //#region Node
    node: {
      blur: async (event, node, _index) => {
        const { controller, dispatcher } = getAdapter();
        controller.set.focused(null);
        dispatcher.emit("blur", { originalEvent: event, node });
      },
      click: async (event, node, index) => {
        const { controller, dispatcher } = getAdapter();
        const { compInstance } = controller.get;
        const { selectNode } = controller.actions;
        const comp = compInstance();

        controller.set.focused(index);

        // Get original index from visible index
        const visibleNodes = getVisibleNodes(getAdapter);
        const clickedNode = visibleNodes[index];
        const originalIndex = clickedNode
          ? (comp.lfDataset?.nodes?.findIndex((n) => n.id === clickedNode.id) ??
            -1)
          : -1;

        selectNode(originalIndex);
        dispatcher.emit("click", { originalEvent: event, node });
      },
      focus: async (event, node, index) => {
        const { controller, dispatcher } = getAdapter();
        controller.set.focused(index);
        dispatcher.emit("focus", { originalEvent: event, node });
      },
      pointerdown: async (event, node, _index) => {
        const { dispatcher } = getAdapter();
        dispatcher.emit("pointerdown", { originalEvent: event, node });
      },
    },
    //#endregion
  };
};

/**
 * Helper to get visible nodes (not hidden by filter).
 */
function getVisibleNodes(getAdapter: () => LfListAdapter) {
  const { compInstance, hiddenNodes } = getAdapter().controller.get;
  const comp = compInstance();
  const hidden = hiddenNodes();
  return comp.lfDataset?.nodes?.filter((node) => !hidden.has(node)) || [];
}
