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
    button: (e) => {
      const { eventType, id, valueAsBoolean } = e.detail;

      const { set } = getAdapter().controller;
      const { leftButton, changeView, rightButton } = LF_COMPARE_IDS;

      switch (eventType) {
        case "click":
          switch (id) {
            case leftButton:
              set.leftPanelOpened(valueAsBoolean);
              break;
            case changeView:
              set.splitView(valueAsBoolean);
              break;
            case rightButton:
              set.rightPanelOpened(valueAsBoolean);
              break;
          }
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
