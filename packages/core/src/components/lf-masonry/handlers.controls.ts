import {
  LF_MASONRY_IDS,
  LfMasonryAdapter,
  LfMasonryAdapterHandlers,
} from "@lf-widgets/foundations";

export const controlsHandlers = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterHandlers => {
  return {
    //#region Button
    button: (e) => {
      const { eventType, id } = e.detail;
      const { actions } = getAdapter().controller;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_MASONRY_IDS.masonry:
              actions.cycleView();
              break;
            case LF_MASONRY_IDS.removeColumn:
              actions.removeColumn();
              break;
            case LF_MASONRY_IDS.addColumn:
              actions.addColumn();
              break;
          }
          break;
      }
    },
    //#endregion
  };
};
