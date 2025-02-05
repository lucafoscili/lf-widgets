import {
  LF_MASONRY_IDS,
  LfMasonryAdapter,
  LfMasonryAdapterHandlers,
} from "@lf-widgets/foundations";
import { addColumn, changeView, removeColumn } from "./helpers.utils";

export const controlsHandlers = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterHandlers => {
  return {
    //#region Button
    button: (e) => {
      const { eventType, id } = e.detail;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_MASONRY_IDS.masonry:
              changeView(getAdapter());
              break;
            case LF_MASONRY_IDS.removeColumn:
              removeColumn(getAdapter());
              break;
            case LF_MASONRY_IDS.addColumn:
              addColumn(getAdapter());
              break;
          }
          break;
      }
    },
    //#endregion
  };
};
