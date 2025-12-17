import {
  LF_COMPARE_IDS,
  LfCompareAdapter,
  LfCompareAdapterHandlers,
} from "@lf-widgets/foundations";

export const prepToolbarHandlers = (
  getAdapter: () => LfCompareAdapter,
): LfCompareAdapterHandlers => {
  return {
    //#region Button
    button: (_e: MouseEvent, id: string, value?: boolean) => {
      const { actions, set } = getAdapter().controller;
      const { leftButton, changeView, rightButton } = LF_COMPARE_IDS;

      switch (id) {
        case leftButton:
          actions.toggleLeftPanel();
          break;
        case changeView:
          set.splitView(value);
          break;
        case rightButton:
          actions.toggleRightPanel();
          break;
      }
    },
    //#endregion

    //#region Tree
    tree: (e) => {
      const { eventType, id, node } = e.detail;

      const { get, set } = getAdapter().controller;
      const { shapes } = get;
      const { leftTree, rightTree } = LF_COMPARE_IDS;

      switch (eventType) {
        case "click":
          const shape = shapes()[parseInt(node.id)];
          switch (id) {
            case leftTree:
              set.leftShape(shape);
              break;
            case rightTree:
              set.rightShape(shape);
              break;
          }
          break;
      }
    },
  };
  //#endregion
};
