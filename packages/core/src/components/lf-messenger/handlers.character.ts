import {
  LfListEventPayload,
  LfMessengerAdapter,
  LfMessengerAdapterHandlers,
} from "@lf-widgets/foundations";
import { downloadJson } from "./helpers.utils";

export const prepCharacterHandlers = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterHandlers["character"] => {
  return {
    //#region Button
    button: async (e) => {
      const { eventType, originalEvent } = e.detail;

      const { controller, handlers } = getAdapter();
      const { get, set } = controller;
      const { list } = handlers.character;
      const { inProgress } = get.status.save;

      switch (eventType) {
        case "click":
          if (!inProgress()) {
            set.data();
          }
          break;
        case "lf-event":
          list(originalEvent as CustomEvent<LfListEventPayload>);
          break;
      }
    },
    //#endregion

    //#region List
    list: async (e) => {
      const { eventType, node } = e.detail;

      const { controller } = getAdapter();
      const { character, compInstance, config, history } = controller.get;

      let strJson = "";
      switch (eventType) {
        case "click":
          switch (node.id) {
            case "full_history":
              strJson = JSON.stringify(history(), null, 2);
              break;
            case "history":
              strJson = character.history();
              break;
            case "lfDataset":
              strJson = JSON.stringify(compInstance.lfDataset, null, 2);
              break;
            case "settings":
              strJson = JSON.stringify(config(), null, 2);
              break;
          }

          downloadJson(strJson, node);
      }
    },
    //#endregion
  };
};
